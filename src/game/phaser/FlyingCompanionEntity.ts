import Phaser from 'phaser';

/**
 * Frame-based flap, for when a sprite sheet is available. Omit it from the
 * entity config and the squash-stretch stand-in runs instead.
 */
export interface FlapSheetConfig {
  /** Sprite sheet key, already registered with the scene's texture manager. */
  key: string;
  /** Animation to create. Defaults to `<key>:flap`. */
  animKey?: string;
  start?: number;
  /** Last frame, or -1 for every frame in the sheet. */
  end?: number;
  frameRate?: number;
}

export interface SparkleConfig {
  /** Soft dot texture. The entity bakes its own when this is omitted. */
  key?: string;
  tint?: number;
  /** Ceiling on simultaneously alive particles. Keep this small. */
  max?: number;
  /** Radius of the drift zone around the container origin. */
  radius?: number;
}

export interface FlyingCompanionConfig {
  heroKey: string;
  companionKey: string;
  /** Companion placement in the container's local space. */
  companionOffset: { x: number; y: number };
  /**
   * Draw the companion over the hero. This is child list order rather than
   * `setDepth`, because Phaser does not honour per-child display depth inside
   * a Container: "You also lose the ability to set the display depth of
   * Container children in the same flexible manner as those not within them."
   */
  companionInFront?: boolean;
  /** Hero's longest on-screen edge in px. Art is scaled to fit it. */
  heroSize?: number;
  /** Companion size as a fraction of the hero. */
  companionScale?: number;
  bob?: { distance?: number; duration?: number };
  /** Omit for the squash-stretch stand-in. */
  flap?: FlapSheetConfig;
  /** Omit for no ambient particles. */
  sparkle?: SparkleConfig;
}

const DEFAULTS = {
  heroSize: 132,
  companionScale: 0.46,
  bobDistance: 9,
  bobDuration: 1400,
  squashDuration: 430,
  flapFrameRate: 14,
  sparkMax: 16,
  sparkRadius: 58,
} as const;

/** Baked on demand when a config brings no sparkle texture of its own. */
const SPARK_KEY = 'fce:spark';

/**
 * A hovering hero with a companion drifting alongside it, plus ambient
 * sparkles, grouped so the whole formation can be positioned as one object.
 *
 * Nothing here reads or writes game state, and the idle motion is driven by
 * scene tweens rather than a per-frame update, so it is safe to drop into a
 * menu or showcase scene. Note that the bob rides each child's *local* y,
 * which leaves the container's own position free for the caller to set.
 *
 * Being a Container, it is not added to the scene for you:
 * `scene.add.existing(entity)`.
 */
export class FlyingCompanionEntity extends Phaser.GameObjects.Container {
  private readonly hero: Phaser.GameObjects.Sprite;
  private readonly companion: Phaser.GameObjects.Sprite;
  private readonly sparks: Phaser.GameObjects.Particles.ParticleEmitter | null;
  private readonly bobs: Phaser.Tweens.Tween[] = [];
  private readonly squashes: Phaser.Tweens.Tween[] = [];
  private readonly heroSize: number;
  private readonly companionSize: number;
  private readonly usesSheet: boolean;
  private heroScale = 1;
  private companionScale = 1;

  constructor(scene: Phaser.Scene, x: number, y: number, cfg: FlyingCompanionConfig) {
    super(scene, x, y);
    this.heroSize = cfg.heroSize ?? DEFAULTS.heroSize;
    this.companionSize = this.heroSize * (cfg.companionScale ?? DEFAULTS.companionScale);
    this.usesSheet = cfg.flap !== undefined;

    this.hero = new Phaser.GameObjects.Sprite(scene, 0, 0, cfg.heroKey);
    this.companion = new Phaser.GameObjects.Sprite(
      scene,
      cfg.companionOffset.x,
      cfg.companionOffset.y,
      cfg.companionKey,
    );
    this.refit();

    // Container children render in list order, so this ordering *is* the
    // layering. setDepth on a child would not reorder it against its sibling.
    this.add(cfg.companionInFront ? [this.hero, this.companion] : [this.companion, this.hero]);

    this.sparks = cfg.sparkle ? this.buildSparks(scene, cfg.sparkle) : null;
    if (this.sparks) this.add(this.sparks);

    this.buildBob(scene, cfg);
    this.buildFlap(scene, cfg.flap);
  }

  /**
   * Swap the art. Source textures can differ in size, so this refits both
   * sprites and restarts the squash tweens that were keyed to the old scales.
   */
  setSkins(heroKey: string, companionKey: string): void {
    if (this.hero.texture.key === heroKey && this.companion.texture.key === companionKey) return;
    this.hero.setTexture(heroKey);
    this.companion.setTexture(companionKey);
    this.refit();
    if (!this.usesSheet) this.buildSquash(this.scene);
  }

  /** Flip the companion's layering. List position, not depth. */
  setCompanionInFront(inFront: boolean): void {
    if (inFront) this.bringToTop(this.companion);
    else this.sendToBack(this.companion);
  }

  /** Halt or resume every idle animation, e.g. when the panel scrolls away. */
  setIdling(idling: boolean): void {
    for (const tween of this.bobs) {
      if (idling) tween.resume();
      else tween.pause();
    }
    for (const tween of this.squashes) {
      if (idling) tween.resume();
      else tween.pause();
    }
    if (this.usesSheet) {
      if (idling) this.hero.anims.resume();
      else this.hero.anims.pause();
    }
    if (this.sparks) {
      if (idling) this.sparks.start();
      else this.sparks.stop();
    }
  }

  /**
   * Tweens outlive their targets, so they have to be dropped by hand. The
   * children, emitter included, are destroyed by the Container itself.
   */
  preDestroy(): void {
    for (const tween of this.bobs) tween.remove();
    for (const tween of this.squashes) tween.remove();
    this.bobs.length = 0;
    this.squashes.length = 0;
    super.preDestroy();
  }

  /** Scale both sprites so their longest edge matches the configured size. */
  private refit(): void {
    this.heroScale = this.fitScale(this.hero.texture.key, this.heroSize);
    this.companionScale = this.fitScale(this.companion.texture.key, this.companionSize);
    this.hero.setScale(this.heroScale);
    this.companion.setScale(this.companionScale);
  }

  private fitScale(key: string, size: number): number {
    const source = this.scene.textures.get(key).source[0];
    const longest = source ? Math.max(source.width, source.height) : 0;
    return longest > 0 ? size / longest : 1;
  }

  private buildBob(scene: Phaser.Scene, cfg: FlyingCompanionConfig): void {
    const distance = cfg.bob?.distance ?? DEFAULTS.bobDistance;
    const duration = cfg.bob?.duration ?? DEFAULTS.bobDuration;
    this.bobs.push(
      scene.tweens.add({
        targets: this.hero,
        y: this.hero.y - distance,
        duration,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
      }),
    );
    // A longer period *and* a head start keep the companion off the hero's
    // rhythm. Matching durations would hold one fixed phase offset forever,
    // which still reads as a single body moving in two pieces.
    this.bobs.push(
      scene.tweens.add({
        targets: this.companion,
        y: this.companion.y - distance * 1.25,
        duration: duration * 1.18,
        delay: duration * 0.4,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
      }),
    );
  }

  private buildFlap(scene: Phaser.Scene, flap: FlapSheetConfig | undefined): void {
    if (!flap) {
      this.buildSquash(scene);
      return;
    }
    const animKey = flap.animKey ?? `${flap.key}:flap`;
    if (!scene.anims.exists(animKey)) {
      scene.anims.create({
        key: animKey,
        frames: scene.anims.generateFrameNumbers(flap.key, {
          start: flap.start ?? 0,
          end: flap.end ?? -1,
        }),
        frameRate: flap.frameRate ?? DEFAULTS.flapFrameRate,
        repeat: -1,
      });
    }
    // Frame playback runs on the animation clock, independent of the bob.
    this.hero.play(animKey);
  }

  /**
   * Stand-in for a flap sheet: a counter-squash on each sprite. They need one
   * tween each because they sit at different base scales, and the period is
   * deliberately not a factor of the bob's so the two never lock into step.
   */
  private buildSquash(scene: Phaser.Scene): void {
    for (const tween of this.squashes) tween.remove();
    this.squashes.length = 0;
    const pairs: readonly [Phaser.GameObjects.Sprite, number][] = [
      [this.hero, this.heroScale],
      [this.companion, this.companionScale],
    ];
    for (const [sprite, base] of pairs) {
      this.squashes.push(
        scene.tweens.add({
          targets: sprite,
          scaleX: base * 1.045,
          scaleY: base * 0.955,
          duration: DEFAULTS.squashDuration,
          ease: 'Sine.easeInOut',
          yoyo: true,
          repeat: -1,
        }),
      );
    }
  }

  private buildSparks(
    scene: Phaser.Scene,
    cfg: SparkleConfig,
  ): Phaser.GameObjects.Particles.ParticleEmitter {
    const key = cfg.key ?? SPARK_KEY;
    if (!cfg.key) ensureSparkTexture(scene, SPARK_KEY);
    const radius = cfg.radius ?? DEFAULTS.sparkRadius;
    const emit: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
      lifespan: 1500,
      speed: { min: 5, max: 20 },
      // Just enough negative gravity to make the motes rise rather than settle.
      gravityY: -10,
      scale: { min: 0.3, max: 0.75 },
      // Interpolating the op across a value list fades each mote in and back
      // out from one config, with no per-particle callback to pay for. The
      // repeated 1 holds it bright through the middle of its life; easing
      // straight from 0 to 1 to 0 leaves most motes sitting near invisible.
      alpha: { values: [0, 1, 1, 0], interpolation: 'linear' },
      frequency: 110,
      maxAliveParticles: cfg.max ?? DEFAULTS.sparkMax,
      blendMode: 'ADD',
      emitZone: {
        type: 'random',
        source: {
          // Rolled by hand rather than with a Geom.Circle, whose
          // getRandomPoint wants a Geom.Point and not the Vector2Like Phaser
          // hands to this callback. Square-rooting the radius spreads motes
          // evenly over the disc instead of bunching them at the centre.
          getRandomPoint: (point: Phaser.Types.Math.Vector2Like): void => {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.sqrt(Math.random()) * radius;
            point.x = Math.cos(angle) * dist;
            point.y = Math.sin(angle) * dist;
          },
        },
      },
    };
    if (cfg.tint !== undefined) emit.tint = cfg.tint;
    return scene.add.particles(0, 0, key, emit);
  }
}

/**
 * A soft dot: a bright core inside a dim halo, so the entity needs no
 * preloaded art to show sparkles. Additive blending does the glow.
 */
function ensureSparkTexture(scene: Phaser.Scene, key: string): void {
  if (scene.textures.exists(key)) return;
  const size = 24;
  const half = size / 2;
  const gfx = scene.make.graphics({}, false);
  gfx.fillStyle(0xffffff, 0.16);
  gfx.fillCircle(half, half, half);
  gfx.fillStyle(0xffffff, 0.4);
  gfx.fillCircle(half, half, half * 0.55);
  gfx.fillStyle(0xffffff, 1);
  gfx.fillCircle(half, half, half * 0.26);
  gfx.generateTexture(key, size, size);
  gfx.destroy();
}

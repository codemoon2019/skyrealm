export type SpriteId =
  | 'player'
  | 'ember'
  | 'ion'
  | 'ally'
  | 'scout'
  | 'drone'
  | 'zigzag'
  | 'tank'
  | 'swarm'
  | 'kamikaze'
  | 'wraith'
  | 'titan'
  | 'core'
  | 'rockBig'
  | 'rockMed'
  | 'rockSmall'
  | 'laser'
  | 'cannon'
  | 'plasma'
  | 'eLaser'
  | 'eMissile'
  | 'flare'
  | 'shieldFx'
  | 'puWeapon'
  | 'puShield'
  | 'puHealth'
  | 'puRapid'
  | 'puBomb'
  | 'puScore'
  | 'nebula';

export interface DrawOpts {
  angle?: number;
  size?: number;
  w?: number;
  h?: number;
  alpha?: number;
  glow?: string;
  glowBlur?: number;
}

const PATHS: Record<SpriteId, string> = {
  player: '/sprites/playerShip1_blue.webp',
  ember: '/sprites/enemyRed4.webp',
  ion: '/sprites/playerShip3_green.webp',
  ally: '/sprites/playerShip3_green.webp',
  scout: '/sprites/enemyRed1.webp',
  drone: '/sprites/enemyRed2.webp',
  zigzag: '/sprites/enemyGreen3.webp',
  tank: '/sprites/enemyBlack4.webp',
  swarm: '/sprites/enemyRed5.webp',
  kamikaze: '/sprites/enemyRed4.webp',
  wraith: '/sprites/enemyBlack5.webp',
  titan: '/sprites/ufoBlue.webp',
  core: '/sprites/ufoRed.webp',
  rockBig: '/sprites/meteorBrown_big1.webp',
  rockMed: '/sprites/meteorBrown_med1.webp',
  rockSmall: '/sprites/meteorBrown_small1.webp',
  laser: '/sprites/laserBlue01.webp',
  cannon: '/sprites/laserBlue08.webp',
  plasma: '/sprites/laserBlue10.webp',
  eLaser: '/sprites/laserRed01.webp',
  eMissile: '/sprites/laserRed08.webp',
  flare: '/sprites/fire08.webp',
  shieldFx: '/sprites/shield1.webp',
  puWeapon: '/sprites/powerupBlue_bolt.webp',
  puShield: '/sprites/powerupBlue_shield.webp',
  puHealth: '/sprites/powerupGreen_star.webp',
  puRapid: '/sprites/powerupYellow_bolt.webp',
  puBomb: '/sprites/powerupRed_bolt.webp',
  puScore: '/sprites/powerupYellow_star.webp',
  nebula: '/sprites/nebula.webp',
};

class SpriteBank {
  private readonly images = new Map<SpriteId, HTMLImageElement>();
  ready = false;

  async load(): Promise<void> {
    const entries = Object.entries(PATHS) as [SpriteId, string][];
    await Promise.all(entries.map(([id, src]) => this.loadOne(id, src)));
    this.ready = true;
  }

  has(id: SpriteId): boolean {
    return this.images.has(id);
  }

  image(id: SpriteId): HTMLImageElement | undefined {
    return this.images.get(id);
  }

  draw(ctx: CanvasRenderingContext2D, id: SpriteId, x: number, y: number, opts: DrawOpts = {}): boolean {
    const img = this.images.get(id);
    if (!img) return false;
    const angle = opts.angle ?? 0;
    const alpha = opts.alpha ?? 1;
    let dw = opts.w;
    let dh = opts.h;
    if (dw === undefined || dh === undefined) {
      const size = opts.size ?? Math.max(img.width, img.height);
      const fit = size / Math.max(img.width, img.height);
      dw = img.width * fit;
      dh = img.height * fit;
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.globalAlpha = alpha;
    if (opts.glow) {
      ctx.shadowColor = opts.glow;
      ctx.shadowBlur = opts.glowBlur ?? 18;
    }
    ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
    return true;
  }

  private loadOne(id: SpriteId, src: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(id, img);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = src;
    });
  }
}

export const sprites = new SpriteBank();

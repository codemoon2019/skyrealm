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
  player: '/sprites/playerShip1_blue.png',
  ember: '/sprites/enemyRed4.png',
  ion: '/sprites/playerShip3_green.png',
  ally: '/sprites/playerShip3_green.png',
  scout: '/sprites/enemyRed1.png',
  drone: '/sprites/enemyRed2.png',
  zigzag: '/sprites/enemyGreen3.png',
  tank: '/sprites/enemyBlack4.png',
  swarm: '/sprites/enemyRed5.png',
  kamikaze: '/sprites/enemyRed4.png',
  wraith: '/sprites/enemyBlack5.png',
  titan: '/sprites/ufoBlue.png',
  core: '/sprites/ufoRed.png',
  rockBig: '/sprites/meteorBrown_big1.png',
  rockMed: '/sprites/meteorBrown_med1.png',
  rockSmall: '/sprites/meteorBrown_small1.png',
  laser: '/sprites/laserBlue01.png',
  cannon: '/sprites/laserBlue08.png',
  plasma: '/sprites/laserBlue10.png',
  eLaser: '/sprites/laserRed01.png',
  eMissile: '/sprites/laserRed08.png',
  flare: '/sprites/fire08.png',
  shieldFx: '/sprites/shield1.png',
  puWeapon: '/sprites/powerupBlue_bolt.png',
  puShield: '/sprites/powerupBlue_shield.png',
  puHealth: '/sprites/powerupGreen_star.png',
  puRapid: '/sprites/powerupYellow_bolt.png',
  puBomb: '/sprites/powerupRed_bolt.png',
  puScore: '/sprites/powerupYellow_star.png',
  nebula: '/sprites/nebula.png',
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

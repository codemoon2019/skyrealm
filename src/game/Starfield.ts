import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from './constants.ts';
import { WorldId } from '../types/game.ts';
import type { WorldId as W } from '../types/game.ts';
import { WORLDS } from './content/worlds.ts';
import { SKY, lerpSky } from './content/skies.ts';
import type { SkyPalette } from './content/skies.ts';
import { randRange } from '../utils/random.ts';
import { assets } from '../assets/AssetLoader.ts';
import { envPath } from '../assets/assetManifest.ts';

export type StarFloaterKind = 'mote' | 'petal' | 'shard';

export interface StarFloater {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  alpha: number;
  kind: StarFloaterKind;
}

export interface SkyCelestial {
  x: number;
  y: number;
  r: number;
  color: number;
  halo: number;
  moon: boolean;
}

export class Starfield {
  tint: readonly [number, number, number] = WORLDS[WorldId.MEADOWS].tint;
  worldId: W = WorldId.MEADOWS;
  private parallax = 0;
  private age = 0;
  private blend = 1;
  private from: SkyPalette = { ...SKY[WorldId.MEADOWS] };
  private readonly far: StarFloater[] = [];
  private readonly mid: StarFloater[] = [];
  private readonly near: StarFloater[] = [];

  get scroll(): number {
    return this.parallax;
  }

  get fading(): boolean {
    return this.blend < 1;
  }

  get time(): number {
    return this.age;
  }

  palette(): SkyPalette {
    return lerpSky(this.from, SKY[this.worldId], this.blend);
  }

  celestial(): SkyCelestial {
    const p = this.palette();
    return {
      x: 400 + Math.sin(this.age * 0.3) * 8,
      y: 148 + Math.cos(this.age * 0.22) * 6,
      r: p.moon ? 30 : 38,
      color: p.disk,
      halo: p.halo,
      moon: p.moon,
    };
  }

  floaters(): { far: readonly StarFloater[]; mid: readonly StarFloater[]; near: readonly StarFloater[] } {
    return { far: this.far, mid: this.mid, near: this.near };
  }

  skyColors(): { top: number; glow: number; mid: number; ground: number } {
    const p = this.palette();
    return { top: p.top, glow: p.glow, mid: p.mid, ground: p.ground };
  }

  constructor() {
    this.rebuild();
  }

  rebuild(): void {
    this.far.length = 0;
    this.mid.length = 0;
    this.near.length = 0;
    const id = this.worldId;
    for (let i = 0; i < 14; i++) this.far.push(this.floater('mote', 6, 12, 0.18, 7, 7));
    if (id === WorldId.FROZEN_SKIES) {
      for (let i = 0; i < 8; i++) this.mid.push(this.floater('mote', 10, 18, 0.28, 12, 12));
      for (let i = 0; i < 12; i++) this.near.push(this.floater('mote', 16, 28, 0.5, 20, 20));
    } else if (id === WorldId.EMBER_CANYON) {
      for (let i = 0; i < 6; i++) this.mid.push(this.floater('petal', 12, 20, 0.3, 14, 16));
      for (let i = 0; i < 8; i++) this.near.push(this.floater('petal', 18, 30, 0.48, 18, 22));
    } else if (id === WorldId.MEADOWS) {
      for (let i = 0; i < 7; i++) this.mid.push(this.floater('petal', 10, 16, 0.28, 12, 10));
      for (let i = 0; i < 8; i++) this.near.push(this.floater('petal', 14, 24, 0.48, 18, 14));
      for (let i = 0; i < 5; i++) this.near.push(this.floater('mote', 12, 22, 0.4, 14, 14));
    } else if (id === WorldId.CRYSTAL_FOREST || id === WorldId.CELESTIAL_RUINS) {
      for (let i = 0; i < 6; i++) this.mid.push(this.floater('mote', 9, 16, 0.26, 10, 10));
      for (let i = 0; i < 8; i++) this.near.push(this.floater('mote', 12, 22, 0.46, 16, 16));
      for (let i = 0; i < 4; i++) this.near.push(this.floater('shard', 14, 24, 0.42, 14, 28));
    } else if (id === WorldId.STORM_KINGDOM) {
      for (let i = 0; i < 7; i++) this.mid.push(this.floater('mote', 18, 30, 0.22, 10, 16));
      for (let i = 0; i < 10; i++) this.near.push(this.floater('mote', 28, 48, 0.32, 8, 22));
    } else {
      for (let i = 0; i < 6; i++) this.mid.push(this.floater('petal', 10, 18, 0.26, 12, 10));
      for (let i = 0; i < 7; i++) this.near.push(this.floater('mote', 12, 24, 0.4, 15, 15));
      for (let i = 0; i < 4; i++) this.near.push(this.floater('petal', 16, 26, 0.38, 16, 12));
    }
  }

  setWorld(id: W): void {
    if (id === this.worldId && this.blend >= 1) {
      this.tint = WORLDS[id].tint;
      return;
    }
    this.from = this.palette();
    this.worldId = id;
    this.tint = WORLDS[id].tint;
    this.blend = 0;
    this.rebuild();
  }

  setTint(tint: readonly [number, number, number]): void {
    this.tint = tint;
  }

  update(dt: number, rush = 1): void {
    this.age += dt;
    this.blend = Math.min(1, this.blend + dt);
    this.parallax += 36 * dt * rush;
    this.scrollLayer(this.far, dt, rush);
    this.scrollLayer(this.mid, dt, rush);
    this.scrollLayer(this.near, dt, rush);
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.paintSky(ctx);
    this.blitLayer(ctx, 'bg', 0.22, 1);
    this.blitLayer(ctx, 'mid', 0.18, 0.62);
    this.blitLayer(ctx, 'fg', 0.14, 0.38);
    this.paintBand(ctx, this.far);
    this.paintBand(ctx, this.mid);
    this.paintBand(ctx, this.near);
  }

  private blitLayer(ctx: CanvasRenderingContext2D, layer: 'bg' | 'mid' | 'fg', alpha: number, speed: number): void {
    const url = envPath(this.worldId, layer);
    if (!assets.has(url)) return;
    const shift = (this.parallax * speed) % LOGICAL_HEIGHT;
    assets.drawCover(ctx, url, 0, shift - LOGICAL_HEIGHT, LOGICAL_WIDTH, LOGICAL_HEIGHT, alpha);
    assets.drawCover(ctx, url, 0, shift, LOGICAL_WIDTH, LOGICAL_HEIGHT, alpha);
  }

  private floater(kind: StarFloaterKind, minSp: number, maxSp: number, alpha: number, w: number, h: number): StarFloater {
    return {
      x: randRange(0, LOGICAL_WIDTH),
      y: randRange(0, LOGICAL_HEIGHT),
      w: randRange(w * 0.65, w),
      h: randRange(h * 0.65, h),
      speed: randRange(minSp, maxSp),
      alpha,
      kind,
    };
  }

  private scrollLayer(layer: StarFloater[], dt: number, rush: number): void {
    for (const f of layer) {
      f.y += f.speed * dt * rush;
      if (f.y - f.h > LOGICAL_HEIGHT) {
        f.y = -f.h - randRange(10, 80);
        f.x = randRange(0, LOGICAL_WIDTH);
      }
    }
  }

  private paintSky(ctx: CanvasRenderingContext2D): void {
    const c = this.skyColors();
    const g = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
    g.addColorStop(0, css(c.top));
    g.addColorStop(0.28, css(c.glow));
    g.addColorStop(0.62, css(c.mid));
    g.addColorStop(1, css(c.ground));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    const sun = this.celestial();
    ctx.fillStyle = css(sun.halo);
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.r * 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = css(sun.color);
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.r, 0, Math.PI * 2);
    ctx.fill();
  }

  private paintBand(ctx: CanvasRenderingContext2D, layer: StarFloater[]): void {
    const p = this.palette();
    for (const f of layer) {
      if (f.kind === 'shard') this.shard(ctx, f, p);
      else if (f.kind === 'petal') this.petal(ctx, f, p);
      else this.mote(ctx, f, p);
    }
  }

  private mote(ctx: CanvasRenderingContext2D, f: StarFloater, p: SkyPalette): void {
    ctx.globalAlpha = f.alpha;
    ctx.fillStyle = css(p.weather);
    ctx.beginPath();
    ctx.arc(f.x, f.y, Math.max(2.2, f.w * 0.22), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  private petal(ctx: CanvasRenderingContext2D, f: StarFloater, p: SkyPalette): void {
    ctx.globalAlpha = f.alpha;
    ctx.fillStyle = css(p.weather);
    ctx.beginPath();
    ctx.ellipse(f.x, f.y, f.w * 0.4, f.h * 0.75, f.x * 0.01, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  private shard(ctx: CanvasRenderingContext2D, f: StarFloater, p: SkyPalette): void {
    ctx.globalAlpha = f.alpha;
    ctx.fillStyle = css(p.weather);
    ctx.beginPath();
    ctx.moveTo(f.x, f.y - f.h);
    ctx.lineTo(f.x + f.w * 0.35, f.y);
    ctx.lineTo(f.x, f.y + f.h * 0.4);
    ctx.lineTo(f.x - f.w * 0.35, f.y);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function css(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`;
}

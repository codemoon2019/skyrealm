import { WorldId } from '../../types/game.ts';
import type { WorldId as World } from '../../types/game.ts';
import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from '../constants.ts';
import { SKY, mixRgb } from '../content/skies.ts';
import type { SkyPalette } from '../content/skies.ts';

const PW = LOGICAL_WIDTH;
const PH = LOGICAL_HEIGHT;
const PLATE_REV = 'v3';
const plates = new Map<string, HTMLCanvasElement>();
const curtains = new Map<string, HTMLCanvasElement>();

export function getSkyPlate(world: string): HTMLCanvasElement {
  const id = asWorld(world);
  const cacheId = `${PLATE_REV}:${id}`;
  let canvas = plates.get(cacheId);
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = PW;
    canvas.height = PH;
    const ctx = canvas.getContext('2d');
    if (ctx) paintSkyPlate(ctx, id);
    plates.set(cacheId, canvas);
  }
  return canvas;
}

export function getSkyCurtain(world: string): HTMLCanvasElement {
  const id = asWorld(world);
  let canvas = curtains.get(id);
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = PH;
    const ctx = canvas.getContext('2d');
    if (ctx) paintSkyCurtain(ctx, id);
    curtains.set(id, canvas);
  }
  return canvas;
}

export function paintSkyPlate(ctx: CanvasRenderingContext2D, world: World): void {
  const pal = SKY[world];
  wash(ctx, pal);
  haze(ctx, pal);
  clouds(ctx, pal, world);
  ridge(ctx, pal, world);
  landmarks(ctx, pal, world);
  specks(ctx, pal);
}

export function paintSkyCurtain(ctx: CanvasRenderingContext2D, world: World): void {
  const pal = SKY[world];
  const vine = world === WorldId.MEADOWS || world === WorldId.VOID_FRONTIER;
  for (let i = 0; i < 14; i++) {
    const y = 40 + i * 68;
    const x = vine ? 18 + (i % 3) * 10 : 28 + (i % 2) * 16;
    const rw = vine ? 34 + (i % 4) * 8 : 46 + (i % 3) * 10;
    const rh = vine ? 52 + (i % 3) * 10 : 28 + (i % 4) * 6;
    ctx.fillStyle = rgba(i % 2 === 0 ? pal.cloud : pal.land, 0.55);
    ctx.beginPath();
    ctx.ellipse(x, y, rw, rh, vine ? -0.35 : 0, 0, Math.PI * 2);
    ctx.fill();
    if (vine && i % 2 === 0) {
      ctx.fillStyle = rgba(pal.weather, 0.4);
      ctx.beginPath();
      ctx.ellipse(x + 8, y - 10, 10, 16, -0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const fade = ctx.createLinearGradient(0, 0, 120, 0);
  fade.addColorStop(0, rgba(pal.cloud, 0.35));
  fade.addColorStop(0.45, rgba(pal.cloud, 0.08));
  fade.addColorStop(1, rgba(pal.cloud, 0));
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, 120, PH);
}

function asWorld(world: string): World {
  return world in SKY ? (world as World) : WorldId.MEADOWS;
}

function wash(ctx: CanvasRenderingContext2D, pal: SkyPalette): void {
  const g = ctx.createLinearGradient(0, 0, 0, PH);
  g.addColorStop(0, rgba(pal.glow, 0.2));
  g.addColorStop(0.32, rgba(pal.mid, 0.16));
  g.addColorStop(0.68, rgba(pal.glow, 0.14));
  g.addColorStop(1, rgba(pal.glow, 0.2));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PW, PH);
}

function haze(ctx: CanvasRenderingContext2D, pal: SkyPalette): void {
  const motes: readonly [number, number, number][] = [
    [96, 64, 88],
    [430, 188, 72],
    [70, 340, 64],
    [480, 470, 80],
    [160, 610, 70],
    [400, 760, 76],
    [220, 920, 84],
    [500, 40, 60],
  ];
  for (const [x, y, r] of motes) {
    wrapY(y, (yy) => {
      ctx.fillStyle = rgba(pal.cloud, 0.16);
      ctx.beginPath();
      ctx.ellipse(x, yy, r, r * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

function wrapY(y: number, paint: (yy: number) => void): void {
  paint(y);
  if (y < 200) paint(y + PH);
  if (y > PH - 200) paint(y - PH);
}

function clouds(ctx: CanvasRenderingContext2D, pal: SkyPalette, world: World): void {
  const blush = mixRgb(pal.cloud, pal.weather, 0.4);
  for (const c of CLOUDS[world]) wrapY(c.y, (y) => storyCloud(ctx, c.x, y, c.w, pal.cloud, blush));
}

function ridge(ctx: CanvasRenderingContext2D, pal: SkyPalette, world: World): void {
  for (const m of MOUNDS[world]) {
    wrapY(m.y, (y) => {
      ctx.fillStyle = rgba(pal.landDeep, 0.88);
      ctx.beginPath();
      ctx.ellipse(m.x, y + 8, m.w * 0.58, m.h * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = rgba(pal.land, 0.92);
      ctx.beginPath();
      ctx.ellipse(m.x, y, m.w * 0.55, m.h * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = rgba(mixRgb(pal.land, pal.cloud, 0.28), 0.4);
      ctx.beginPath();
      ctx.ellipse(m.x - 4, y - m.h * 0.16, m.w * 0.38, m.h * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

function specks(ctx: CanvasRenderingContext2D, pal: SkyPalette): void {
  const dots: readonly [number, number, number][] = [
    [48, 96, 3.2],
    [510, 210, 2.6],
    [190, 360, 2.8],
    [360, 520, 3],
    [70, 680, 2.4],
    [490, 800, 2.8],
    [240, 40, 2.2],
    [420, 940, 3],
  ];
  ctx.fillStyle = rgba(pal.weather, 0.35);
  for (const [x, y, r] of dots) {
    wrapY(y, (yy) => {
      ctx.beginPath();
      ctx.arc(x, yy, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

function landmarks(ctx: CanvasRenderingContext2D, pal: SkyPalette, world: World): void {
  const mark = (y: number, draw: (yy: number) => void) => wrapY(y, draw);
  switch (world) {
    case WorldId.MEADOWS:
      mark(220, (y) => orchard(ctx, 86, y, 0.95, pal));
      mark(468, (y) => orchard(ctx, 448, y, 1.05, pal));
      mark(712, (y) => orchard(ctx, 118, y, 0.88, pal));
      mark(840, (y) => orchard(ctx, 470, y, 0.8, pal));
      break;
    case WorldId.CRYSTAL_FOREST:
      mark(240, (y) => crystals(ctx, 78, y, pal));
      mark(510, (y) => crystals(ctx, 452, y, pal));
      mark(760, (y) => crystals(ctx, 120, y, pal));
      break;
    case WorldId.EMBER_CANYON:
      mark(250, (y) => mesa(ctx, 90, y, 70, 52, pal));
      mark(520, (y) => mesa(ctx, 440, y, 62, 46, pal));
      mark(780, (y) => mesa(ctx, 128, y, 54, 40, pal));
      break;
    case WorldId.FROZEN_SKIES:
      mark(236, (y) => berg(ctx, 80, y, 40, 68, pal));
      mark(500, (y) => berg(ctx, 448, y, 44, 74, pal));
      mark(770, (y) => berg(ctx, 126, y, 32, 54, pal));
      break;
    case WorldId.SHADOW_REALM:
      mark(260, (y) => isle(ctx, 92, y, 58, 22, pal));
      mark(530, (y) => isle(ctx, 438, y, 64, 24, pal));
      mark(800, (y) => isle(ctx, 140, y, 48, 18, pal));
      break;
    case WorldId.STORM_KINGDOM:
      mark(248, (y) => tower(ctx, 88, y, 70, pal));
      mark(518, (y) => tower(ctx, 446, y, 78, pal));
      mark(788, (y) => tower(ctx, 130, y, 52, pal));
      break;
    case WorldId.CELESTIAL_RUINS:
      mark(254, (y) => arch(ctx, 96, y, 48, 52, pal));
      mark(540, (y) => arch(ctx, 438, y, 54, 58, pal));
      mark(804, (y) => arch(ctx, 470, y, 38, 40, pal));
      break;
    case WorldId.VOID_FRONTIER:
      mark(266, (y) => islet(ctx, 88, y, 50, pal));
      mark(536, (y) => islet(ctx, 444, y, 48, pal));
      mark(808, (y) => islet(ctx, 136, y, 38, pal));
      break;
  }
}

function storyCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  cream: number,
  blush: number,
): void {
  const h = w * 0.36;
  const puffs: readonly [number, number, number, number][] = [
    [0, 0, 1, 1],
    [-0.4, 0.14, 0.62, 0.78],
    [0.38, 0.12, 0.58, 0.74],
    [-0.16, -0.34, 0.5, 0.7],
    [0.18, -0.3, 0.46, 0.64],
    [-0.54, 0.22, 0.38, 0.52],
    [0.52, 0.2, 0.36, 0.5],
  ];
  ctx.fillStyle = rgba(blush, 0.72);
  ctx.beginPath();
  for (const [ox, oy, sw, sh] of puffs) {
    ctx.ellipse(x + ox * w * 0.5, y + oy * h + 8, w * sw * 0.28, h * sh * 0.55, 0, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.fillStyle = rgba(cream, 0.9);
  ctx.beginPath();
  for (const [ox, oy, sw, sh] of puffs) {
    ctx.ellipse(x + ox * w * 0.5, y + oy * h, w * sw * 0.28, h * sh * 0.55, 0, 0, Math.PI * 2);
  }
  ctx.fill();
}

function orchard(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, pal: SkyPalette): void {
  ctx.fillStyle = rgba(mixRgb(pal.landDeep, 0x5a3a28, 0.35), 0.95);
  ctx.fillRect(x - 3 * s, y - 18 * s, 6 * s, 20 * s);
  ctx.fillStyle = rgba(pal.land, 0.96);
  ctx.beginPath();
  ctx.ellipse(x, y - 26 * s, 17 * s, 15 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 12 * s, y - 18 * s, 12 * s, 11 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 12 * s, y - 18 * s, 12 * s, 11 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rgba(pal.weather, 0.85);
  for (const [dx, dy] of [
    [-8, -28],
    [6, -32],
    [-2, -18],
    [12, -20],
    [-14, -16],
  ] as const) {
    ctx.beginPath();
    ctx.arc(x + dx * s, y + dy * s, 2.4 * s, 0, Math.PI * 2);
    ctx.fill();
  }
}

function crystals(ctx: CanvasRenderingContext2D, x: number, y: number, pal: SkyPalette): void {
  const lite = mixRgb(pal.land, pal.cloud, 0.45);
  shard(ctx, x, y, 18, 64, pal.landDeep);
  shard(ctx, x - 16, y + 6, 12, 44, pal.land);
  shard(ctx, x + 14, y + 8, 10, 38, lite);
}

function shard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: number): void {
  ctx.fillStyle = rgba(color, 0.92);
  ctx.beginPath();
  ctx.moveTo(x, y - h);
  ctx.lineTo(x + w, y + 4);
  ctx.lineTo(x - w * 0.7, y + 8);
  ctx.closePath();
  ctx.fill();
}

function mesa(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pal: SkyPalette): void {
  const steps = 3;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const ww = w * (1 - t * 0.32);
    const hh = h / steps + 6;
    const yy = y - i * (h / steps);
    ctx.fillStyle = rgba(i === steps - 1 ? mixRgb(pal.land, pal.cloud, 0.2) : pal.landDeep, 0.95);
    roundBlob(ctx, x, yy - hh * 0.3, ww, hh);
  }
}

function berg(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pal: SkyPalette): void {
  ctx.fillStyle = rgba(pal.landDeep, 0.92);
  ctx.beginPath();
  ctx.moveTo(x, y - h);
  ctx.lineTo(x + w, y + 6);
  ctx.lineTo(x - w, y + 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = rgba(pal.cloud, 0.7);
  ctx.beginPath();
  ctx.moveTo(x, y - h);
  ctx.lineTo(x + w * 0.28, y - h * 0.35);
  ctx.lineTo(x - 2, y - h * 0.2);
  ctx.closePath();
  ctx.fill();
}

function isle(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pal: SkyPalette): void {
  ctx.fillStyle = rgba(pal.landDeep, 0.94);
  ctx.beginPath();
  ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rgba(pal.land, 0.9);
  ctx.beginPath();
  ctx.ellipse(x - 4, y - 4, w * 0.7, h * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rgba(pal.landDeep, 0.85);
  ctx.beginPath();
  ctx.moveTo(x + 8, y - h - 16);
  ctx.lineTo(x + 14, y - 2);
  ctx.lineTo(x + 2, y - 2);
  ctx.closePath();
  ctx.fill();
}

function tower(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, pal: SkyPalette): void {
  const bw = 18;
  ctx.fillStyle = rgba(pal.landDeep, 0.94);
  ctx.fillRect(x - bw * 0.5, y - h, bw, h);
  ctx.fillStyle = rgba(pal.land, 0.9);
  ctx.fillRect(x - bw * 0.35, y - h + 8, bw * 0.28, 10);
  ctx.fillStyle = rgba(pal.landDeep, 0.96);
  ctx.beginPath();
  ctx.moveTo(x - bw * 0.72, y - h);
  ctx.lineTo(x, y - h - 20);
  ctx.lineTo(x + bw * 0.72, y - h);
  ctx.closePath();
  ctx.fill();
}

function arch(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pal: SkyPalette): void {
  ctx.fillStyle = rgba(pal.landDeep, 0.94);
  ctx.fillRect(x - w * 0.5, y - h * 0.72, 10, h * 0.72);
  ctx.fillRect(x + w * 0.5 - 10, y - h * 0.72, 10, h * 0.72);
  ctx.strokeStyle = rgba(pal.land, 0.92);
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(x, y - h * 0.7, w * 0.52, Math.PI, Math.PI * 1.62);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y - h * 0.7, w * 0.52, Math.PI * 1.78, 0);
  ctx.stroke();
}

function islet(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, pal: SkyPalette): void {
  ctx.fillStyle = rgba(pal.land, 0.95);
  ctx.beginPath();
  ctx.ellipse(x, y, w, w * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rgba(pal.weather, 0.8);
  ctx.beginPath();
  ctx.arc(x - 6, y - 8, 4, 0, Math.PI * 2);
  ctx.arc(x + 8, y - 6, 3.2, 0, Math.PI * 2);
  ctx.fill();
}

function roundBlob(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.beginPath();
  ctx.ellipse(x, y, w * 0.5, h * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rgba(color: number, a: number): string {
  const r = (color >> 16) & 255;
  const g = (color >> 8) & 255;
  const b = color & 255;
  return `rgba(${r},${g},${b},${a})`;
}

type Mound = { x: number; y: number; w: number; h: number };
type Cloud = { x: number; y: number; w: number };

const MOUNDS: Record<World, readonly Mound[]> = {
  [WorldId.MEADOWS]: [
    { x: 78, y: 168, w: 118, h: 52 },
    { x: 456, y: 312, w: 102, h: 44 },
    { x: 130, y: 498, w: 124, h: 50 },
    { x: 410, y: 656, w: 110, h: 46 },
    { x: 250, y: 824, w: 96, h: 40 },
  ],
  [WorldId.CRYSTAL_FOREST]: [
    { x: 72, y: 176, w: 108, h: 50 },
    { x: 462, y: 328, w: 98, h: 42 },
    { x: 126, y: 510, w: 114, h: 48 },
    { x: 416, y: 668, w: 104, h: 44 },
    { x: 248, y: 832, w: 90, h: 38 },
  ],
  [WorldId.EMBER_CANYON]: [
    { x: 86, y: 184, w: 120, h: 46 },
    { x: 448, y: 340, w: 108, h: 40 },
    { x: 138, y: 522, w: 116, h: 44 },
    { x: 404, y: 678, w: 112, h: 42 },
    { x: 256, y: 838, w: 94, h: 36 },
  ],
  [WorldId.FROZEN_SKIES]: [
    { x: 74, y: 170, w: 112, h: 54 },
    { x: 458, y: 318, w: 100, h: 46 },
    { x: 132, y: 504, w: 118, h: 50 },
    { x: 412, y: 662, w: 106, h: 48 },
    { x: 246, y: 828, w: 92, h: 40 },
  ],
  [WorldId.SHADOW_REALM]: [
    { x: 90, y: 190, w: 96, h: 38 },
    { x: 444, y: 352, w: 88, h: 34 },
    { x: 146, y: 534, w: 92, h: 36 },
    { x: 408, y: 690, w: 90, h: 34 },
    { x: 260, y: 846, w: 80, h: 30 },
  ],
  [WorldId.STORM_KINGDOM]: [
    { x: 80, y: 174, w: 116, h: 50 },
    { x: 452, y: 330, w: 104, h: 44 },
    { x: 134, y: 512, w: 120, h: 48 },
    { x: 414, y: 670, w: 108, h: 46 },
    { x: 252, y: 834, w: 94, h: 38 },
  ],
  [WorldId.CELESTIAL_RUINS]: [
    { x: 84, y: 182, w: 114, h: 48 },
    { x: 450, y: 336, w: 102, h: 42 },
    { x: 140, y: 518, w: 118, h: 46 },
    { x: 406, y: 674, w: 110, h: 44 },
    { x: 254, y: 836, w: 92, h: 38 },
  ],
  [WorldId.VOID_FRONTIER]: [
    { x: 94, y: 198, w: 88, h: 34 },
    { x: 440, y: 360, w: 82, h: 30 },
    { x: 150, y: 542, w: 86, h: 32 },
    { x: 400, y: 698, w: 84, h: 30 },
    { x: 262, y: 850, w: 76, h: 28 },
  ],
};

const CLOUDS: Record<World, readonly Cloud[]> = {
  [WorldId.MEADOWS]: [
    { x: 108, y: 120, w: 260 },
    { x: 430, y: 280, w: 220 },
    { x: 90, y: 440, w: 200 },
    { x: 460, y: 600, w: 230 },
    { x: 140, y: 760, w: 210 },
    { x: 400, y: 900, w: 240 },
  ],
  [WorldId.CRYSTAL_FOREST]: [
    { x: 100, y: 128, w: 250 },
    { x: 436, y: 292, w: 210 },
    { x: 84, y: 452, w: 190 },
    { x: 464, y: 612, w: 220 },
    { x: 148, y: 772, w: 200 },
    { x: 408, y: 908, w: 230 },
  ],
  [WorldId.EMBER_CANYON]: [
    { x: 114, y: 132, w: 248 },
    { x: 428, y: 300, w: 206 },
    { x: 96, y: 460, w: 186 },
    { x: 452, y: 620, w: 216 },
    { x: 156, y: 780, w: 196 },
    { x: 396, y: 912, w: 224 },
  ],
  [WorldId.FROZEN_SKIES]: [
    { x: 98, y: 116, w: 268 },
    { x: 440, y: 274, w: 226 },
    { x: 80, y: 436, w: 206 },
    { x: 468, y: 596, w: 236 },
    { x: 136, y: 756, w: 216 },
    { x: 412, y: 896, w: 246 },
  ],
  [WorldId.SHADOW_REALM]: [
    { x: 106, y: 140, w: 236 },
    { x: 432, y: 308, w: 198 },
    { x: 92, y: 468, w: 180 },
    { x: 456, y: 628, w: 208 },
    { x: 152, y: 788, w: 188 },
    { x: 404, y: 916, w: 218 },
  ],
  [WorldId.STORM_KINGDOM]: [
    { x: 118, y: 112, w: 276 },
    { x: 424, y: 288, w: 232 },
    { x: 76, y: 448, w: 214 },
    { x: 448, y: 608, w: 242 },
    { x: 160, y: 768, w: 222 },
    { x: 392, y: 904, w: 252 },
  ],
  [WorldId.CELESTIAL_RUINS]: [
    { x: 112, y: 124, w: 252 },
    { x: 434, y: 296, w: 214 },
    { x: 88, y: 456, w: 194 },
    { x: 460, y: 616, w: 224 },
    { x: 144, y: 776, w: 204 },
    { x: 406, y: 906, w: 234 },
  ],
  [WorldId.VOID_FRONTIER]: [
    { x: 104, y: 136, w: 232 },
    { x: 438, y: 304, w: 196 },
    { x: 94, y: 464, w: 178 },
    { x: 454, y: 624, w: 206 },
    { x: 150, y: 784, w: 186 },
    { x: 402, y: 914, w: 216 },
  ],
};

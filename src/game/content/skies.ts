import { WorldId } from '../../types/game.ts';
import type { WorldId as W } from '../../types/game.ts';

export interface SkyPalette {
  top: number;
  glow: number;
  mid: number;
  ground: number;
  disk: number;
  halo: number;
  land: number;
  landDeep: number;
  cloud: number;
  weather: number;
  moon: boolean;
}

export const SKY: Record<W, SkyPalette> = {
  [WorldId.MEADOWS]: {
    top: 0xfff3d6,
    glow: 0xffe4b8,
    mid: 0xb8e8b0,
    ground: 0x8fc98a,
    disk: 0xfff6c8,
    halo: 0xffe08a,
    land: 0x9ed49a,
    landDeep: 0x7fbe7a,
    cloud: 0xfff8ec,
    weather: 0xffb6c8,
    moon: false,
  },
  [WorldId.CRYSTAL_FOREST]: {
    top: 0xf0e8ff,
    glow: 0xe4d4ff,
    mid: 0xc8bce8,
    ground: 0xa89ad4,
    disk: 0xf8f0ff,
    halo: 0xe0d0ff,
    land: 0xb8a8dc,
    landDeep: 0x9a88c8,
    cloud: 0xf4eeff,
    weather: 0xe6d2ff,
    moon: false,
  },
  [WorldId.EMBER_CANYON]: {
    top: 0xffe0b8,
    glow: 0xffd08a,
    mid: 0xffc08c,
    ground: 0xe89878,
    disk: 0xffe8a0,
    halo: 0xffc878,
    land: 0xe8a070,
    landDeep: 0xd08858,
    cloud: 0xfff0dc,
    weather: 0xffb45a,
    moon: false,
  },
  [WorldId.FROZEN_SKIES]: {
    top: 0xeef8ff,
    glow: 0xdff2ff,
    mid: 0xbadfff,
    ground: 0x8ec4e8,
    disk: 0xfffef8,
    halo: 0xd8eefe,
    land: 0x9ec8e0,
    landDeep: 0x82b4d2,
    cloud: 0xf4fbff,
    weather: 0xe6f6ff,
    moon: false,
  },
  [WorldId.SHADOW_REALM]: {
    top: 0x5a3a78,
    glow: 0x6e4a8c,
    mid: 0x8268a8,
    ground: 0x6a5488,
    disk: 0xf0e8ff,
    halo: 0xc8b4e8,
    land: 0x6e5a90,
    landDeep: 0x5a4878,
    cloud: 0xc8b8dc,
    weather: 0xd4b8f0,
    moon: true,
  },
  [WorldId.STORM_KINGDOM]: {
    top: 0xe8f0fa,
    glow: 0xd0dcee,
    mid: 0xb0c6e6,
    ground: 0x8aa4c8,
    disk: 0xfff8e8,
    halo: 0xc8d8ee,
    land: 0x8aa8c0,
    landDeep: 0x7290ac,
    cloud: 0xe8eef6,
    weather: 0xc8d8f0,
    moon: false,
  },
  [WorldId.CELESTIAL_RUINS]: {
    top: 0xffe8c8,
    glow: 0xffd4a8,
    mid: 0xf0c8a0,
    ground: 0xd4a878,
    disk: 0xffe8b0,
    halo: 0xffd48a,
    land: 0xd8b080,
    landDeep: 0xc09868,
    cloud: 0xfff4e4,
    weather: 0xffe08a,
    moon: false,
  },
  [WorldId.VOID_FRONTIER]: {
    top: 0xf0c8d4,
    glow: 0xe8a8b8,
    mid: 0xdc8ca0,
    ground: 0xc87890,
    disk: 0xffe0ec,
    halo: 0xf0b8c8,
    land: 0xc88898,
    landDeep: 0xb07084,
    cloud: 0xf8d8e0,
    weather: 0xffc0d0,
    moon: true,
  },
};

export function mixRgb(a: number, b: number, t: number): number {
  const s = t * t * (3 - 2 * t);
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  const r = Math.round(ar + (br - ar) * s);
  const g = Math.round(ag + (bg - ag) * s);
  const bl = Math.round(ab + (bb - ab) * s);
  return (r << 16) | (g << 8) | bl;
}

export function lerpSky(a: SkyPalette, b: SkyPalette, t: number): SkyPalette {
  return {
    top: mixRgb(a.top, b.top, t),
    glow: mixRgb(a.glow, b.glow, t),
    mid: mixRgb(a.mid, b.mid, t),
    ground: mixRgb(a.ground, b.ground, t),
    disk: mixRgb(a.disk, b.disk, t),
    halo: mixRgb(a.halo, b.halo, t),
    land: mixRgb(a.land, b.land, t),
    landDeep: mixRgb(a.landDeep, b.landDeep, t),
    cloud: mixRgb(a.cloud, b.cloud, t),
    weather: mixRgb(a.weather, b.weather, t),
    moon: t > 0.5 ? b.moon : a.moon,
  };
}

export function skyTint(id: W): readonly [number, number, number] {
  const mid = SKY[id].mid;
  return [(mid >> 16) & 255, (mid >> 8) & 255, mid & 255];
}

export function skyHex(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`;
}

/** CSS stops for the desktop letterbox, matching the in-canvas sky wash. */
export function skyShell(p: SkyPalette): { top: string; glow: string; mid: string; ground: string } {
  return { top: skyHex(p.top), glow: skyHex(p.glow), mid: skyHex(p.mid), ground: skyHex(p.ground) };
}

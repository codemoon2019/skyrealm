import { PowerUpType } from '../../types/game.ts';
import type { PowerUpType as PUT } from '../../types/game.ts';

export interface PickupStyle {
  /** Bright inner disc behind the icon. */
  core: string;
  /** Saturated token ring and float-text color. */
  ring: string;
  /** Soft outer bloom. */
  glow: string;
  /** Saturated burst color on collect. */
  spark: readonly [number, number, number];
  /** Pale motes drifting off the token while it floats. */
  mote: readonly [number, number, number];
  /** What the hero just gained, shown on collect. */
  label: string;
}

export const PICKUP_STYLE: Record<PUT, PickupStyle> = {
  [PowerUpType.CLOVER]: {
    core: '#f0fff4',
    ring: '#3ad46a',
    glow: '#8affb0',
    spark: [80, 230, 120],
    mote: [190, 255, 210],
    label: 'WEAPON UP',
  },
  [PowerUpType.MAGNET]: {
    core: '#f0fdff',
    ring: '#3df0ff',
    glow: '#a6f4ff',
    spark: [90, 200, 255],
    mote: [200, 245, 255],
    label: 'MAGNET',
  },
  [PowerUpType.DOUBLE]: {
    core: '#fff6ee',
    ring: '#ff8a4a',
    glow: '#ffc79a',
    spark: [255, 140, 90],
    mote: [255, 214, 186],
    label: 'DOUBLE SHOT',
  },
  [PowerUpType.RUSH]: {
    core: '#fffdf0',
    ring: '#ffd24a',
    glow: '#fff0a8',
    spark: [255, 220, 90],
    mote: [255, 244, 196],
    label: 'STAR RUSH',
  },
  [PowerUpType.HEART]: {
    core: '#fff2f5',
    ring: '#ff5a7a',
    glow: '#ffb6c8',
    spark: [255, 90, 130],
    mote: [255, 200, 214],
    label: 'HEAL',
  },
  [PowerUpType.FREEZE]: {
    core: '#f4fdff',
    ring: '#9ee8ff',
    glow: '#e0f8ff',
    spark: [150, 230, 255],
    mote: [220, 248, 255],
    label: 'FREEZE',
  },
  [PowerUpType.BLAST]: {
    core: '#fff0fb',
    ring: '#ff78dc',
    glow: '#ffc0f0',
    spark: [255, 120, 220],
    mote: [255, 206, 242],
    label: 'BLAST!',
  },
};

/** How long the hero wears the "buff gained" ring. */
export const PICKUP_FLASH = 0.45;

export function pickupStyle(type: PUT): PickupStyle {
  return PICKUP_STYLE[type];
}

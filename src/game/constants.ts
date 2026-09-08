import { Difficulty } from '../types/game.ts';
import type { DifficultyMods } from '../types/game.ts';

export const LOGICAL_WIDTH = 540;
export const LOGICAL_HEIGHT = 960;

export const PLAYER = {
  maxHealth: 100,
  maxShield: 60,
  speed: 470,
  radius: 14,
  startX: LOGICAL_WIDTH * 0.5,
  startY: LOGICAL_HEIGHT * 0.82,
  minY: LOGICAL_HEIGHT * 0.52,
  invulnTime: 0.58,
  specialCost: 100,
  specialRadius: 210,
  specialDamage: 90,
  energyPerKill: 10,
};

/** On-screen body sizes in logical px; sprite art is drawn 1:1 with logical space. */
export const BODY = {
  player: 124,
  wing: 86,
  wingClone: 68,
};

/** Sprite art leaves a transparent margin; measured across the cast, bodies fill ~88%. */
const SPRITE_FILL = 0.88;

/** Muzzle heights above each sprite's center, landing on the drawn top of the body. */
export const MUZZLE = {
  player: (BODY.player * SPRITE_FILL) / 2,
  wing: (BODY.wing * SPRITE_FILL) / 2,
  wingClone: (BODY.wingClone * SPRITE_FILL) / 2,
};

/** Where the hero and its sidekicks sit, and how quickly they ease into place. */
export const FORMATION = {
  /** Sidekicks flank the hero at ±wingSpread, clones at ±cloneSpread. */
  wingSpread: 86,
  cloneSpread: 110,
  /** Sidekicks ride slightly below the hero. */
  wingDrop: 30,
  /** Follow rates for exponential easing, in 1/seconds. Higher is snappier. */
  pointerFollow: 18,
  wingFollow: 12,
};

/** Phone drag sits under the hero so the fingertip does not cover the sprite. */
export const TOUCH = {
  leadY: 156,
};

export const WEAPON_NAMES = [
  'BOLT I',
  'TWIN',
  'SPREAD',
  'CANNON',
  'PRISM',
  'STAR 6',
  'STAR 7',
  'STAR 8',
  'STAR 9',
  'STAR 10',
  'STAR 11',
  'STAR 12',
] as const;

export const COMBO_THRESHOLDS = [10, 25, 50, 100] as const;

export const DIFFICULTY_MODS: Record<Difficulty, DifficultyMods> = {
  [Difficulty.EASY]: { health: 0.8, speed: 1.02, spawn: 0.95, projectileSpeed: 1.02, boss: 0.85 },
  [Difficulty.NORMAL]: { health: 1.2, speed: 1.34, spawn: 1.34, projectileSpeed: 1.32, boss: 1.2 },
  [Difficulty.HARD]: { health: 1.7, speed: 1.52, spawn: 1.68, projectileSpeed: 1.58, boss: 1.55 },
};

export const RAID_SECONDS = 90;
export const BOSS_ENERGY_MAX = 5;

/**
 * How long the incoming-boss banner runs, in seconds. Play continues throughout
 * while the boss descends, so this is a pacing beat rather than a hold. The
 * banner's own animation is driven off this value so the two cannot drift.
 */
export const BOSS_WARNING_TIME = 1.6;

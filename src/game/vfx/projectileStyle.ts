import { ElementId, GuardianId } from '../../types/game.ts';
import type { AetherlingSpecies, ElementId as El, GuardianId as GID } from '../../types/game.ts';
import { SPECIES_LIST, SPECIES_META } from '../content/aetherlings.ts';
import { ELEMENT_COLOR, ELEMENT_LIST } from '../content/elements.ts';
import { GUARDIAN_COLORS, monsterPaint } from '../fantasyDraw.ts';
import { clamp } from '../../utils/random.ts';

export type ShotSource = 'player' | 'sidekick';

export interface ProjectileStyle {
  coreColor: string;
  glowColor: string;
  trailColor: readonly [number, number, number];
  particleColor: readonly [number, number, number];
  coreScale: number;
  glowRadius: number;
  trailLength: number;
  trailOpacity: number;
  particleRate: number;
  muzzleFlashScale: number;
  impactScale: number;
  /** Muzzle velocity in px/s, so each character's shot travels at its own pace. */
  speed: number;
}

export interface ShotPaint {
  style: ProjectileStyle;
  source: ShotSource;
  crit: boolean;
  glow: string;
}

export function hexToRgb(hex: string): readonly [number, number, number] {
  const h = hex.startsWith('#') ? hex.slice(1) : hex;
  return [Number.parseInt(h.slice(0, 2), 16), Number.parseInt(h.slice(2, 4), 16), Number.parseInt(h.slice(4, 6), 16)];
}

export function hexToTint(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (r << 16) | (g << 8) | b;
}

export interface MonsterRgb {
  body: readonly [number, number, number];
  rim: readonly [number, number, number];
  edge: readonly [number, number, number];
}

function resolveMonster(element: string): MonsterRgb {
  const p = monsterPaint(element as El);
  return { body: hexToRgb(p.body), rim: hexToRgb(p.rim), edge: hexToRgb(p.edge) };
}

const MONSTER_RGB: Record<string, MonsterRgb> = Object.fromEntries(
  ELEMENT_LIST.map((el) => [el, resolveMonster(el)]),
);
const MONSTER_RGB_FALLBACK = resolveMonster(ElementId.ARCANE);

/**
 * The hostile palette pre-resolved to rgb, so monster wakes and bursts cost no
 * hex parsing on the hot path.
 */
export function monsterRgb(element: string): MonsterRgb {
  return MONSTER_RGB[element] ?? MONSTER_RGB_FALLBACK;
}

/**
 * Each guardian throws a shot with its own weight and pace, not just its own colour:
 * Kairo spits lean tracer bolts, Vesper heaves slow frost slugs, Orion lobs fat orbs.
 */
const GUARDIAN_TUNE: Record<GID, { core: number; glow: number; trail: number; speed: number }> = {
  [GuardianId.AURELIA]: { core: 1.08, glow: 1.2, trail: 1, speed: 760 },
  [GuardianId.KAIRO]: { core: 0.95, glow: 1, trail: 1.6, speed: 960 },
  [GuardianId.NYXARA]: { core: 1, glow: 1.3, trail: 1.3, speed: 880 },
  [GuardianId.ELARA]: { core: 1.2, glow: 1.3, trail: 0.85, speed: 690 },
  [GuardianId.ORION]: { core: 1.12, glow: 1.5, trail: 1.15, speed: 810 },
  [GuardianId.VESPER]: { core: 1.22, glow: 1.1, trail: 0.75, speed: 650 },
};

function guardianStyle(id: GID): ProjectileStyle {
  const paint = GUARDIAN_COLORS[id];
  const tune = GUARDIAN_TUNE[id];
  return {
    coreColor: paint.glow,
    glowColor: paint.accent,
    trailColor: hexToRgb(paint.glow),
    particleColor: hexToRgb(paint.accent),
    coreScale: tune.core,
    glowRadius: tune.glow,
    trailLength: tune.trail,
    trailOpacity: 0.85,
    particleRate: 0.9 + tune.trail * 0.25,
    muzzleFlashScale: tune.core,
    impactScale: tune.core * 1.15,
    speed: tune.speed,
  };
}

/**
 * Companions read as individuals too, derived from how each one actually fights:
 * heavy slow-firing species cast fat punchy spells, rapid ones flick out lean quick ones.
 */
function speciesStyle(meta: (typeof SPECIES_META)[AetherlingSpecies]): ProjectileStyle {
  // Normalised across the roster's real spread of damage (6..14) and rate (1.8..5.1),
  // so every companion lands in a deliberate band: none looks feebler than the old
  // shared style, and the heavy hitters read notably beefier.
  const heft = clamp((meta.damage - 6) / 8, 0, 1);
  const rapid = clamp((meta.fireRate - 1.8) / 3.3, 0, 1);
  const accent = ELEMENT_COLOR[meta.element];
  return {
    coreColor: meta.glow,
    glowColor: accent,
    trailColor: hexToRgb(meta.glow),
    particleColor: hexToRgb(accent),
    coreScale: 0.7 + 0.22 * heft,
    glowRadius: 0.68 + 0.24 * heft,
    trailLength: 0.6 + 0.5 * rapid,
    trailOpacity: 0.55 + 0.12 * heft,
    particleRate: 0.5 + 0.35 * rapid,
    muzzleFlashScale: 0.66 + 0.22 * heft,
    impactScale: 0.7 + 0.24 * heft,
    speed: 620 + 200 * rapid,
  };
}

export const GUARDIAN_SHOT_STYLE: Record<GID, ProjectileStyle> = {
  [GuardianId.AURELIA]: guardianStyle(GuardianId.AURELIA),
  [GuardianId.KAIRO]: guardianStyle(GuardianId.KAIRO),
  [GuardianId.NYXARA]: guardianStyle(GuardianId.NYXARA),
  [GuardianId.ELARA]: guardianStyle(GuardianId.ELARA),
  [GuardianId.ORION]: guardianStyle(GuardianId.ORION),
  [GuardianId.VESPER]: guardianStyle(GuardianId.VESPER),
};

const SPECIES_SHOT_STYLE = Object.fromEntries(
  SPECIES_LIST.map((id) => [id, speciesStyle(SPECIES_META[id])]),
) as Record<AetherlingSpecies, ProjectileStyle>;

export const DEFAULT_SHOT_STYLE = GUARDIAN_SHOT_STYLE[GuardianId.AURELIA];

export function guardianShotStyle(id: GID): ProjectileStyle {
  return GUARDIAN_SHOT_STYLE[id];
}

export function speciesShotStyle(id: AetherlingSpecies): ProjectileStyle {
  return SPECIES_SHOT_STYLE[id];
}

export function paintShot(b: ShotPaint, style: ProjectileStyle, source: ShotSource, crit: boolean): void {
  b.style = style;
  b.source = source;
  b.crit = crit;
  b.glow = style.coreColor;
}

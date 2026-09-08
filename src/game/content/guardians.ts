import { GuardianId, Rarity } from '../../types/game.ts';
import type { GuardianId as Id, Rarity as R } from '../../types/game.ts';

export interface GuardianDef {
  id: Id;
  name: string;
  title: string;
  blurb: string;
  rarity: R;
  fireRate: number;
  damage: number;
  crit: number;
  special: string;
  specialBlurb: string;
  passive: string;
  unlock: string;
}

export const GUARDIAN_META: Record<Id, GuardianDef> = {
  [GuardianId.AURELIA]: {
    id: GuardianId.AURELIA,
    name: 'AURELIA',
    title: 'Guardian of Dawn',
    blurb: 'Balanced solar striker',
    rarity: Rarity.COMMON,
    fireRate: 7.1,
    damage: 1,
    crit: 0.08,
    special: 'Solar Burst',
    specialBlurb: 'Nova blast that also mends hull',
    passive: 'Steady hands: +8% all damage',
    unlock: 'Starter',
  },
  [GuardianId.KAIRO]: {
    id: GuardianId.KAIRO,
    name: 'KAIRO',
    title: 'Guardian of Storms',
    blurb: 'High attack speed',
    rarity: Rarity.RARE,
    fireRate: 8.6,
    damage: 0.92,
    crit: 0.1,
    special: 'Lightning Dash',
    specialBlurb: 'Brief invuln and rush speed',
    passive: 'Gale: faster clover fire',
    unlock: 'Play 3 runs',
  },
  [GuardianId.NYXARA]: {
    id: GuardianId.NYXARA,
    name: 'NYXARA',
    title: 'Guardian of Shadows',
    blurb: 'High critical damage',
    rarity: Rarity.EPIC,
    fireRate: 6.8,
    damage: 1.05,
    crit: 0.22,
    special: 'Shadow Cloak',
    specialBlurb: 'Invuln and doubled crits',
    passive: 'Night edge: crits hit 2.2x',
    unlock: 'Defeat 3 bosses',
  },
  [GuardianId.ELARA]: {
    id: GuardianId.ELARA,
    name: 'ELARA',
    title: 'Guardian of Nature',
    blurb: 'Defensive support',
    rarity: Rarity.RARE,
    fireRate: 6.6,
    damage: 0.9,
    crit: 0.08,
    special: 'Healing Bloom',
    specialBlurb: 'Restore hull and shield',
    passive: 'Grove: always-on magnet',
    unlock: 'Finish 1 quest',
  },
  [GuardianId.ORION]: {
    id: GuardianId.ORION,
    name: 'ORION',
    title: 'Guardian of the Arcane',
    blurb: 'High ability damage',
    rarity: Rarity.LEGENDARY,
    fireRate: 7.0,
    damage: 1.08,
    crit: 0.1,
    special: 'Arcane Nova',
    specialBlurb: 'Wider, harder burst',
    passive: 'Sigils: special energy 1.8x',
    unlock: 'Earn 800 trophies',
  },
  [GuardianId.VESPER]: {
    id: GuardianId.VESPER,
    name: 'VESPER',
    title: 'Guardian of Twilight',
    blurb: 'High-risk rift walker',
    rarity: Rarity.MYTHIC,
    fireRate: 7.4,
    damage: 1.2,
    crit: 0.14,
    special: 'Time Rift',
    specialBlurb: 'Freeze the field; you take more hits after',
    passive: 'Gamble: +25% coins, -10% max hull',
    unlock: 'Perform 5 evolutions',
  },
};

export const GUARDIAN_LIST = [
  GuardianId.AURELIA,
  GuardianId.KAIRO,
  GuardianId.NYXARA,
  GuardianId.ELARA,
  GuardianId.ORION,
  GuardianId.VESPER,
] as const;

export function guardianXpNeed(level: number): number {
  return 40 + level * 28;
}

export function guardianStatScale(level: number): number {
  return 1 + (Math.min(50, level) - 1) * 0.018;
}

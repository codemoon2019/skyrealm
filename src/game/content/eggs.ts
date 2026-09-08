import { EggTier, Rarity } from '../../types/game.ts';
import type { EggTier as Tier, Rarity as R } from '../../types/game.ts';
import { chance, pick } from '../../utils/random.ts';

export const EGG_ODDS: Record<Tier, { rarity: R; pct: number }[]> = {
  [EggTier.BASIC]: [
    { rarity: Rarity.COMMON, pct: 70 },
    { rarity: Rarity.RARE, pct: 25 },
    { rarity: Rarity.EPIC, pct: 5 },
  ],
  [EggTier.RARE]: [
    { rarity: Rarity.COMMON, pct: 40 },
    { rarity: Rarity.RARE, pct: 45 },
    { rarity: Rarity.EPIC, pct: 13 },
    { rarity: Rarity.LEGENDARY, pct: 2 },
  ],
  [EggTier.EPIC]: [
    { rarity: Rarity.COMMON, pct: 10 },
    { rarity: Rarity.RARE, pct: 40 },
    { rarity: Rarity.EPIC, pct: 40 },
    { rarity: Rarity.LEGENDARY, pct: 9 },
    { rarity: Rarity.MYTHIC, pct: 1 },
  ],
  [EggTier.LEGENDARY]: [
    { rarity: Rarity.RARE, pct: 20 },
    { rarity: Rarity.EPIC, pct: 45 },
    { rarity: Rarity.LEGENDARY, pct: 30 },
    { rarity: Rarity.MYTHIC, pct: 5 },
  ],
  [EggTier.MYTHIC]: [
    { rarity: Rarity.EPIC, pct: 25 },
    { rarity: Rarity.LEGENDARY, pct: 50 },
    { rarity: Rarity.MYTHIC, pct: 25 },
  ],
};

export function rollEggRarity(tier: Tier): R {
  const table = EGG_ODDS[tier];
  let n = Math.random() * 100;
  for (const row of table) {
    n -= row.pct;
    if (n <= 0) return row.rarity;
  }
  return table[table.length - 1]!.rarity;
}

export function pityHint(tier: Tier): string {
  return EGG_ODDS[tier].map((row) => `${row.pct}% ${row.rarity}`).join(' · ');
}

export function randomFrom<T>(list: readonly T[]): T {
  return pick([...list]);
}

export function lucky(p: number): boolean {
  return chance(p);
}

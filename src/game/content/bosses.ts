import { BossKind, ElementId, WorldId } from '../../types/game.ts';
import type { BossKind as K, ElementId as El, WorldId as W } from '../../types/game.ts';

export interface BossDef {
  kind: K;
  name: string;
  health: number;
  raidHealth: number;
  radius: number;
  element: El;
  world: W;
  pattern: 'hydra' | 'queen' | 'titan' | 'serpent' | 'storm';
  coins: number;
  crystals: number;
  trophies: number;
}

export const BOSS_META: Record<K, BossDef> = {
  [BossKind.IRON_HYDRA]: { kind: BossKind.IRON_HYDRA, name: 'IRON HYDRA', health: 1600, raidHealth: 18000, radius: 54, element: ElementId.NATURE, world: WorldId.MEADOWS, pattern: 'hydra', coins: 80, crystals: 2, trophies: 12 },
  [BossKind.EMBER_QUEEN]: { kind: BossKind.EMBER_QUEEN, name: 'EMBER QUEEN', health: 1900, raidHealth: 20000, radius: 56, element: ElementId.FIRE, world: WorldId.EMBER_CANYON, pattern: 'queen', coins: 90, crystals: 3, trophies: 14 },
  [BossKind.VOID_BEHEMOTH]: { kind: BossKind.VOID_BEHEMOTH, name: 'VOID BEHEMOTH', health: 2400, raidHealth: 26000, radius: 66, element: ElementId.SHADOW, world: WorldId.VOID_FRONTIER, pattern: 'titan', coins: 120, crystals: 4, trophies: 20 },
  [BossKind.FROST_TITAN]: { kind: BossKind.FROST_TITAN, name: 'FROST TITAN', health: 2100, raidHealth: 22000, radius: 64, element: ElementId.WATER, world: WorldId.FROZEN_SKIES, pattern: 'titan', coins: 100, crystals: 3, trophies: 16 },
  [BossKind.SHADOW_SERPENT]: { kind: BossKind.SHADOW_SERPENT, name: 'SHADOW SERPENT', health: 2000, raidHealth: 21000, radius: 58, element: ElementId.SHADOW, world: WorldId.SHADOW_REALM, pattern: 'serpent', coins: 95, crystals: 3, trophies: 15 },
  [BossKind.STORM_COLOSSUS]: { kind: BossKind.STORM_COLOSSUS, name: 'STORM COLOSSUS', health: 2300, raidHealth: 24000, radius: 68, element: ElementId.LIGHT, world: WorldId.STORM_KINGDOM, pattern: 'storm', coins: 110, crystals: 4, trophies: 18 },
  [BossKind.CRYSTAL_WARDEN]: { kind: BossKind.CRYSTAL_WARDEN, name: 'CRYSTAL WARDEN', health: 1800, raidHealth: 19000, radius: 52, element: ElementId.ARCANE, world: WorldId.CRYSTAL_FOREST, pattern: 'hydra', coins: 85, crystals: 3, trophies: 13 },
  [BossKind.DAWN_SPHINX]: { kind: BossKind.DAWN_SPHINX, name: 'DAWN SPHINX', health: 2000, raidHealth: 21000, radius: 60, element: ElementId.LIGHT, world: WorldId.CELESTIAL_RUINS, pattern: 'queen', coins: 100, crystals: 3, trophies: 16 },
  [BossKind.RUIN_KNIGHT]: { kind: BossKind.RUIN_KNIGHT, name: 'RUIN KNIGHT', health: 2200, raidHealth: 23000, radius: 58, element: ElementId.ARCANE, world: WorldId.CELESTIAL_RUINS, pattern: 'storm', coins: 105, crystals: 3, trophies: 17 },
  [BossKind.AETHER_WYRM]: { kind: BossKind.AETHER_WYRM, name: 'AETHER WYRM', health: 2600, raidHealth: 30000, radius: 70, element: ElementId.ARCANE, world: WorldId.VOID_FRONTIER, pattern: 'serpent', coins: 140, crystals: 5, trophies: 24 },
};

export const BOSS_LIST = Object.values(BOSS_META);

export const WORLD_BOSS: Record<W, K> = {
  [WorldId.MEADOWS]: BossKind.IRON_HYDRA,
  [WorldId.CRYSTAL_FOREST]: BossKind.CRYSTAL_WARDEN,
  [WorldId.EMBER_CANYON]: BossKind.EMBER_QUEEN,
  [WorldId.FROZEN_SKIES]: BossKind.FROST_TITAN,
  [WorldId.SHADOW_REALM]: BossKind.SHADOW_SERPENT,
  [WorldId.STORM_KINGDOM]: BossKind.STORM_COLOSSUS,
  [WorldId.CELESTIAL_RUINS]: BossKind.DAWN_SPHINX,
  [WorldId.VOID_FRONTIER]: BossKind.VOID_BEHEMOTH,
};

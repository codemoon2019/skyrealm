import { ElementId, EnemyType, WorldId } from '../../types/game.ts';
import type { ElementId as El, EnemyType as En, WorldId as W } from '../../types/game.ts';
import { skyTint } from './skies.ts';

export interface WorldDef {
  id: W;
  name: string;
  tint: readonly [number, number, number];
  element: El;
  foes: readonly En[];
}

export const WORLDS: Record<W, WorldDef> = {
  [WorldId.MEADOWS]: {
    id: WorldId.MEADOWS,
    name: 'AETHER MEADOWS',
    tint: skyTint(WorldId.MEADOWS),
    element: ElementId.NATURE,
    foes: [EnemyType.SWARM, EnemyType.SCOUT, EnemyType.SPORE, EnemyType.AETHER_TICK],
  },
  [WorldId.CRYSTAL_FOREST]: {
    id: WorldId.CRYSTAL_FOREST,
    name: 'CRYSTAL FOREST',
    tint: skyTint(WorldId.CRYSTAL_FOREST),
    element: ElementId.ARCANE,
    foes: [EnemyType.DRONE, EnemyType.ZIGZAG, EnemyType.MAGE, EnemyType.CRYSTAL_GOLEM],
  },
  [WorldId.EMBER_CANYON]: {
    id: WorldId.EMBER_CANYON,
    name: 'EMBER CANYON',
    tint: skyTint(WorldId.EMBER_CANYON),
    element: ElementId.FIRE,
    foes: [EnemyType.KAMIKAZE, EnemyType.TANK, EnemyType.BOMBER, EnemyType.SCOUT],
  },
  [WorldId.FROZEN_SKIES]: {
    id: WorldId.FROZEN_SKIES,
    name: 'FROZEN SKIES',
    tint: skyTint(WorldId.FROZEN_SKIES),
    element: ElementId.WATER,
    foes: [EnemyType.CRAWLER, EnemyType.FLYER, EnemyType.FROST_GOBLIN, EnemyType.SWARM],
  },
  [WorldId.SHADOW_REALM]: {
    id: WorldId.SHADOW_REALM,
    name: 'SHADOW REALM',
    tint: skyTint(WorldId.SHADOW_REALM),
    element: ElementId.SHADOW,
    foes: [EnemyType.VOID_BAT, EnemyType.ELITE, EnemyType.BONE_WISP, EnemyType.KAMIKAZE],
  },
  [WorldId.STORM_KINGDOM]: {
    id: WorldId.STORM_KINGDOM,
    name: 'STORM KINGDOM',
    tint: skyTint(WorldId.STORM_KINGDOM),
    element: ElementId.LIGHT,
    foes: [EnemyType.FLYER, EnemyType.MAGE, EnemyType.BOMBER, EnemyType.TANK],
  },
  [WorldId.CELESTIAL_RUINS]: {
    id: WorldId.CELESTIAL_RUINS,
    name: 'CELESTIAL RUINS',
    tint: skyTint(WorldId.CELESTIAL_RUINS),
    element: ElementId.LIGHT,
    foes: [EnemyType.TANK, EnemyType.ELITE, EnemyType.MINI_BOSS, EnemyType.LOOT_CRATE],
  },
  [WorldId.VOID_FRONTIER]: {
    id: WorldId.VOID_FRONTIER,
    name: 'VOID FRONTIER',
    tint: skyTint(WorldId.VOID_FRONTIER),
    element: ElementId.SHADOW,
    foes: [EnemyType.MINI_BOSS, EnemyType.ELITE, EnemyType.KAMIKAZE, EnemyType.MAGE],
  },
};

export const WORLD_LIST = Object.values(WORLDS);

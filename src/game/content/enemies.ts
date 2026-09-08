import { EnemyType } from '../../types/game.ts';
import type { EnemyType as T } from '../../types/game.ts';

export const ENEMY_SCORE: Record<T, number> = {
  [EnemyType.SCOUT]: 100,
  [EnemyType.DRONE]: 200,
  [EnemyType.ZIGZAG]: 300,
  [EnemyType.TANK]: 500,
  [EnemyType.SWARM]: 80,
  [EnemyType.KAMIKAZE]: 400,
  [EnemyType.LOOT_CRATE]: 150,
  [EnemyType.CRAWLER]: 180,
  [EnemyType.FLYER]: 220,
  [EnemyType.MAGE]: 320,
  [EnemyType.BOMBER]: 360,
  [EnemyType.ELITE]: 700,
  [EnemyType.MINI_BOSS]: 1200,
  [EnemyType.SPORE]: 90,
  [EnemyType.WISP_FOE]: 140,
  [EnemyType.VOID_BAT]: 210,
  [EnemyType.FROST_GOBLIN]: 240,
  [EnemyType.BONE_WISP]: 190,
  [EnemyType.AETHER_TICK]: 160,
  [EnemyType.CRYSTAL_GOLEM]: 640,
};

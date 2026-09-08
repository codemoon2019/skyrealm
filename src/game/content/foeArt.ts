import { EnemyType } from '../../types/game.ts';
import type { EnemyType as T } from '../../types/game.ts';

export interface FoeArt {
  slug: string;
  name: string;
  feature: string;
  fill: string;
  accent: string;
  aura: readonly [number, number, number];
}

export const FOE_ART: Record<T, FoeArt> = {
  [EnemyType.SCOUT]: {
    slug: 'gleam_peck',
    name: 'Gleam Peck',
    feature: 'beak',
    fill: '#ffb45a',
    accent: '#ffe08a',
    aura: [255, 180, 90],
  },
  [EnemyType.DRONE]: {
    slug: 'hex_orb',
    name: 'Hex Orb',
    feature: 'facets',
    fill: '#ff6bb8',
    accent: '#ffd0f2',
    aura: [255, 90, 180],
  },
  [EnemyType.ZIGZAG]: {
    slug: 'bolt_grin',
    name: 'Bolt Grin',
    feature: 'jagged mouth',
    fill: '#7dff6b',
    accent: '#ffe08a',
    aura: [125, 255, 107],
  },
  [EnemyType.TANK]: {
    slug: 'iron_maw',
    name: 'Iron Maw',
    feature: 'stone jaw',
    fill: '#c9a227',
    accent: '#8a7020',
    aura: [201, 162, 39],
  },
  [EnemyType.SWARM]: {
    slug: 'puffling',
    name: 'Puffling',
    feature: 'puff cheeks',
    fill: '#ff8ab3',
    accent: '#fff0f6',
    aura: [255, 138, 179],
  },
  [EnemyType.KAMIKAZE]: {
    slug: 'ember_maw',
    name: 'Ember Maw',
    feature: 'volcanic grin',
    fill: '#ff4a3a',
    accent: '#ffb347',
    aura: [255, 90, 50],
  },
  [EnemyType.LOOT_CRATE]: {
    slug: 'hoard_face',
    name: 'Hoard Face',
    feature: 'jeweled grin',
    fill: '#ffd24a',
    accent: '#fff6c8',
    aura: [255, 210, 74],
  },
  [EnemyType.CRAWLER]: {
    slug: 'slime_warden',
    name: 'Slime Warden',
    feature: 'gel drops',
    fill: '#8fd98a',
    accent: '#d8ffc8',
    aura: [143, 217, 138],
  },
  [EnemyType.FLYER]: {
    slug: 'gale_beak',
    name: 'Gale Beak',
    feature: 'ear fins',
    fill: '#7ee8ff',
    accent: '#e8fbff',
    aura: [126, 232, 255],
  },
  [EnemyType.MAGE]: {
    slug: 'rune_iris',
    name: 'Rune Iris',
    feature: 'single eye',
    fill: '#c46bff',
    accent: '#ffe08a',
    aura: [196, 107, 255],
  },
  [EnemyType.BOMBER]: {
    slug: 'cinder_cheek',
    name: 'Cinder Cheek',
    feature: 'fuse tuft',
    fill: '#ff6b4a',
    accent: '#ffd24a',
    aura: [255, 107, 74],
  },
  [EnemyType.ELITE]: {
    slug: 'abyssal_eye',
    name: 'Abyssal Eye',
    feature: 'tentacle wisps',
    fill: '#3a2458',
    accent: '#ffe08a',
    aura: [180, 140, 255],
  },
  [EnemyType.MINI_BOSS]: {
    slug: 'crown_horror',
    name: 'Crown Horror',
    feature: 'ornate crown',
    fill: '#ff7ad9',
    accent: '#ffe08a',
    aura: [255, 122, 217],
  },
  [EnemyType.SPORE]: {
    slug: 'thorn_beast',
    name: 'Thorn Beast',
    feature: 'thorn crown',
    fill: '#b6ff8a',
    accent: '#5a8f4a',
    aura: [182, 255, 138],
  },
  [EnemyType.WISP_FOE]: {
    slug: 'wick_wisp',
    name: 'Wick Wisp',
    feature: 'flame tuft',
    fill: '#b388ff',
    accent: '#ffe08a',
    aura: [179, 136, 255],
  },
  [EnemyType.VOID_BAT]: {
    slug: 'voidling',
    name: 'Voidling',
    feature: 'three eyes',
    fill: '#4a2a78',
    accent: '#c46bff',
    aura: [107, 74, 168],
  },
  [EnemyType.FROST_GOBLIN]: {
    slug: 'frost_fang',
    name: 'Frost Fang',
    feature: 'ice fangs',
    fill: '#7ec8ff',
    accent: '#e8fbff',
    aura: [126, 200, 255],
  },
  [EnemyType.BONE_WISP]: {
    slug: 'skull_wink',
    name: 'Skull Wink',
    feature: 'wink',
    fill: '#e8dcc8',
    accent: '#fffef6',
    aura: [232, 220, 200],
  },
  [EnemyType.AETHER_TICK]: {
    slug: 'nib',
    name: 'Nib',
    feature: 'feelers',
    fill: '#ff7ad9',
    accent: '#ffe0f2',
    aura: [255, 122, 217],
  },
  [EnemyType.CRYSTAL_GOLEM]: {
    slug: 'facet_titan',
    name: 'Facet Titan',
    feature: 'crystal planes',
    fill: '#c46bff',
    accent: '#f0e8ff',
    aura: [196, 107, 255],
  },
};

export function foeAura(type: T): readonly [number, number, number] {
  return FOE_ART[type].aura;
}

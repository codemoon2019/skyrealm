import { AbilityId, AetherlingSpecies, ElementId, Rarity } from '../../types/game.ts';
import type { AbilityId as Ab, AetherlingSpecies as Sp, ElementId as El, Rarity as R } from '../../types/game.ts';

export interface SpeciesDef {
  name: string;
  blurb: string;
  element: El;
  ability: Ab;
  fireRate: number;
  damage: number;
  crit: number;
  glow: string;
  affinity: string;
}

export const SPECIES_META: Record<Sp, SpeciesDef> = {
  [AetherlingSpecies.FLICKER]: { name: 'FLICKER', blurb: 'Tiny ember dart', element: ElementId.FIRE, ability: AbilityId.FIREBALL, fireRate: 4.8, damage: 7, crit: 0.06, glow: '#ff6b4a', affinity: 'Ember' },
  [AetherlingSpecies.CINDER]: { name: 'CINDER', blurb: 'Slow searing shot', element: ElementId.FIRE, ability: AbilityId.BURN_TICK, fireRate: 2.6, damage: 14, crit: 0.08, glow: '#ffb347', affinity: 'Forge' },
  [AetherlingSpecies.PYRELING]: { name: 'PYRELING', blurb: 'Splash sparks', element: ElementId.FIRE, ability: AbilityId.SPLASH, fireRate: 3.2, damage: 9, crit: 0.07, glow: '#ff8a4a', affinity: 'Hearth' },
  [AetherlingSpecies.TIDECURL]: { name: 'TIDECURL', blurb: 'Frost bolt', element: ElementId.WATER, ability: AbilityId.FROST_NOVA, fireRate: 3.4, damage: 9, crit: 0.06, glow: '#3df0ff', affinity: 'Tide' },
  [AetherlingSpecies.BRINE]: { name: 'BRINE', blurb: 'Heavy water ram', element: ElementId.WATER, ability: AbilityId.FREEZE_NOVA, fireRate: 2.2, damage: 15, crit: 0.05, glow: '#7ec8ff', affinity: 'Deep' },
  [AetherlingSpecies.RIPPLE]: { name: 'RIPPLE', blurb: 'Coin-finding current', element: ElementId.WATER, ability: AbilityId.COIN_FIND, fireRate: 3.8, damage: 7, crit: 0.05, glow: '#9ee8ff', affinity: 'Spring' },
  [AetherlingSpecies.SPROUT]: { name: 'SPROUT', blurb: 'Healing leaf', element: ElementId.NATURE, ability: AbilityId.HEALING_PULSE, fireRate: 2.0, damage: 6, crit: 0.04, glow: '#7dff9a', affinity: 'Grove' },
  [AetherlingSpecies.BRAMBLE]: { name: 'BRAMBLE', blurb: 'Piercing thorn', element: ElementId.NATURE, ability: AbilityId.PIERCE, fireRate: 2.8, damage: 10, crit: 0.07, glow: '#5cb86a', affinity: 'Thicket' },
  [AetherlingSpecies.MOSSKIN]: { name: 'MOSSKIN', blurb: 'Shield drip', element: ElementId.NATURE, ability: AbilityId.AETHER_SHIELD, fireRate: 1.8, damage: 8, crit: 0.04, glow: '#b6ff8a', affinity: 'Moss' },
  [AetherlingSpecies.GLOOM]: { name: 'GLOOM', blurb: 'Boss hunter', element: ElementId.SHADOW, ability: AbilityId.SHADOW_STRIKE, fireRate: 2.4, damage: 12, crit: 0.12, glow: '#8a7dff', affinity: 'Dusk' },
  [AetherlingSpecies.DUSKWISP]: { name: 'DUSKWISP', blurb: 'Marks prey', element: ElementId.SHADOW, ability: AbilityId.SHADOW_MARK, fireRate: 3.0, damage: 9, crit: 0.1, glow: '#6b6288', affinity: 'Veil' },
  [AetherlingSpecies.NIGHTMOTH]: { name: 'NIGHTMOTH', blurb: 'Homing shade', element: ElementId.SHADOW, ability: AbilityId.HOMING, fireRate: 2.3, damage: 11, crit: 0.09, glow: '#c46bff', affinity: 'Moon' },
  [AetherlingSpecies.LUMEN]: { name: 'LUMEN', blurb: 'Fast light bolts', element: ElementId.LIGHT, ability: AbilityId.LIGHT_BEAM, fireRate: 5.1, damage: 6, crit: 0.08, glow: '#ffe08a', affinity: 'Dawn' },
  [AetherlingSpecies.HALO]: { name: 'HALO', blurb: 'Energy drip', element: ElementId.LIGHT, ability: AbilityId.ENERGY_DRIP, fireRate: 2.6, damage: 8, crit: 0.06, glow: '#fff4b0', affinity: 'Aureole' },
  [AetherlingSpecies.GLIMMER]: { name: 'GLIMMER', blurb: 'Treasure pull', element: ElementId.LIGHT, ability: AbilityId.TREASURE_MAGNET, fireRate: 3.3, damage: 7, crit: 0.05, glow: '#ffd24a', affinity: 'Gleam' },
  [AetherlingSpecies.HEXLING]: { name: 'HEXLING', blurb: 'Chain spark', element: ElementId.ARCANE, ability: AbilityId.THUNDER_CHAIN, fireRate: 2.7, damage: 10, crit: 0.1, glow: '#ff7ad9', affinity: 'Hex' },
  [AetherlingSpecies.PRISMITE]: { name: 'PRISMITE', blurb: 'Crit fury', element: ElementId.ARCANE, ability: AbilityId.CRITICAL_FURY, fireRate: 3.1, damage: 8, crit: 0.16, glow: '#c46bff', affinity: 'Prism' },
  [AetherlingSpecies.ECHO]: { name: 'ECHO', blurb: 'Arcane echo shot', element: ElementId.ARCANE, ability: AbilityId.ARCANE_ECHO, fireRate: 2.5, damage: 11, crit: 0.09, glow: '#ff9ad4', affinity: 'Resonance' },
  [AetherlingSpecies.FLAMEFOX]: { name: 'FLAMEFOX', blurb: 'Dash ember', element: ElementId.FIRE, ability: AbilityId.HASTE, fireRate: 4.2, damage: 8, crit: 0.09, glow: '#ff6b4a', affinity: 'Cinderkit' },
  [AetherlingSpecies.AQUAMANTA]: { name: 'AQUAMANTA', blurb: 'Gliding tide', element: ElementId.WATER, ability: AbilityId.SPLASH, fireRate: 2.9, damage: 10, crit: 0.06, glow: '#5ad4ff', affinity: 'Reef' },
  [AetherlingSpecies.MOSSLING]: { name: 'MOSSLING', blurb: 'Thorn drip', element: ElementId.NATURE, ability: AbilityId.THORNS, fireRate: 2.1, damage: 9, crit: 0.05, glow: '#8fd98a', affinity: 'Loam' },
  [AetherlingSpecies.STORMWING]: { name: 'STORMWING', blurb: 'Chain gust', element: ElementId.LIGHT, ability: AbilityId.THUNDER_CHAIN, fireRate: 3.0, damage: 10, crit: 0.1, glow: '#ffe08a', affinity: 'Gale' },
  [AetherlingSpecies.SHADOWCUB]: { name: 'SHADOWCUB', blurb: 'Pounce mark', element: ElementId.SHADOW, ability: AbilityId.SHADOW_MARK, fireRate: 2.8, damage: 11, crit: 0.11, glow: '#8a7dff', affinity: 'Umbral' },
  [AetherlingSpecies.CRYSTSERPENT]: { name: 'CRYSTSERPENT', blurb: 'Pierce coil', element: ElementId.ARCANE, ability: AbilityId.PIERCE, fireRate: 2.4, damage: 13, crit: 0.08, glow: '#c46bff', affinity: 'Facet' },
  [AetherlingSpecies.MOONOWL]: { name: 'MOONOWL', blurb: 'Homing hush', element: ElementId.SHADOW, ability: AbilityId.HOMING, fireRate: 2.2, damage: 12, crit: 0.1, glow: '#b8a8ff', affinity: 'Lunar' },
  [AetherlingSpecies.SOLARHARE]: { name: 'SOLARHARE', blurb: 'Light hop', element: ElementId.LIGHT, ability: AbilityId.LIGHT_BEAM, fireRate: 4.4, damage: 7, crit: 0.09, glow: '#ffe08a', affinity: 'Sunlit' },
  [AetherlingSpecies.FROSTLYNX]: { name: 'FROSTLYNX', blurb: 'Ice pounce', element: ElementId.WATER, ability: AbilityId.FREEZE_NOVA, fireRate: 2.5, damage: 12, crit: 0.07, glow: '#9ee8ff', affinity: 'Rime' },
  [AetherlingSpecies.VOIDPUP]: { name: 'VOIDPUP', blurb: 'Boss nibble', element: ElementId.SHADOW, ability: AbilityId.SHADOW_STRIKE, fireRate: 3.1, damage: 9, crit: 0.13, glow: '#6b6288', affinity: 'Nihility' },
  [AetherlingSpecies.EMBERBAT]: { name: 'EMBERBAT', blurb: 'Burn flutter', element: ElementId.FIRE, ability: AbilityId.BURN_TICK, fireRate: 3.6, damage: 8, crit: 0.08, glow: '#ff8a4a', affinity: 'Soot' },
  [AetherlingSpecies.THORNBACK]: { name: 'THORNBACK', blurb: 'Shield thorns', element: ElementId.NATURE, ability: AbilityId.AETHER_SHIELD, fireRate: 1.9, damage: 10, crit: 0.05, glow: '#5cb86a', affinity: 'Bramble' },
};

export const SPECIES_LIST = Object.keys(SPECIES_META) as Sp[];

export function aetherXpNeed(level: number): number {
  return 36 + level * 22;
}

export function aetherPower(level: number, stars: number, rarity: R): { damage: number; fireRate: number; crit: number } {
  const rarityMul =
    rarity === Rarity.MYTHIC ? 1.7 : rarity === Rarity.LEGENDARY ? 1.5 : rarity === Rarity.EPIC ? 1.32 : rarity === Rarity.RARE ? 1.16 : 1;
  const star = 1 + (stars - 1) * 0.22;
  const lv = 1 + (level - 1) * 0.045;
  return { damage: rarityMul * star * lv, fireRate: 1 + (stars - 1) * 0.06 + (level - 1) * 0.015, crit: 1 + (stars - 1) * 0.04 };
}

export function evolveNeed(stars: 1 | 2 | 3 | 4): { level: number; essence: number; shards: number } | null {
  if (stars === 1) return { level: 12, essence: 3, shards: 4 };
  if (stars === 2) return { level: 18, essence: 8, shards: 8 };
  if (stars === 3) return { level: 24, essence: 16, shards: 14 };
  return null;
}

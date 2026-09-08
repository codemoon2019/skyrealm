import { AbilityId } from '../../types/game.ts';
import type { AbilityId as Id } from '../../types/game.ts';

export interface AbilityDef {
  id: Id;
  name: string;
  blurb: string;
}

export const ABILITIES: Record<Id, AbilityDef> = {
  [AbilityId.FIREBALL]: { id: AbilityId.FIREBALL, name: 'Fireball', blurb: 'Heavy fire bolt' },
  [AbilityId.HEALING_PULSE]: { id: AbilityId.HEALING_PULSE, name: 'Healing Pulse', blurb: 'Mends the Guardian' },
  [AbilityId.FROST_NOVA]: { id: AbilityId.FROST_NOVA, name: 'Frost Nova', blurb: 'Slows nearby foes' },
  [AbilityId.SHADOW_STRIKE]: { id: AbilityId.SHADOW_STRIKE, name: 'Shadow Strike', blurb: 'Bonus boss damage' },
  [AbilityId.THUNDER_CHAIN]: { id: AbilityId.THUNDER_CHAIN, name: 'Thunder Chain', blurb: 'Hits extra targets' },
  [AbilityId.TREASURE_MAGNET]: { id: AbilityId.TREASURE_MAGNET, name: 'Treasure Magnet', blurb: 'Wider pickup pull' },
  [AbilityId.CRITICAL_FURY]: { id: AbilityId.CRITICAL_FURY, name: 'Critical Fury', blurb: 'Bursts of crit chance' },
  [AbilityId.AETHER_SHIELD]: { id: AbilityId.AETHER_SHIELD, name: 'Aether Shield', blurb: 'Drips barrier' },
  [AbilityId.BURN_TICK]: { id: AbilityId.BURN_TICK, name: 'Ember Brand', blurb: 'Burning shots' },
  [AbilityId.SPLASH]: { id: AbilityId.SPLASH, name: 'Tide Splash', blurb: 'Short spread' },
  [AbilityId.PIERCE]: { id: AbilityId.PIERCE, name: 'Thorn Pierce', blurb: 'Shots pass through' },
  [AbilityId.HOMING]: { id: AbilityId.HOMING, name: 'Seeker', blurb: 'Homes on foes' },
  [AbilityId.COIN_FIND]: { id: AbilityId.COIN_FIND, name: 'Coin Find', blurb: 'Richer crystal drops' },
  [AbilityId.ENERGY_DRIP]: { id: AbilityId.ENERGY_DRIP, name: 'Energy Drip', blurb: 'Fills special faster' },
  [AbilityId.THORNS]: { id: AbilityId.THORNS, name: 'Thorns', blurb: 'Ram chips attackers' },
  [AbilityId.FREEZE_NOVA]: { id: AbilityId.FREEZE_NOVA, name: 'Ice Veil', blurb: 'Chance to freeze' },
  [AbilityId.LIGHT_BEAM]: { id: AbilityId.LIGHT_BEAM, name: 'Light Beam', blurb: 'Fast bright bolts' },
  [AbilityId.SHADOW_MARK]: { id: AbilityId.SHADOW_MARK, name: 'Shadow Mark', blurb: 'Marked foes take more' },
  [AbilityId.ARCANE_ECHO]: { id: AbilityId.ARCANE_ECHO, name: 'Arcane Echo', blurb: 'Echo shot' },
  [AbilityId.HASTE]: { id: AbilityId.HASTE, name: 'Haste', blurb: 'Faster companion fire' },
};

export const ABILITY_LIST = Object.values(ABILITIES);

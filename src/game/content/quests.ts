export interface QuestDef {
  id: string;
  name: string;
  minutes: number;
  coins: number;
  crystals: number;
  essence: number;
  xp: number;
  eggChance: number;
}

export const QUEST_DEFS: QuestDef[] = [
  { id: 'woods', name: 'Whispering Woods', minutes: 5, coins: 80, crystals: 1, essence: 1, xp: 40, eggChance: 0.18 },
  { id: 'canyon', name: 'Ember Canyon Watch', minutes: 8, coins: 130, crystals: 2, essence: 2, xp: 70, eggChance: 0.24 },
  { id: 'ruins', name: 'Celestial Ruins', minutes: 10, coins: 180, crystals: 2, essence: 2, xp: 90, eggChance: 0.3 },
  { id: 'void', name: 'Void March', minutes: 12, coins: 240, crystals: 3, essence: 3, xp: 120, eggChance: 0.36 },
];

import { BRAND } from '../brand.ts';
import { Difficulty, ElementId, GuardianId } from '../types/game.ts';
import type { SaveGame } from '../types/game.ts';
import { GUARDIAN_LIST } from '../game/content/guardians.ts';
import { ELEMENT_LIST } from '../game/content/elements.ts';
import { AetherlingSpecies, Rarity } from '../types/game.ts';
import { newId } from '../utils/ids.ts';

function asCount(n: unknown): number {
  const v = Math.round(Number(n));
  return Number.isFinite(v) && v > 0 ? v : 0;
}

export function emptyShards(): Record<ElementId, number> {
  const shards = {} as Record<ElementId, number>;
  for (const el of ELEMENT_LIST) shards[el] = 0;
  return shards;
}

export function starterSave(): SaveGame {
  const flicker = {
    id: newId('ae'),
    species: AetherlingSpecies.FLICKER,
    rarity: Rarity.COMMON,
    level: 1,
    xp: 0,
    stars: 1 as const,
    element: ElementId.FIRE,
    history: ['Starter companion'],
  };
  const guardians = {} as SaveGame['guardians'];
  for (const id of GUARDIAN_LIST) {
    guardians[id] = { id, unlocked: id === GuardianId.AURELIA, level: 1, xp: 0 };
  }
  return {
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      screenShakeEnabled: true,
      particlesEnabled: true,
      quality: 'HIGH',
      difficulty: Difficulty.NORMAL,
      touchHand: 'LEFT',
      highScore: 0,
    },
    profile: {
      coins: 280,
      crystals: 4,
      trophies: 0,
      bossEnergy: 3,
      essence: 2,
      shards: emptyShards(),
      totalKills: 0,
      totalCoins: 0,
      bossesKilled: 0,
      evolutions: 0,
      runsPlayed: 0,
      questsDone: 0,
      raidsDone: 0,
    },
    guardians,
    equippedGuardian: GuardianId.AURELIA,
    aetherlings: [flicker],
    equipped: [flicker.id, null],
    discovered: [AetherlingSpecies.FLICKER],
    eggs: { BASIC: 1, RARE: 0, EPIC: 0, LEGENDARY: 0, MYTHIC: 0 },
    quests: [],
    daily: { lastLogin: '', streak: 0, claimed: 0, missions: [], missionDay: '' },
    achievements: {},
      raidGhosts: [
      { name: 'Lumen Fox', damage: 4200 },
      { name: 'Bramble Knight', damage: 3100 },
      { name: 'Nimbus', damage: 1800 },
    ],
    tutorialDone: false,
    web3: {},
  };
}

export class SaveManager {
  data: SaveGame;

  constructor() {
    this.data = this.read();
    this.persist();
  }

  persist(): void {
    try {
      localStorage.setItem(BRAND.storageKey, JSON.stringify(this.data));
    } catch {
      // quota / private mode
    }
  }

  reset(): void {
    this.data = starterSave();
    this.persist();
  }

  private read(): SaveGame {
    try {
      const raw = localStorage.getItem(BRAND.storageKey);
      if (!raw) return starterSave();
      const parsed = JSON.parse(raw) as SaveGame;
      if (!parsed?.profile || !parsed.guardians) return starterSave();
      parsed.tutorialDone = parsed.tutorialDone === true || (parsed.profile?.runsPlayed ?? 0) > 0;
      parsed.profile.coins = asCount(parsed.profile.coins);
      parsed.profile.crystals = asCount(parsed.profile.crystals);
      parsed.profile.trophies = asCount(parsed.profile.trophies);
      parsed.profile.bossEnergy = asCount(parsed.profile.bossEnergy);
      parsed.profile.essence = asCount(parsed.profile.essence);
      parsed.eggs = {
        BASIC: parsed.eggs?.BASIC ?? 0,
        RARE: parsed.eggs?.RARE ?? 0,
        EPIC: parsed.eggs?.EPIC ?? 0,
        LEGENDARY: parsed.eggs?.LEGENDARY ?? 0,
        MYTHIC: parsed.eggs?.MYTHIC ?? 0,
      };
      parsed.web3 = { lastAddress: parsed.web3?.lastAddress };
      parsed.settings = {
        ...starterSave().settings,
        ...parsed.settings,
        touchHand: parsed.settings?.touchHand === 'RIGHT' ? 'RIGHT' : 'LEFT',
      };
      return parsed;
    } catch {
      return starterSave();
    }
  }
}

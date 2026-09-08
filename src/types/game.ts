export const GameState = {
  MENU: 'MENU',
  COUNTDOWN: 'COUNTDOWN',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  BOSS_WARNING: 'BOSS_WARNING',
  BOSS_FIGHT: 'BOSS_FIGHT',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY',
} as const;

export type GameState = (typeof GameState)[keyof typeof GameState];

export const RunMode = {
  NORMAL: 'NORMAL',
  RAID: 'RAID',
  TRAINING: 'TRAINING',
} as const;

export type RunMode = (typeof RunMode)[keyof typeof RunMode];

export const Difficulty = {
  EASY: 'EASY',
  NORMAL: 'NORMAL',
  HARD: 'HARD',
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const ElementId = {
  FIRE: 'FIRE',
  WATER: 'WATER',
  NATURE: 'NATURE',
  SHADOW: 'SHADOW',
  LIGHT: 'LIGHT',
  ARCANE: 'ARCANE',
} as const;

export type ElementId = (typeof ElementId)[keyof typeof ElementId];

export const Rarity = {
  COMMON: 'COMMON',
  RARE: 'RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY',
  MYTHIC: 'MYTHIC',
} as const;

export type Rarity = (typeof Rarity)[keyof typeof Rarity];

export const EnemyType = {
  SCOUT: 'SCOUT',
  DRONE: 'DRONE',
  ZIGZAG: 'ZIGZAG',
  TANK: 'TANK',
  SWARM: 'SWARM',
  KAMIKAZE: 'KAMIKAZE',
  LOOT_CRATE: 'LOOT_CRATE',
  CRAWLER: 'CRAWLER',
  FLYER: 'FLYER',
  MAGE: 'MAGE',
  BOMBER: 'BOMBER',
  ELITE: 'ELITE',
  MINI_BOSS: 'MINI_BOSS',
  SPORE: 'SPORE',
  WISP_FOE: 'WISP_FOE',
  VOID_BAT: 'VOID_BAT',
  FROST_GOBLIN: 'FROST_GOBLIN',
  BONE_WISP: 'BONE_WISP',
  AETHER_TICK: 'AETHER_TICK',
  CRYSTAL_GOLEM: 'CRYSTAL_GOLEM',
} as const;

export type EnemyType = (typeof EnemyType)[keyof typeof EnemyType];

export const PowerUpType = {
  CLOVER: 'CLOVER',
  MAGNET: 'MAGNET',
  DOUBLE: 'DOUBLE',
  RUSH: 'RUSH',
  HEART: 'HEART',
  FREEZE: 'FREEZE',
  BLAST: 'BLAST',
} as const;

export type PowerUpType = (typeof PowerUpType)[keyof typeof PowerUpType];

export const ProjectileKind = {
  STRAIGHT: 'STRAIGHT',
  PLASMA: 'PLASMA',
  MISSILE: 'MISSILE',
  SPREAD: 'SPREAD',
  HOMING: 'HOMING',
} as const;

export type ProjectileKind = (typeof ProjectileKind)[keyof typeof ProjectileKind];

export const BossKind = {
  IRON_HYDRA: 'IRON_HYDRA',
  EMBER_QUEEN: 'EMBER_QUEEN',
  VOID_BEHEMOTH: 'VOID_BEHEMOTH',
  FROST_TITAN: 'FROST_TITAN',
  SHADOW_SERPENT: 'SHADOW_SERPENT',
  STORM_COLOSSUS: 'STORM_COLOSSUS',
  CRYSTAL_WARDEN: 'CRYSTAL_WARDEN',
  DAWN_SPHINX: 'DAWN_SPHINX',
  RUIN_KNIGHT: 'RUIN_KNIGHT',
  AETHER_WYRM: 'AETHER_WYRM',
} as const;

export type BossKind = (typeof BossKind)[keyof typeof BossKind];

export const WorldId = {
  MEADOWS: 'MEADOWS',
  CRYSTAL_FOREST: 'CRYSTAL_FOREST',
  EMBER_CANYON: 'EMBER_CANYON',
  FROZEN_SKIES: 'FROZEN_SKIES',
  SHADOW_REALM: 'SHADOW_REALM',
  STORM_KINGDOM: 'STORM_KINGDOM',
  CELESTIAL_RUINS: 'CELESTIAL_RUINS',
  VOID_FRONTIER: 'VOID_FRONTIER',
} as const;

export type WorldId = (typeof WorldId)[keyof typeof WorldId];

export const GuardianId = {
  AURELIA: 'AURELIA',
  KAIRO: 'KAIRO',
  NYXARA: 'NYXARA',
  ELARA: 'ELARA',
  ORION: 'ORION',
  VESPER: 'VESPER',
} as const;

export type GuardianId = (typeof GuardianId)[keyof typeof GuardianId];

export const AetherlingSpecies = {
  FLICKER: 'FLICKER',
  CINDER: 'CINDER',
  PYRELING: 'PYRELING',
  TIDECURL: 'TIDECURL',
  BRINE: 'BRINE',
  RIPPLE: 'RIPPLE',
  SPROUT: 'SPROUT',
  BRAMBLE: 'BRAMBLE',
  MOSSKIN: 'MOSSKIN',
  GLOOM: 'GLOOM',
  DUSKWISP: 'DUSKWISP',
  NIGHTMOTH: 'NIGHTMOTH',
  LUMEN: 'LUMEN',
  HALO: 'HALO',
  GLIMMER: 'GLIMMER',
  HEXLING: 'HEXLING',
  PRISMITE: 'PRISMITE',
  ECHO: 'ECHO',
  FLAMEFOX: 'FLAMEFOX',
  AQUAMANTA: 'AQUAMANTA',
  MOSSLING: 'MOSSLING',
  STORMWING: 'STORMWING',
  SHADOWCUB: 'SHADOWCUB',
  CRYSTSERPENT: 'CRYSTSERPENT',
  MOONOWL: 'MOONOWL',
  SOLARHARE: 'SOLARHARE',
  FROSTLYNX: 'FROSTLYNX',
  VOIDPUP: 'VOIDPUP',
  EMBERBAT: 'EMBERBAT',
  THORNBACK: 'THORNBACK',
} as const;

export type AetherlingSpecies = (typeof AetherlingSpecies)[keyof typeof AetherlingSpecies];

export const AbilityId = {
  FIREBALL: 'FIREBALL',
  HEALING_PULSE: 'HEALING_PULSE',
  FROST_NOVA: 'FROST_NOVA',
  SHADOW_STRIKE: 'SHADOW_STRIKE',
  THUNDER_CHAIN: 'THUNDER_CHAIN',
  TREASURE_MAGNET: 'TREASURE_MAGNET',
  CRITICAL_FURY: 'CRITICAL_FURY',
  AETHER_SHIELD: 'AETHER_SHIELD',
  BURN_TICK: 'BURN_TICK',
  SPLASH: 'SPLASH',
  PIERCE: 'PIERCE',
  HOMING: 'HOMING',
  COIN_FIND: 'COIN_FIND',
  ENERGY_DRIP: 'ENERGY_DRIP',
  THORNS: 'THORNS',
  FREEZE_NOVA: 'FREEZE_NOVA',
  LIGHT_BEAM: 'LIGHT_BEAM',
  SHADOW_MARK: 'SHADOW_MARK',
  ARCANE_ECHO: 'ARCANE_ECHO',
  HASTE: 'HASTE',
} as const;

export type AbilityId = (typeof AbilityId)[keyof typeof AbilityId];

export const EggTier = {
  BASIC: 'BASIC',
  RARE: 'RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY',
  MYTHIC: 'MYTHIC',
} as const;

export type EggTier = (typeof EggTier)[keyof typeof EggTier];

export const UiScreen = {
  MENU: 'MENU',
  HOW_TO_PLAY: 'HOW_TO_PLAY',
  SETTINGS: 'SETTINGS',
  GUARDIANS: 'GUARDIANS',
  AETHERLINGS: 'AETHERLINGS',
  QUESTS: 'QUESTS',
  RAID: 'RAID',
  EGGS: 'EGGS',
  SHOP: 'SHOP',
  ACHIEVEMENTS: 'ACHIEVEMENTS',
  INVENTORY: 'INVENTORY',
  TRAINING: 'TRAINING',
  COLLECTION: 'COLLECTION',
  GAME: 'GAME',
  TUTORIAL: 'TUTORIAL',
} as const;

export type UiScreen = (typeof UiScreen)[keyof typeof UiScreen];

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  screenShakeEnabled: boolean;
  particlesEnabled: boolean;
  quality: 'LOW' | 'HIGH';
  difficulty: Difficulty;
  /** Which side the phone joystick sits on. Special sits on the other side. */
  touchHand: 'LEFT' | 'RIGHT';
  highScore: number;
}

export interface DifficultyMods {
  health: number;
  speed: number;
  spawn: number;
  projectileSpeed: number;
  boss: number;
}

export interface GameSnapshot {
  state: GameState;
  mode: RunMode;
  score: number;
  highScore: number;
  level: number;
  sectorName: string;
  skyTop: string;
  skyGlow: string;
  skyMid: string;
  skyGround: string;
  stageTitle: string;
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  weaponLevel: number;
  weaponName: string;
  combo: number;
  comboMultiplier: number;
  specialEnergy: number;
  specialReady: boolean;
  countdownLabel: string;
  bossName: string;
  bossHealth: number;
  bossMaxHealth: number;
  bossElement: string;
  bossWeak: string;
  showBossBar: boolean;
  isNewHighScore: boolean;
  finalScore: number;
  enemiesDestroyed: number;
  bossesDefeated: number;
  bestCombo: number;
  accuracy: number;
  levelScore: number;
  levelKills: number;
  levelBonus: number;
  magnetTime: number;
  rushTime: number;
  doubleShotTime: number;
  freezeTime: number;
  guardianName: string;
  runCoins: number;
  runCrystals: number;
  bankCoins: number;
  bankCrystals: number;
  trophies: number;
  bossEnergy: number;
  raidTimer: number;
  raidDamage: number;
  puzzleHint: string;
  clearRank: string;
  clearLine: string;
  nextLevel: number;
  nextSectorName: string;
  nextStageTitle: string;
  resupplyLine: string;
  warpIn: number;
}

export interface OwnedGuardian {
  id: GuardianId;
  unlocked: boolean;
  level: number;
  xp: number;
}

export interface OwnedAetherling {
  id: string;
  species: AetherlingSpecies;
  rarity: Rarity;
  level: number;
  xp: number;
  stars: 1 | 2 | 3 | 4;
  element: ElementId;
  history: string[];
}

export interface ActiveQuest {
  id: string;
  defId: string;
  endsAt: number;
  guardian: GuardianId;
  companions: string[];
}

export interface DailyMission {
  id: string;
  kind: string;
  label: string;
  need: number;
  have: number;
  reward: { coins?: number; crystals?: number; essence?: number; egg?: EggTier };
  done: boolean;
}

export interface RaidGhost {
  name: string;
  damage: number;
}

export interface SaveProfile {
  coins: number;
  crystals: number;
  trophies: number;
  bossEnergy: number;
  essence: number;
  shards: Record<ElementId, number>;
  totalKills: number;
  totalCoins: number;
  bossesKilled: number;
  evolutions: number;
  runsPlayed: number;
  questsDone: number;
  raidsDone: number;
}

export interface SaveGame {
  settings: GameSettings;
  profile: SaveProfile;
  guardians: Record<GuardianId, OwnedGuardian>;
  equippedGuardian: GuardianId;
  aetherlings: OwnedAetherling[];
  equipped: [string | null, string | null];
  discovered: AetherlingSpecies[];
  eggs: Record<EggTier, number>;
  quests: ActiveQuest[];
  daily: {
    lastLogin: string;
    streak: number;
    claimed: number;
    missions: DailyMission[];
    missionDay: string;
  };
  achievements: Record<string, boolean>;
  raidGhosts: RaidGhost[];
  tutorialDone: boolean;
  web3?: { lastAddress?: string };
}

export interface RunResult {
  mode: RunMode;
  score: number;
  coins: number;
  crystals: number;
  trophies: number;
  essence: number;
  shards: Partial<Record<ElementId, number>>;
  eggs: Partial<Record<EggTier, number>>;
  kills: number;
  bosses: number;
  bossDamage: number;
  usedAbility: boolean;
  survived: boolean;
}

export interface SpawnEvent {
  time: number;
  type: EnemyType;
  count: number;
}

export const StageBeatKind = {
  SWARM_RUSH: 'SWARM_RUSH',
  ASTEROID_STORM: 'ASTEROID_STORM',
  TAUNT: 'TAUNT',
  FINALE: 'FINALE',
  COIN_SHOWER: 'COIN_SHOWER',
  LOOT_DROP: 'LOOT_DROP',
} as const;

export type StageBeatKind = (typeof StageBeatKind)[keyof typeof StageBeatKind];

export interface StageBeat {
  time: number;
  kind: StageBeatKind;
  label: string;
}

export interface StageDef {
  id: number;
  sectorId: WorldId;
  sectorName: string;
  title: string;
  tint: readonly [number, number, number];
  asteroidInterval: number;
  minDuration: number;
  boss?: BossKind;
  spawns: readonly SpawnEvent[];
  beats?: readonly StageBeat[];
}

/** @deprecated use WorldId */
export const SectorId = WorldId;
export type SectorId = WorldId;

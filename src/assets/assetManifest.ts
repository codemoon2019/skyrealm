import {
  AetherlingSpecies,
  BossKind,
  EggTier,
  ElementId,
  EnemyType,
  GuardianId,
  PowerUpType,
  Rarity,
  WorldId,
} from '../types/game.ts';
import type {
  AetherlingSpecies as Sp,
  BossKind as BK,
  EggTier as Egg,
  ElementId as El,
  EnemyType as En,
  GuardianId as GID,
  PowerUpType as PU,
  Rarity as Rar,
  WorldId as W,
} from '../types/game.ts';

export type Pose = 'idle' | 'attack' | 'hit' | 'ability' | 'death' | 'portrait' | 'icon';

const ROOT = '/assets';

export function guardianPath(id: GID, pose: Pose): string {
  return `${ROOT}/guardians/${id.toLowerCase()}_${pose}.png`;
}

export function aetherPath(id: Sp, pose: Pose): string {
  return `${ROOT}/aetherlings/${id.toLowerCase()}_${pose}.png`;
}

export function enemyPath(id: En, pose: Pose = 'idle'): string {
  return `${ROOT}/enemies/${id.toLowerCase()}_${pose}.png`;
}

export function bossPath(id: BK, pose: Pose): string {
  return `${ROOT}/bosses/${id.toLowerCase()}_${pose}.png`;
}

export function envPath(id: W, layer: 'bg' | 'mid' | 'fg'): string {
  return `${ROOT}/environments/${id.toLowerCase()}_${layer}.png`;
}

export const uiAssets = {
  logo: `${ROOT}/ui/logo_skyrealm.png`,
  styleBible: `${ROOT}/ui/style_bible.png`,
  panel: `${ROOT}/ui/panel.png`,
  btn: `${ROOT}/ui/btn.png`,
  lock: `${ROOT}/icons/lock.png`,
  close: `${ROOT}/icons/close.png`,
  settings: `${ROOT}/icons/settings.png`,
  coin: `${ROOT}/icons/coin.png`,
  crystal: `${ROOT}/icons/crystal.png`,
  trophy: `${ROOT}/icons/trophy.png`,
  energy: `${ROOT}/icons/energy.png`,
  hudHp: `${ROOT}/icons/hud_hp.png`,
  hudShield: `${ROOT}/icons/hud_shield.png`,
  hudSpecial: `${ROOT}/icons/hud_special.png`,
  hudPause: `${ROOT}/icons/hud_pause.png`,
} as const;

export const elementAssets: Record<El, string> = {
  [ElementId.FIRE]: `${ROOT}/icons/el_fire.png`,
  [ElementId.WATER]: `${ROOT}/icons/el_water.png`,
  [ElementId.NATURE]: `${ROOT}/icons/el_nature.png`,
  [ElementId.SHADOW]: `${ROOT}/icons/el_shadow.png`,
  [ElementId.LIGHT]: `${ROOT}/icons/el_light.png`,
  [ElementId.ARCANE]: `${ROOT}/icons/el_arcane.png`,
};

export const rarityAssets: Record<Rar, string> = {
  [Rarity.COMMON]: `${ROOT}/ui/frame_common.png`,
  [Rarity.RARE]: `${ROOT}/ui/frame_rare.png`,
  [Rarity.EPIC]: `${ROOT}/ui/frame_epic.png`,
  [Rarity.LEGENDARY]: `${ROOT}/ui/frame_legendary.png`,
  [Rarity.MYTHIC]: `${ROOT}/ui/frame_mythic.png`,
};

export const eggAssets: Record<Egg, string> = {
  [EggTier.BASIC]: `${ROOT}/eggs/basic.png`,
  [EggTier.RARE]: `${ROOT}/eggs/rare.png`,
  [EggTier.EPIC]: `${ROOT}/eggs/epic.png`,
  [EggTier.LEGENDARY]: `${ROOT}/eggs/legendary.png`,
  [EggTier.MYTHIC]: `${ROOT}/eggs/mythic.png`,
};

export const powerUpAssets: Record<PU, string> = {
  [PowerUpType.CLOVER]: `${ROOT}/powerups/clover.png`,
  [PowerUpType.MAGNET]: `${ROOT}/powerups/magnet.png`,
  [PowerUpType.DOUBLE]: `${ROOT}/powerups/double.png`,
  [PowerUpType.RUSH]: `${ROOT}/powerups/rush.png`,
  [PowerUpType.HEART]: `${ROOT}/powerups/heart.png`,
  [PowerUpType.FREEZE]: `${ROOT}/powerups/freeze.png`,
  [PowerUpType.BLAST]: `${ROOT}/powerups/blast.png`,
};

export const particleAssets = {
  spark: `${ROOT}/particles/spark.png`,
  puff: `${ROOT}/particles/puff.png`,
} as const;

export const SKIP_SHEET_URLS = new Set<string>([
  aetherPath(AetherlingSpecies.CRYSTSERPENT, 'idle'),
  aetherPath(AetherlingSpecies.CRYSTSERPENT, 'portrait'),
]);

export function hangarChipUrls(): string[] {
  return [
    uiAssets.coin,
    uiAssets.crystal,
    uiAssets.trophy,
    uiAssets.energy,
    uiAssets.hudHp,
    uiAssets.hudShield,
    uiAssets.hudSpecial,
    uiAssets.hudPause,
    ...Object.values(powerUpAssets),
    ...Object.values(eggAssets),
  ];
}

export function criticalAssetUrls(): string[] {
  const urls = [
    uiAssets.logo,
    guardianPath(GuardianId.AURELIA, 'idle'),
    guardianPath(GuardianId.AURELIA, 'portrait'),
    aetherPath(AetherlingSpecies.FLICKER, 'idle'),
    aetherPath(AetherlingSpecies.FLICKER, 'portrait'),
    aetherPath(AetherlingSpecies.LUMEN, 'portrait'),
    envPath(WorldId.MEADOWS, 'bg'),
    envPath(WorldId.MEADOWS, 'mid'),
    envPath(WorldId.MEADOWS, 'fg'),
    ...hangarChipUrls(),
  ];
  for (const id of Object.values(GuardianId)) {
    urls.push(guardianPath(id, 'idle'), guardianPath(id, 'portrait'), guardianPath(id, 'icon'));
  }
  return [...new Set(urls)];
}

export function worldAssetUrls(id: W): string[] {
  return [envPath(id, 'bg'), envPath(id, 'mid'), envPath(id, 'fg')];
}

export function speciesAssetUrls(id: Sp): string[] {
  return [aetherPath(id, 'idle'), aetherPath(id, 'portrait'), aetherPath(id, 'attack'), aetherPath(id, 'icon')];
}

export function combatPackUrls(): string[] {
  const urls: string[] = [...Object.values(powerUpAssets)];
  for (const id of Object.values(EnemyType)) urls.push(enemyPath(id, 'idle'));
  for (const id of Object.values(BossKind)) {
    urls.push(bossPath(id, 'idle'), bossPath(id, 'attack'), bossPath(id, 'portrait'));
  }
  for (const id of Object.values(GuardianId)) {
    urls.push(guardianPath(id, 'idle'), guardianPath(id, 'hit'), guardianPath(id, 'ability'));
  }
  return [...new Set(urls)];
}

const GUARDIAN_POSES: Pose[] = ['idle', 'attack', 'hit', 'ability', 'death', 'portrait', 'icon'];
const AETHER_POSES: Pose[] = ['idle', 'attack', 'hit', 'ability', 'portrait', 'icon'];
const BOSS_POSES: Pose[] = ['idle', 'attack', 'hit', 'ability', 'death', 'portrait'];

/** Every image the hangar, menu, and a full run can ask for. */
export function allAssetUrls(): string[] {
  const urls: string[] = [
    ...Object.values(uiAssets),
    ...Object.values(elementAssets),
    ...Object.values(rarityAssets),
    ...Object.values(eggAssets),
    ...Object.values(powerUpAssets),
    ...Object.values(particleAssets),
  ];
  for (const id of Object.values(GuardianId)) {
    for (const pose of GUARDIAN_POSES) urls.push(guardianPath(id, pose));
  }
  for (const id of Object.values(AetherlingSpecies)) {
    for (const pose of AETHER_POSES) urls.push(aetherPath(id, pose));
  }
  for (const id of Object.values(EnemyType)) urls.push(enemyPath(id, 'idle'), enemyPath(id, 'attack'));
  for (const id of Object.values(BossKind)) {
    for (const pose of BOSS_POSES) urls.push(bossPath(id, pose));
  }
  for (const id of Object.values(WorldId)) urls.push(...worldAssetUrls(id));
  return [...new Set(urls)];
}

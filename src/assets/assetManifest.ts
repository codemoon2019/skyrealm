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
const EXT = 'webp';

export function guardianPath(id: GID, pose: Pose): string {
  return `${ROOT}/guardians/${id.toLowerCase()}_${pose}.${EXT}`;
}

export function aetherPath(id: Sp, pose: Pose): string {
  return `${ROOT}/aetherlings/${id.toLowerCase()}_${pose}.${EXT}`;
}

export function enemyPath(id: En, pose: Pose = 'idle'): string {
  return `${ROOT}/enemies/${id.toLowerCase()}_${pose}.${EXT}`;
}

export function bossPath(id: BK, pose: Pose): string {
  return `${ROOT}/bosses/${id.toLowerCase()}_${pose}.${EXT}`;
}

export function envPath(id: W, layer: 'bg' | 'mid' | 'fg'): string {
  return `${ROOT}/environments/${id.toLowerCase()}_${layer}.${EXT}`;
}

export const uiAssets = {
  logo: `${ROOT}/ui/logo_skyrealm.${EXT}`,
  styleBible: `${ROOT}/ui/style_bible.${EXT}`,
  panel: `${ROOT}/ui/panel.${EXT}`,
  btn: `${ROOT}/ui/btn.${EXT}`,
  lock: `${ROOT}/icons/lock.${EXT}`,
  close: `${ROOT}/icons/close.${EXT}`,
  settings: `${ROOT}/icons/settings.${EXT}`,
  coin: `${ROOT}/icons/coin.${EXT}`,
  crystal: `${ROOT}/icons/crystal.${EXT}`,
  trophy: `${ROOT}/icons/trophy.${EXT}`,
  energy: `${ROOT}/icons/energy.${EXT}`,
  hudHp: `${ROOT}/icons/hud_hp.${EXT}`,
  hudShield: `${ROOT}/icons/hud_shield.${EXT}`,
  hudSpecial: `${ROOT}/icons/hud_special.${EXT}`,
  hudPause: `${ROOT}/icons/hud_pause.${EXT}`,
} as const;

export const elementAssets: Record<El, string> = {
  [ElementId.FIRE]: `${ROOT}/icons/el_fire.${EXT}`,
  [ElementId.WATER]: `${ROOT}/icons/el_water.${EXT}`,
  [ElementId.NATURE]: `${ROOT}/icons/el_nature.${EXT}`,
  [ElementId.SHADOW]: `${ROOT}/icons/el_shadow.${EXT}`,
  [ElementId.LIGHT]: `${ROOT}/icons/el_light.${EXT}`,
  [ElementId.ARCANE]: `${ROOT}/icons/el_arcane.${EXT}`,
};

export const rarityAssets: Record<Rar, string> = {
  [Rarity.COMMON]: `${ROOT}/ui/frame_common.${EXT}`,
  [Rarity.RARE]: `${ROOT}/ui/frame_rare.${EXT}`,
  [Rarity.EPIC]: `${ROOT}/ui/frame_epic.${EXT}`,
  [Rarity.LEGENDARY]: `${ROOT}/ui/frame_legendary.${EXT}`,
  [Rarity.MYTHIC]: `${ROOT}/ui/frame_mythic.${EXT}`,
};

export const eggAssets: Record<Egg, string> = {
  [EggTier.BASIC]: `${ROOT}/eggs/basic.${EXT}`,
  [EggTier.RARE]: `${ROOT}/eggs/rare.${EXT}`,
  [EggTier.EPIC]: `${ROOT}/eggs/epic.${EXT}`,
  [EggTier.LEGENDARY]: `${ROOT}/eggs/legendary.${EXT}`,
  [EggTier.MYTHIC]: `${ROOT}/eggs/mythic.${EXT}`,
};

export const powerUpAssets: Record<PU, string> = {
  [PowerUpType.CLOVER]: `${ROOT}/powerups/clover.${EXT}`,
  [PowerUpType.MAGNET]: `${ROOT}/powerups/magnet.${EXT}`,
  [PowerUpType.DOUBLE]: `${ROOT}/powerups/double.${EXT}`,
  [PowerUpType.RUSH]: `${ROOT}/powerups/rush.${EXT}`,
  [PowerUpType.HEART]: `${ROOT}/powerups/heart.${EXT}`,
  [PowerUpType.FREEZE]: `${ROOT}/powerups/freeze.${EXT}`,
  [PowerUpType.BLAST]: `${ROOT}/powerups/blast.${EXT}`,
};

export const particleAssets = {
  spark: `${ROOT}/particles/spark.${EXT}`,
  puff: `${ROOT}/particles/puff.${EXT}`,
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

/** Art needed to open the hangar. Combat skies and the rest of the dex load later. */
export function hangarBootUrls(): string[] {
  const urls = [...hangarChipUrls()];
  for (const id of Object.values(GuardianId)) {
    urls.push(guardianPath(id, 'idle'), guardianPath(id, 'portrait'), guardianPath(id, 'icon'));
  }
  urls.push(
    aetherPath(AetherlingSpecies.FLICKER, 'idle'),
    aetherPath(AetherlingSpecies.FLICKER, 'portrait'),
    aetherPath(AetherlingSpecies.LUMEN, 'portrait'),
    aetherPath(AetherlingSpecies.TIDECURL, 'idle'),
  );
  return [...new Set(urls)];
}

export function criticalAssetUrls(): string[] {
  return hangarBootUrls();
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

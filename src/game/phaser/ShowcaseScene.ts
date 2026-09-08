import Phaser from 'phaser';
import { AetherlingSpecies, GuardianId } from '../../types/game.ts';
import { assets } from '../../assets/AssetLoader.ts';
import { aetherPath, guardianPath } from '../../assets/assetManifest.ts';
import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from '../constants.ts';
import { FlyingCompanionEntity } from './FlyingCompanionEntity.ts';
import { TextureBank } from './TextureBank.ts';

const HERO = GuardianId.AURELIA;
const COMPANION = AetherlingSpecies.FLAMEFOX;
const TWILIGHT = '#2a1838';

/**
 * Standalone showcase for {@link FlyingCompanionEntity}, kept apart from the
 * running game: it never touches GameEngine, and React reads nothing from it.
 * Mount it with {@link createShowcaseGame} when you want to look at the entity.
 */
export class ShowcaseScene extends Phaser.Scene {
  private bank!: TextureBank;
  private flyer!: FlyingCompanionEntity;

  constructor() {
    super({ key: 'ShowcaseScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(TWILIGHT);
    // TextureBank only adopts art the AssetLoader already holds; it never
    // fetches. Without this the showcase would sit on the baked canvas
    // fallbacks unless some other screen happened to have pulled the same PNGs.
    void assets.load([guardianPath(HERO, 'idle'), aetherPath(COMPANION, 'idle')]);
    this.bank = new TextureBank(this.textures);
    this.bank.boot();
    this.bank.warm(HERO, [COMPANION]);

    this.flyer = new FlyingCompanionEntity(this, LOGICAL_WIDTH * 0.5, LOGICAL_HEIGHT * 0.55, {
      heroKey: this.bank.guardian(HERO, 'idle'),
      companionKey: this.bank.aether(COMPANION),
      companionOffset: { x: -104, y: 40 },
      heroSize: 168,
      companionScale: 0.5,
      bob: { distance: 11, duration: 1500 },
      // Point this at a flap sheet and the squash stand-in steps aside:
      // flap: { key: 'aurelia-flap', end: -1, frameRate: 14 },
      sparkle: { max: 18, radius: 74, tint: 0xffe08a },
    });
    // A Container does not add itself to the scene.
    this.add.existing(this.flyer);
  }

  update(): void {
    // Art loads asynchronously, and TextureBank hands back a baked canvas key
    // until the PNG lands. Re-offering the current keys every frame is what
    // SpriteSync does too; setSkins() itself ignores anything unchanged.
    this.bank.tick();
    this.flyer.setSkins(this.bank.guardian(HERO, 'idle'), this.bank.aether(COMPANION));
  }
}

/**
 * Boots the showcase on its own canvas. Mirrors createPhaserGame, minus the
 * engine and bridge registry entries the gameplay scene needs.
 */
export function createShowcaseGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: LOGICAL_WIDTH,
    height: LOGICAL_HEIGHT,
    backgroundColor: TWILIGHT,
    banner: false,
    audio: { noAudio: true },
    input: { keyboard: false, mouse: false, touch: false },
    disableContextMenu: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      antialias: true,
      powerPreference: 'high-performance',
    },
    scene: [ShowcaseScene],
  });
}

export function destroyShowcaseGame(game: Phaser.Game | null): void {
  if (!game) return;
  game.destroy(true);
}

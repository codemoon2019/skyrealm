import Phaser from 'phaser';
import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from '../constants.ts';
import type { GameEngine } from '../GameEngine.ts';
import type { GameBridge } from './GameBridge.ts';
import { MainScene } from './MainScene.ts';

const SKY_CLEAR = '#fff3d6';

export function createPhaserGame(parent: HTMLElement, engine: GameEngine, bridge: GameBridge): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: LOGICAL_WIDTH,
    height: LOGICAL_HEIGHT,
    backgroundColor: SKY_CLEAR,
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
      transparent: false,
      powerPreference: 'high-performance',
    },
    fps: { target: 60, min: 30, smoothStep: true },
    callbacks: {
      preBoot: (game) => {
        game.registry.set('engine', engine);
        game.registry.set('bridge', bridge);
      },
    },
    scene: [MainScene],
  });
}

export function destroyPhaserGame(game: Phaser.Game | null): void {
  if (!game) return;
  game.destroy(true);
}

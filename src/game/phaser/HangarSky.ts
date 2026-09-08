import Phaser from 'phaser';
import { GameState } from '../../types/game.ts';
import type { GameEngine } from '../GameEngine.ts';
import type { TextureBank } from './TextureBank.ts';

const DEPTH = 6;

const ISLES = [
  { x: 86, y: 708, size: 96, phase: 0.2 },
  { x: 458, y: 764, size: 82, phase: 1.1 },
  { x: 168, y: 848, size: 74, phase: 2.0 },
] as const;

const CLOUDS = [
  { x: 110, y: 168, size: 124, phase: 0.4, span: 34 },
  { x: 410, y: 228, size: 110, phase: 1.6, span: 26 },
  { x: 74, y: 318, size: 98, phase: 2.4, span: 22 },
] as const;

const BIRDS = [
  { x: 150, y: 392, size: 44, phase: 0.3, span: 150 },
  { x: 390, y: 512, size: 38, phase: 1.8, span: 132 },
] as const;

const LANTERNS = [
  { x: 64, y: 540, size: 22, phase: 0.1 },
  { x: 478, y: 470, size: 20, phase: 1.4 },
  { x: 500, y: 660, size: 18, phase: 2.2 },
] as const;

export class HangarSky {
  private readonly engine: GameEngine;
  private readonly bank: TextureBank;
  private readonly isles: Phaser.GameObjects.Image[];
  private readonly clouds: Phaser.GameObjects.Image[];
  private readonly birds: Phaser.GameObjects.Image[];
  private readonly lanterns: Phaser.GameObjects.Image[];
  private readonly still: boolean;

  constructor(scene: Phaser.Scene, engine: GameEngine, bank: TextureBank) {
    this.engine = engine;
    this.bank = bank;
    this.still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isles = ISLES.map(() => make(scene));
    this.clouds = CLOUDS.map(() => make(scene));
    this.birds = BIRDS.map(() => make(scene));
    this.lanterns = LANTERNS.map(() => make(scene));
  }

  sync(): void {
    if (this.engine.state !== GameState.MENU) {
      hideAll(this.isles, this.clouds, this.birds, this.lanterns);
      return;
    }
    const age = this.engine.starfield.time;
    const motion = this.still ? 0 : 1;
    for (let i = 0; i < ISLES.length; i++) {
      const spec = ISLES[i]!;
      const bob = Math.sin(age * 0.7 + spec.phase) * 7 * motion;
      const drift = Math.cos(age * 0.28 + spec.phase) * 6 * motion;
      place(this.isles[i]!, this.bank, this.bank.hangar('isle'), spec.x + drift, spec.y + bob, spec.size);
    }
    for (let i = 0; i < CLOUDS.length; i++) {
      const spec = CLOUDS[i]!;
      const drift = Math.sin(age * 0.22 + spec.phase) * spec.span * motion;
      const breathe = 1 + Math.sin(age * 0.9 + spec.phase) * 0.06 * motion;
      place(this.clouds[i]!, this.bank, this.bank.hangar('cloud'), spec.x + drift, spec.y, spec.size, breathe, 0.92);
    }
    for (let i = 0; i < BIRDS.length; i++) {
      const spec = BIRDS[i]!;
      const glide = Math.sin(age * 0.35 + spec.phase) * spec.span * motion;
      const dip = Math.sin(age * 1.1 + spec.phase) * 16 * motion;
      const flap = 1 + Math.sin(age * 8 + spec.phase) * 0.12 * motion;
      place(this.birds[i]!, this.bank, this.bank.hangar('bird'), spec.x + glide, spec.y + dip, spec.size, 1, flap);
    }
    const glow = this.engine.settings.particlesEnabled;
    for (let i = 0; i < LANTERNS.length; i++) {
      const spec = LANTERNS[i]!;
      const img = this.lanterns[i]!;
      if (!glow) {
        img.setVisible(false);
        continue;
      }
      const bob = Math.sin(age * 1.6 + spec.phase) * 8 * motion;
      const pulse = 0.72 + Math.sin(age * 3.2 + spec.phase) * 0.28;
      place(img, this.bank, this.bank.hangar('lantern'), spec.x, spec.y + bob, spec.size, pulse, pulse);
    }
  }
}

function make(scene: Phaser.Scene): Phaser.GameObjects.Image {
  return scene.add.image(0, 0, 'dot').setDepth(DEPTH).setVisible(false);
}

function hideAll(...groups: Phaser.GameObjects.Image[][]): void {
  for (const group of groups) {
    for (const img of group) img.setVisible(false);
  }
}

function place(
  img: Phaser.GameObjects.Image,
  bank: TextureBank,
  key: string,
  x: number,
  y: number,
  size: number,
  sx = 1,
  sy = 1,
): void {
  img.setVisible(true);
  if (img.texture.key !== key) img.setTexture(key);
  img.setPosition(x, y);
  const frame = bank.frame(key, size);
  img.setDisplaySize(frame * sx, frame * sy);
  img.setAlpha(1);
}

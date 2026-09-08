import Phaser from 'phaser';
import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from '../constants.ts';
import type { SkyPalette } from '../content/skies.ts';
import type { GameEngine } from '../GameEngine.ts';
import type { StarFloater } from '../Starfield.ts';
import type { TextureBank } from './TextureBank.ts';

const DEPTH = { sky: 0, plate: 1, png: 1, disk: 2, curtain: 3, weather: 4, veil: 8 };

export class SkyLayer {
  private readonly engine: GameEngine;
  private readonly bank: TextureBank;
  private readonly sky: Phaser.GameObjects.Graphics;
  private readonly disk: Phaser.GameObjects.Graphics;
  private readonly sceneGfx: Phaser.GameObjects.Graphics;
  private readonly veil: Phaser.GameObjects.Graphics;
  private lastGrad = '';
  private readonly plateA: Phaser.GameObjects.Image;
  private readonly plateB: Phaser.GameObjects.Image;
  private readonly midA: Phaser.GameObjects.Image;
  private readonly midB: Phaser.GameObjects.Image;
  private readonly fgA: Phaser.GameObjects.Image;
  private readonly fgB: Phaser.GameObjects.Image;
  private readonly curtainL: Phaser.GameObjects.Image;
  private readonly curtainR: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, engine: GameEngine, bank: TextureBank) {
    this.engine = engine;
    this.bank = bank;
    this.sky = scene.add.graphics().setDepth(DEPTH.sky);
    this.plateA = makeLayer(scene, DEPTH.plate);
    this.plateB = makeLayer(scene, DEPTH.plate);
    this.disk = scene.add.graphics().setDepth(DEPTH.disk);
    this.midA = makeLayer(scene, DEPTH.png);
    this.midB = makeLayer(scene, DEPTH.png);
    this.fgA = makeLayer(scene, DEPTH.png);
    this.fgB = makeLayer(scene, DEPTH.png);
    this.curtainL = makeLayer(scene, DEPTH.curtain);
    this.curtainR = makeLayer(scene, DEPTH.curtain);
    this.sceneGfx = scene.add.graphics().setDepth(DEPTH.weather);
    this.veil = scene.add.graphics().setDepth(DEPTH.veil);
    this.paintVeil();
  }

  sync(): void {
    const field = this.engine.starfield;
    const pal = field.palette();
    this.paintGradient(pal, field.fading);
    this.sky.scene.cameras.main.setBackgroundColor(pal.top);
    this.placePlates(field.worldId, field.scroll);
    this.paintDisk(pal);
    this.placePair(this.midA, this.midB, field.worldId, 'mid', 0.2, field.scroll * 0.62);
    this.placePair(this.fgA, this.fgB, field.worldId, 'fg', 0.14, field.scroll * 0.38);
    this.placeCurtains(field.worldId);
    this.paintWeather(pal);
  }

  private paintGradient(pal: SkyPalette, fading: boolean): void {
    const key = `${pal.top}:${pal.glow}:${pal.mid}:${pal.ground}`;
    if (!fading && key === this.lastGrad) return;
    this.lastGrad = key;
    const g = this.sky;
    g.clear();
    const h = LOGICAL_HEIGHT;
    const w = LOGICAL_WIDTH;
    g.fillGradientStyle(pal.top, pal.top, pal.glow, pal.glow, 1);
    g.fillRect(0, 0, w, h * 0.26);
    g.fillGradientStyle(pal.glow, pal.glow, pal.mid, pal.mid, 1);
    g.fillRect(0, h * 0.2, w, h * 0.34);
    g.fillGradientStyle(pal.mid, pal.mid, pal.mid, pal.mid, 1);
    g.fillRect(0, h * 0.48, w, h * 0.28);
    g.fillGradientStyle(pal.mid, pal.mid, pal.glow, pal.glow, 1);
    g.fillRect(0, h * 0.7, w, h * 0.3);
  }

  private paintDisk(pal: SkyPalette): void {
    const g = this.disk;
    g.clear();
    const sun = this.engine.starfield.celestial();
    g.fillStyle(sun.halo, 0.2);
    g.fillCircle(sun.x, sun.y, sun.r * 4.1);
    g.fillStyle(sun.halo, 0.3);
    g.fillCircle(sun.x, sun.y, sun.r * 2.4);
    g.fillStyle(sun.color, 0.96);
    g.fillCircle(sun.x, sun.y, sun.r);
    if (sun.moon) {
      g.fillStyle(pal.top, 0.55);
      g.fillCircle(sun.x + sun.r * 0.32, sun.y - sun.r * 0.18, sun.r * 0.72);
    }
  }

  private placePlates(world: string, scroll: number): void {
    const key = this.bank.plate(world);
    const shift = wrapShift(scroll);
    showCover(this.plateA, key, 0, shift - LOGICAL_HEIGHT, 1);
    showCover(this.plateB, key, 0, shift, 1);
  }

  private placeCurtains(world: string): void {
    const key = this.bank.curtain(world);
    const w = 120;
    this.curtainL.setTexture(key);
    this.curtainL.setVisible(true);
    this.curtainL.setAlpha(0.25);
    this.curtainL.setFlipX(false);
    this.curtainL.setOrigin(0, 0);
    this.curtainL.setPosition(0, 0);
    this.curtainL.setDisplaySize(w, LOGICAL_HEIGHT);
    this.curtainR.setTexture(key);
    this.curtainR.setVisible(true);
    this.curtainR.setAlpha(0.25);
    this.curtainR.setFlipX(true);
    this.curtainR.setOrigin(1, 0);
    this.curtainR.setPosition(LOGICAL_WIDTH, 0);
    this.curtainR.setDisplaySize(w, LOGICAL_HEIGHT);
  }

  private paintWeather(pal: SkyPalette): void {
    const g = this.sceneGfx;
    g.clear();
    const layers = this.engine.starfield.floaters();
    for (const f of layers.far) this.mote(g, f, pal);
    for (const f of layers.mid) {
      if (f.kind === 'petal') this.petal(g, f, pal);
      else this.mote(g, f, pal);
    }
    for (const f of layers.near) {
      if (f.kind === 'petal') this.petal(g, f, pal);
      else if (f.kind === 'shard') this.shard(g, f, pal);
      else this.mote(g, f, pal);
    }
  }

  private paintVeil(): void {
    const g = this.veil;
    g.clear();
    const w = LOGICAL_WIDTH;
    const h = LOGICAL_HEIGHT;
    g.fillStyle(0x2a1838, 0.05);
    g.fillRect(0, 0, w, 36);
    g.fillRect(0, h - 48, w, 48);
  }

  private placePair(
    a: Phaser.GameObjects.Image,
    b: Phaser.GameObjects.Image,
    world: string,
    layer: 'bg' | 'mid' | 'fg',
    alpha: number,
    scroll: number,
  ): void {
    const key = this.bank.env(world, layer);
    if (!key) {
      a.setVisible(false);
      b.setVisible(false);
      return;
    }
    const shift = wrapShift(scroll);
    showCover(a, key, 0, shift - LOGICAL_HEIGHT, alpha);
    showCover(b, key, 0, shift, alpha);
  }

  private mote(g: Phaser.GameObjects.Graphics, f: StarFloater, pal: SkyPalette): void {
    g.fillStyle(pal.weather, f.alpha);
    g.fillCircle(f.x, f.y, Math.max(3.2, f.w * 0.28));
  }

  private petal(g: Phaser.GameObjects.Graphics, f: StarFloater, pal: SkyPalette): void {
    g.fillStyle(pal.weather, f.alpha);
    g.save();
    g.translateCanvas(f.x, f.y);
    g.rotateCanvas(f.x * 0.012 + f.y * 0.004);
    g.fillEllipse(0, 0, f.w * 0.95, f.h * 1.65);
    g.restore();
  }

  private shard(g: Phaser.GameObjects.Graphics, f: StarFloater, pal: SkyPalette): void {
    g.fillStyle(pal.weather, f.alpha);
    g.fillTriangle(f.x, f.y - f.h, f.x + f.w * 0.4, f.y, f.x, f.y + f.h * 0.4);
    g.fillTriangle(f.x, f.y - f.h, f.x, f.y + f.h * 0.4, f.x - f.w * 0.4, f.y);
  }
}

function wrapShift(scroll: number): number {
  const span = LOGICAL_HEIGHT;
  return Math.round(((scroll % span) + span) % span);
}

function makeLayer(scene: Phaser.Scene, depth: number): Phaser.GameObjects.Image {
  return scene.add.image(0, 0, 'dot').setOrigin(0, 0).setDepth(depth).setVisible(false);
}

function showCover(img: Phaser.GameObjects.Image, key: string, x: number, y: number, alpha: number): void {
  img.setTexture(key);
  img.setVisible(true);
  img.setAlpha(alpha);
  img.setPosition(x, y);
  img.setDisplaySize(LOGICAL_WIDTH, LOGICAL_HEIGHT);
}

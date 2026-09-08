import Phaser from 'phaser';
import type { GameEngine } from '../GameEngine.ts';
import type { GameBridge } from './GameBridge.ts';
import { DevOverlay } from './DevOverlay.ts';
import { HangarSky } from './HangarSky.ts';
import { SkyLayer } from './SkyLayer.ts';
import { SpriteSync } from './SpriteSync.ts';
import { TextureBank } from './TextureBank.ts';

export class MainScene extends Phaser.Scene {
  private engine!: GameEngine;
  private bridge!: GameBridge;
  private bank!: TextureBank;
  private sky!: SkyLayer;
  private hangar!: HangarSky;
  private sprites!: SpriteSync;
  private dev!: DevOverlay;
  private hidden = false;
  private warmSig = '';

  constructor() {
    super({ key: 'MainScene' });
  }

  create(): void {
    this.engine = this.registry.get('engine') as GameEngine;
    this.bridge = this.registry.get('bridge') as GameBridge;
    this.cameras.main.setBackgroundColor('#fff3d6');
    this.cameras.main.roundPixels = true;
    this.bank = new TextureBank(this.textures);
    this.bank.boot();
    this.bank.warm(
      this.engine.session.data.equippedGuardian,
      this.engine.session.equippedUnits().flatMap((u) => (u ? [u.species] : [])),
    );
    this.sky = new SkyLayer(this, this.engine, this.bank);
    this.hangar = new HangarSky(this, this.engine, this.bank);
    this.sprites = new SpriteSync(this, this.engine, this.bank);
    this.dev = new DevOverlay(this, this.engine);
    this.scale.refresh();
    document.addEventListener('visibilitychange', this.onVisibility);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      document.removeEventListener('visibilitychange', this.onVisibility);
    });
  }

  update(_time: number, delta: number): void {
    const dt = Math.min(0.033, delta / 1000);
    this.engine.update(dt);
    this.bridge.sync();
    this.bank.tick();
    this.warmLoadout();
    this.sky.sync();
    this.hangar.sync();
    this.sprites.sync();
    this.applyShake();
    this.dev.sync(dt, this.game.loop.actualFps);
  }

  private warmLoadout(): void {
    const units = this.engine.session.equippedUnits();
    const sig = `${this.engine.session.data.equippedGuardian}:${units.map((u) => u?.species ?? '').join(',')}`;
    if (sig === this.warmSig) return;
    this.warmSig = sig;
    this.bank.warm(
      this.engine.session.data.equippedGuardian,
      units.flatMap((u) => (u ? [u.species] : [])),
    );
  }

  private applyShake(): void {
    const off = this.engine.shake.offset();
    this.cameras.main.setScroll(off.x, off.y);
  }

  private onVisibility = (): void => {
    const hide = document.hidden;
    if (hide && !this.hidden) {
      this.hidden = true;
      if (!this.engine.ignorePause) {
        this.engine.pause();
        this.bridge.sync();
      }
      this.game.loop.sleep();
      return;
    }
    if (!hide && this.hidden) {
      this.hidden = false;
      this.game.loop.wake();
    }
  };
}

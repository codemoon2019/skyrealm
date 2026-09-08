import Phaser from 'phaser';
import type { GameEngine } from '../GameEngine.ts';

export class DevOverlay {
  private readonly engine: GameEngine;
  private readonly label: Phaser.GameObjects.Text;
  private readonly open: boolean;
  private readonly stress: boolean;
  private stressCd = 0;

  constructor(scene: Phaser.Scene, engine: GameEngine) {
    this.engine = engine;
    const query = new URLSearchParams(window.location.search);
    this.stress = import.meta.env.DEV && query.has('stress');
    this.open = import.meta.env.DEV && (this.stress || query.has('debug'));
    this.label = scene.add
      .text(8, 8, '', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#ffe08a',
        backgroundColor: 'rgba(18, 8, 24, 0.55)',
        padding: { x: 6, y: 4 },
      })
      .setDepth(1000)
      .setScrollFactor(0)
      .setVisible(this.open);
  }

  sync(dt: number, fps: number): void {
    if (!this.open) return;
    if (this.stress) {
      this.stressCd -= dt;
      if (this.stressCd <= 0) {
        this.stressCd = 0.12;
        this.engine.particles.burstStars(Math.random() * 540, Math.random() * 960, 18, [255, 230, 180]);
      }
    }
    const e = this.engine;
    const line = [
      `${Math.round(fps)} FPS`,
      `en ${e.enemies.length}`,
      `bl ${e.bullets.length}`,
      `sh ${e.enemyShots.length}`,
      `pt ${e.particles.items.length}`,
      this.stress ? 'STRESS' : '',
    ]
      .filter(Boolean)
      .join(' · ');
    this.label.setText(line);
  }
}

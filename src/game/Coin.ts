import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from './constants.ts';
import type { Player } from './Player.ts';
import { drawGoldCoin } from './fantasyDraw.ts';
import type { CoinFace } from './fantasyDraw.ts';

export type CoinTier = CoinFace;

/** Pull on a loose coin before the magnet takes over, so it arcs out of a kill. */
const GRAVITY = 260;

export class Coin {
  x = 0;
  y = 0;
  vx = 0;
  vy = 70;
  age = 0;
  value = 10;
  radius = 7;
  tier: CoinTier = 'plain';
  spinPhase = 0;
  spinRate = 6.5;

  spawn(x: number, y: number, value = 10, tier: CoinTier = 'plain'): void {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 80;
    this.vy = -70 - Math.random() * 40;
    this.age = 0;
    this.value = value;
    this.radius = value >= 40 ? 9 : value >= 20 ? 8 : 7;
    this.tier = tier;
    this.spinPhase = Math.random() * Math.PI * 2;
    this.spinRate = 5.5 + Math.random() * 2;
  }

  update(dt: number, player: Player): boolean {
    this.age += dt;
    this.vy += GRAVITY * dt;
    if (this.age > player.magnetDelay() && player.alive) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const dist = Math.hypot(dx, dy) || 1;
      const pull = player.magnetPull() + this.age * 120;
      this.vx += (dx / dist) * pull * dt;
      this.vy += (dy / dist) * pull * dt;
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vx *= 0.96;
    return this.age < 8 && this.x > -30 && this.x < LOGICAL_WIDTH + 30 && this.y < LOGICAL_HEIGHT + 40;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const flip = Math.abs(Math.cos(this.spinPhase + this.age * this.spinRate));
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(Math.max(0.14, flip), 1 + Math.sin(this.age * 9) * 0.05);
    drawGoldCoin(ctx, this.radius, this.tier);
    ctx.restore();
  }
}

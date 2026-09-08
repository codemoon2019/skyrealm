import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from './constants.ts';
import { PowerUpType } from '../types/game.ts';
import type { PowerUpType as PowerUpTypeT } from '../types/game.ts';
import type { Player } from './Player.ts';
import { pickupStyle } from './content/pickups.ts';
import { drawPickupToken } from './fantasyDraw.ts';
import { drawPickupSprite } from '../assets/drawEntity.ts';

/** Seconds of `life` left where the token starts blinking out. */
export const PICKUP_FADE = 3;

export class PowerUp {
  type: PowerUpTypeT = PowerUpType.CLOVER;
  x = 0;
  y = 0;
  vx = 0;
  vy = 48;
  life = 12;
  radius = 12;
  rot = 0;
  age = 0;

  spawn(type: PowerUpTypeT, x: number, y: number): void {
    this.type = type;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 48;
    this.life = 12;
    this.rot = 0;
    this.age = 0;
  }

  update(dt: number, player?: Player): boolean {
    this.age += dt;
    this.life -= dt;
    if (player?.alive && (player.magnetTime > 0 || player.bloomMagnet)) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const dist = Math.hypot(dx, dy) || 1;
      const pull = player.magnetPull() * 0.55;
      this.vx += (dx / dist) * pull * dt;
      this.vy += (dy / dist) * pull * dt;
    }
    this.x += this.vx * dt + Math.sin(this.age * 4) * 18 * dt;
    this.y += this.vy * dt;
    this.rot += dt * 2.6;
    return this.life > 0 && this.x > -20 && this.y > -20 && this.y < LOGICAL_HEIGHT + 20 && this.x < LOGICAL_WIDTH + 20;
  }

  /** Blinks toward transparent once the token is about to time out. */
  fade(): number {
    if (this.life >= PICKUP_FADE) return 1;
    return 0.4 + 0.6 * Math.abs(Math.sin(this.life * 9));
  }

  /** Breathing scale that makes the token pulse in place. */
  pulse(): number {
    return 1 + Math.sin(this.age * 5.5) * 0.09;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = this.fade();
    ctx.translate(this.x, this.y);
    ctx.save();
    ctx.scale(this.pulse(), this.pulse());
    ctx.rotate(-this.age * 0.8);
    drawPickupToken(ctx, 18, pickupStyle(this.type));
    ctx.restore();
    const bounce = 1 + Math.sin(this.age * 8) * 0.08;
    ctx.scale(bounce, bounce);
    ctx.rotate(this.rot * 0.15);
    drawPickupSprite(ctx, this.type);
    ctx.restore();
  }
}

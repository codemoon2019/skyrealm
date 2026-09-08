import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from './constants.ts';
import { clamp } from '../utils/random.ts';

export class PuzzleGate {
  x = LOGICAL_WIDTH + 40;
  gapY = 220;
  gapH = 130;
  vx = -130;
  wobble = 0;
  age = 0;
  hurtCd = 0;

  spawn(speed: number, gapH = 118): void {
    this.x = LOGICAL_WIDTH + 50;
    this.gapY = 140 + Math.random() * 220;
    this.gapH = gapH;
    this.vx = -speed;
    this.wobble = 40 + Math.random() * 30;
    this.age = 0;
    this.hurtCd = 0;
  }

  update(dt: number): boolean {
    this.age += dt;
    this.hurtCd = Math.max(0, this.hurtCd - dt);
    this.x += this.vx * dt;
    this.gapY = clamp(this.gapY + Math.sin(this.age * 1.6) * this.wobble * dt, 90, LOGICAL_HEIGHT - 90);
    return this.x > -40;
  }

  hitsPlayer(px: number, py: number, pr: number): boolean {
    if (this.hurtCd > 0) return false;
    if (px < this.x - 10 || px > this.x + 10) return false;
    const top = this.gapY - this.gapH * 0.5;
    const bot = this.gapY + this.gapH * 0.5;
    if (py - pr < top || py + pr > bot) {
      this.hurtCd = 0.95;
      return true;
    }
    return false;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const top = this.gapY - this.gapH * 0.5;
    const bot = this.gapY + this.gapH * 0.5;
    ctx.save();
    ctx.shadowColor = '#ff3d8a';
    ctx.shadowBlur = 18;
    ctx.fillStyle = 'rgba(255, 40, 140, 0.42)';
    ctx.fillRect(this.x - 7, 0, 14, top);
    ctx.fillRect(this.x - 7, bot, 14, LOGICAL_HEIGHT - bot);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffe08a';
    ctx.lineWidth = 2.4;
    ctx.strokeRect(this.x - 8, 0, 16, top);
    ctx.strokeRect(this.x - 8, bot, 16, LOGICAL_HEIGHT - bot);
    ctx.strokeStyle = '#6ef0ff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(this.x - 6, 0);
    ctx.lineTo(this.x - 6, top);
    ctx.moveTo(this.x + 6, 0);
    ctx.lineTo(this.x + 6, top);
    ctx.moveTo(this.x - 6, bot);
    ctx.lineTo(this.x - 6, LOGICAL_HEIGHT);
    ctx.moveTo(this.x + 6, bot);
    ctx.lineTo(this.x + 6, LOGICAL_HEIGHT);
    ctx.stroke();
    ctx.shadowColor = '#7dff6b';
    ctx.shadowBlur = 14;
    ctx.strokeStyle = '#7dff6b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 6]);
    ctx.strokeRect(this.x - 15, top, 30, this.gapH);
    ctx.restore();
  }
}

import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from './constants.ts';

export interface FloatTextItem {
  x: number;
  y: number;
  vy: number;
  life: number;
  maxLife: number;
  text: string;
  color: string;
  size: number;
  bubble: boolean;
}

export class FloatText {
  private readonly items: FloatTextItem[] = [];
  private readonly free: FloatTextItem[] = [];

  spawn(x: number, y: number, text: string, color = '#ffe08a', size = 18, bubble = false): void {
    const item = this.free.pop() ?? {
      x: 0,
      y: 0,
      vy: 0,
      life: 0,
      maxLife: 1,
      text: '',
      color: '#fff',
      size: 18,
      bubble: false,
    };
    item.x = Math.max(40, Math.min(LOGICAL_WIDTH - 40, x));
    item.y = Math.max(40, Math.min(LOGICAL_HEIGHT - 40, y));
    item.vy = -42;
    item.life = 0.85;
    item.maxLife = 0.85;
    item.text = text;
    item.color = color;
    item.size = size;
    item.bubble = bubble;
    this.items.push(item);
  }

  update(dt: number): void {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i]!;
      item.life -= dt;
      item.y += item.vy * dt;
      if (item.life <= 0) {
        this.items[i] = this.items[this.items.length - 1]!;
        this.items.pop();
        this.free.push(item);
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const item of this.items) {
      const alpha = Math.max(0, item.life / item.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `900 ${item.size}px Cinzel, Palatino, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (item.bubble) {
        const w = ctx.measureText(item.text).width + 18;
        ctx.fillStyle = '#fffef6';
        ctx.strokeStyle = '#1a1020';
        ctx.lineWidth = 2;
        roundRect(ctx, item.x - w / 2, item.y - 14, w, 26, 10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#1a1020';
      } else {
        ctx.strokeStyle = '#1a1020';
        ctx.lineWidth = 4;
        ctx.strokeText(item.text, item.x, item.y);
        ctx.fillStyle = item.color;
      }
      ctx.fillText(item.text, item.x, item.y);
      ctx.restore();
    }
  }

  clear(): void {
    for (const item of this.items) this.free.push(item);
    this.items.length = 0;
  }

  list(): readonly FloatTextItem[] {
    return this.items;
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

import { clamp } from '../utils/random.ts';

export type Mouth = 'smile' | 'grin' | 'o' | 'frown' | 'smirk' | 'shock';

/** Body lean while sliding sideways, easing up to ~5 degrees at full speed. */
export function leanTilt(vx: number): number {
  return LEAN_MAX * clamp(vx / LEAN_SPEED, -1, 1);
}

const LEAN_MAX = (5 * Math.PI) / 180;

/** Sideways speed that earns the full lean, near the hero's top speed. */
const LEAN_SPEED = 520;

/**
 * Wing-beat curve in 0..1: a quick downstroke followed by a longer recovery.
 * A plain sine reads as bobbing on a spring; the asymmetry is what makes it
 * read as something actually beating its wings to stay up.
 */
export function wingBeat(age: number, rate: number): number {
  const t = ((age * rate) % 1 + 1) % 1;
  const down = 0.34;
  return t < down
    ? Math.sin((t / down) * Math.PI * 0.5)
    : Math.cos(((t - down) / (1 - down)) * Math.PI * 0.5);
}

/**
 * Figure-eight hover offsets in roughly -1..1. Sideways drifts at half the
 * vertical rate, so a hovering body wanders instead of sliding up and down a rail.
 */
export function hoverDrift(age: number, seed = 0): { x: number; y: number } {
  return { x: Math.sin(age * 1.7 + seed), y: Math.sin(age * 3.4 + seed * 1.7) };
}

export function squashScale(hit: number, speed: number): { sx: number; sy: number } {
  const squash = Math.min(0.22, hit * 1.4);
  const stretch = Math.min(0.16, Math.abs(speed) / 900);
  return { sx: 1 + stretch - squash, sy: 1 - stretch + squash };
}

export function starBurst(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i - Math.PI / 2;
    const r = i % 2 === 0 ? size : size * 0.42;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

export function armorRing(ctx: CanvasRenderingContext2D, radius: number): void {
  ctx.strokeStyle = '#b388ff';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#c46bff';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, 0, radius + 7, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

export function numberBadge(ctx: CanvasRenderingContext2D, value: number): void {
  ctx.fillStyle = '#ffe08a';
  ctx.strokeStyle = '#1a1020';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(12, -14, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#1a1020';
  ctx.font = '900 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(value), 12, -13);
}

export function allyMark(ctx: CanvasRenderingContext2D, radius: number): void {
  ctx.strokeStyle = '#6ef0ff';
  ctx.lineWidth = 2.4;
  ctx.shadowColor = '#6ef0ff';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0, 0, radius + 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#e8fff6';
  ctx.strokeStyle = '#14301c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(12, 12, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#14301c';
  ctx.font = '900 8px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('OK', 12, 13);
}

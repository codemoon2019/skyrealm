export const LINE = '#4a2a38';
export const LINE_DARK = '#2a1830';
export const SKIN = '#f6d7bc';
export const BLUSH = 'rgba(255, 132, 148, 0.58)';
export const SHADOW_FILL = '#1a1020';

export function lineWidth(s: number): number {
  return Math.max(1.2, 1.7 * s);
}

export function strokeStyle(ctx: CanvasRenderingContext2D, s: number, dark = false): void {
  ctx.strokeStyle = dark ? LINE_DARK : LINE;
  ctx.lineWidth = lineWidth(s);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

export function glowAura(ctx: CanvasRenderingContext2D, color: string, blur = 14): void {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
}

export function clearGlow(ctx: CanvasRenderingContext2D): void {
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}

export function oval(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  fill: string,
  s = 1,
  rot = 0,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  strokeStyle(ctx, s);
  ctx.stroke();
  ctx.restore();
}

export function blob(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string, s = 1): void {
  oval(ctx, x, y, r, r, fill, s);
}

export function softFill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  inner: string,
  outer: string,
): CanvasGradient {
  const g = ctx.createRadialGradient(x - r * 0.25, y - r * 0.3, r * 0.1, x, y, r);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  return g;
}

export function blush(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number): void {
  ctx.fillStyle = BLUSH;
  ctx.beginPath();
  ctx.ellipse(cx - 4.2 * s, cy + 1.6 * s, 1.8 * s, 1.1 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 4.2 * s, cy + 1.6 * s, 1.8 * s, 1.1 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function shineEye(ctx: CanvasRenderingContext2D, x: number, y: number, s: number): void {
  ctx.fillStyle = LINE_DARK;
  ctx.beginPath();
  ctx.arc(x, y, 1.35 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fffef8';
  ctx.beginPath();
  ctx.arc(x - 0.4 * s, y - 0.45 * s, 0.45 * s, 0, Math.PI * 2);
  ctx.fill();
}

export function pairEyes(ctx: CanvasRenderingContext2D, y: number, spread: number, s: number): void {
  shineEye(ctx, -spread, y, s);
  shineEye(ctx, spread, y, s);
}

export function smile(ctx: CanvasRenderingContext2D, y: number, w: number, s: number): void {
  ctx.strokeStyle = LINE;
  ctx.lineWidth = Math.max(1, 1.15 * s);
  ctx.beginPath();
  ctx.arc(0, y - w * 0.15, w, 0.15, Math.PI - 0.15);
  ctx.stroke();
}

export function wingPair(
  ctx: CanvasRenderingContext2D,
  y: number,
  spread: number,
  rx: number,
  ry: number,
  tilt: number,
  color: string,
  inner: string,
  s: number,
  flap = 0,
): void {
  const t = tilt + flap;
  for (const dir of [-1, 1] as const) {
    ctx.save();
    ctx.translate(dir * spread, y);
    ctx.rotate(dir * t);
    ctx.fillStyle = color;
    glowAura(ctx, color, 10);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    clearGlow(ctx);
    ctx.fillStyle = inner;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.ellipse(-rx * 0.1 * dir, -ry * 0.12, rx * 0.55, ry * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    strokeStyle(ctx, s * 0.85);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

export function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  glowAura(ctx, color, 8);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i - Math.PI / 2;
    const r = i % 2 === 0 ? size : size * 0.38;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function dustRing(ctx: CanvasRenderingContext2D, age: number, color: string, radius: number): void {
  ctx.save();
  ctx.globalAlpha = 0.55;
  for (let i = 0; i < 5; i++) {
    const a = age * 2.2 + i * 1.256;
    sparkle(ctx, Math.cos(a) * radius, Math.sin(a) * radius * 0.7, 2.2, color);
  }
  ctx.restore();
}

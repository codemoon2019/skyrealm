import { useLayoutEffect, useRef } from 'react';
import { assets } from '../assets/AssetLoader.ts';

interface Props {
  size?: number;
  className?: string;
  offsetY?: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

function paint(
  canvas: HTMLCanvasElement,
  size: number,
  offsetY: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
): void {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);
  ctx.translate(size / 2, size / 2 + size * offsetY);
  draw(ctx);
}

export function PortraitCanvas({ size = 64, className = '', offsetY = 0.08, draw }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    paint(canvas, size, offsetY, draw);
  }, [draw, offsetY, size]);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const run = () => paint(canvas, size, offsetY, drawRef.current);
    const offReady = assets.onReady(run);
    const onVis = () => {
      if (document.visibilityState === 'visible') run();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      offReady();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [offsetY, size]);

  return <canvas ref={ref} className={`portrait-canvas ${className}`} style={{ width: size, height: size }} />;
}

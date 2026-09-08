import { useEffect, useRef, type CSSProperties, type PointerEvent } from 'react';
import { assets } from '../assets/AssetLoader.ts';
import { uiAssets } from '../assets/assetManifest.ts';
import type { GameEngine } from '../game/GameEngine.ts';
import type { GameSettings } from '../types/game.ts';

interface Props {
  engine: GameEngine;
  specialReady?: boolean;
  specialEnergy?: number;
  touchHand?: GameSettings['touchHand'];
}

const chipSrc = new Map<string, string>();
const DEADZONE = 0.15;

function iconSrc(url: string): string | null {
  const img = assets.get(url);
  if (!img) return null;
  if (img instanceof HTMLCanvasElement) {
    let src = chipSrc.get(url);
    if (!src) {
      src = img.toDataURL('image/png');
      chipSrc.set(url, src);
    }
    return src;
  }
  return url;
}

function stickFromPointer(pad: HTMLDivElement, clientX: number, clientY: number): { x: number; y: number } {
  const box = pad.getBoundingClientRect();
  const cx = box.left + box.width / 2;
  const cy = box.top + box.height / 2;
  const reach = Math.max(8, box.width * 0.5 - 8);
  let x = (clientX - cx) / reach;
  let y = (clientY - cy) / reach;
  const mag = Math.hypot(x, y);
  if (mag > 1) {
    x /= mag;
    y /= mag;
  }
  if (mag < DEADZONE) return { x: 0, y: 0 };
  return { x, y };
}

export function MobileControls({ engine, specialReady = false, specialEnergy = 0, touchHand = 'LEFT' }: Props) {
  const padRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);
  const holdRef = useRef<number | null>(null);
  const pauseSrc = iconSrc(uiAssets.hudPause);
  const specialSrc = iconSrc(uiAssets.hudSpecial);
  const pct = Math.max(0, Math.min(100, specialEnergy));
  const hand = touchHand === 'RIGHT' ? 'RIGHT' : 'LEFT';

  const setKnob = (x: number, y: number) => {
    const knob = knobRef.current;
    const pad = padRef.current;
    if (!knob || !pad) return;
    const travel = pad.getBoundingClientRect().width * 0.3;
    knob.style.transform = `translate(${x * travel}px, ${y * travel}px)`;
  };

  const steer = (event: PointerEvent<HTMLDivElement>) => {
    const pad = padRef.current;
    if (!pad) return;
    const next = stickFromPointer(pad, event.clientX, event.clientY);
    engine.input.setVirtualAxis(next.x, next.y);
    setKnob(next.x, next.y);
  };

  const release = () => {
    holdRef.current = null;
    engine.input.setVirtualAxis(0, 0);
    setKnob(0, 0);
  };

  useEffect(() => () => engine.input.setVirtualAxis(0, 0), [engine]);

  return (
    <div className="touch-layer">
      <div className={`touch-frame hand-${hand.toLowerCase()}`}>
        <button
          type="button"
          className="touch-btn pause"
          aria-label="Pause"
          onPointerDown={() => engine.input.queuePause()}
        >
          {pauseSrc ? <img src={pauseSrc} alt="" /> : <span className="touch-pause-bars" aria-hidden="true" />}
        </button>
        <div
          ref={padRef}
          className="joy-pad"
          role="slider"
          aria-label="Move"
          aria-valuemin={-1}
          aria-valuemax={1}
          aria-valuenow={0}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            holdRef.current = event.pointerId;
            steer(event);
          }}
          onPointerMove={(event) => {
            if (holdRef.current !== event.pointerId) return;
            steer(event);
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
            if (holdRef.current === event.pointerId) release();
          }}
          onPointerCancel={(event) => {
            if (holdRef.current === event.pointerId) release();
          }}
          onLostPointerCapture={() => {
            if (holdRef.current !== null) release();
          }}
        >
          <span ref={knobRef} className="joy-stick" />
        </div>
        <button
          type="button"
          className={`touch-btn special${specialReady ? ' is-ready' : ''}`}
          aria-label="Special"
          style={{ '--sp': `${pct}%` } as CSSProperties}
          onPointerDown={() => engine.input.queueSpecial()}
        >
          <span className="touch-special-face">
            {specialSrc ? <img src={specialSrc} alt="" /> : <span className="touch-special-glyph">E</span>}
          </span>
        </button>
      </div>
    </div>
  );
}

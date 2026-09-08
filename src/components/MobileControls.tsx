import type { CSSProperties } from 'react';
import { assets } from '../assets/AssetLoader.ts';
import { uiAssets } from '../assets/assetManifest.ts';
import type { GameEngine } from '../game/GameEngine.ts';

interface Props {
  engine: GameEngine;
  specialReady?: boolean;
  specialEnergy?: number;
}

const chipSrc = new Map<string, string>();

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

export function MobileControls({ engine, specialReady = false, specialEnergy = 0 }: Props) {
  const pauseSrc = iconSrc(uiAssets.hudPause);
  const specialSrc = iconSrc(uiAssets.hudSpecial);
  const pct = Math.max(0, Math.min(100, specialEnergy));

  return (
    <div className="touch-layer">
      <div className="touch-frame">
        <button
          type="button"
          className="touch-btn pause"
          aria-label="Pause"
          onPointerDown={() => engine.input.queuePause()}
        >
          {pauseSrc ? <img src={pauseSrc} alt="" /> : <span className="touch-pause-bars" aria-hidden="true" />}
        </button>
        <p className="touch-hint">DRAG BELOW TO FLY</p>
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

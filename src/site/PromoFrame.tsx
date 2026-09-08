import { useCallback, useEffect, useRef } from 'react';
import { WorldId } from '../types/game.ts';
import type { GuardianId, WorldId as W } from '../types/game.ts';
import { WORLDS } from '../game/content/worlds.ts';
import { getSkyPlate } from '../game/phaser/SkyPlates.ts';
import { PortraitCanvas } from '../components/PortraitCanvas.tsx';
import { drawGuardianSprite } from '../assets/drawEntity.ts';

interface PromoProps {
  world: W;
  guardian: GuardianId;
  className?: string;
  caption?: string;
  size?: number;
}

export function PromoFrame({ world, guardian, className = '', caption, size = 168 }: PromoProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawGuardian = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawGuardianSprite(ctx, guardian, size * 0.9, 'portrait');
    },
    [guardian, size],
  );

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const plate = getSkyPlate(world);
    canvas.width = 540;
    canvas.height = 360;
    ctx.drawImage(plate, 0, 140, 540, 480, 0, 0, 540, 360);
  }, [world]);

  return (
    <figure className={`lp-promo ${className}`}>
      <div className="lp-promo-bezel">
        <canvas ref={ref} className="lp-promo-plate" width={540} height={360} />
        <div className="lp-promo-char">
          <PortraitCanvas size={size} offsetY={0} draw={drawGuardian} />
        </div>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

interface ThumbProps {
  world: W;
  selected?: boolean;
  onSelect?: () => void;
}

export function WorldThumb({ world, selected = false, onSelect }: ThumbProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const plate = getSkyPlate(world);
    canvas.width = 320;
    canvas.height = 200;
    ctx.drawImage(plate, 0, 80, 540, 520, 0, 0, 320, 200);
  }, [world]);

  return (
    <figure
      className={`lp-world-card${selected ? ' is-on' : ''}`}
      tabIndex={onSelect ? 0 : undefined}
      role={onSelect ? 'button' : undefined}
      aria-pressed={onSelect ? selected : undefined}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (!onSelect) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <canvas ref={ref} className="lp-world-plate" width={320} height={200} />
      <figcaption>{WORLDS[world].name}</figcaption>
    </figure>
  );
}

export const SHOW_WORLDS = [
  WorldId.MEADOWS,
  WorldId.CRYSTAL_FOREST,
  WorldId.EMBER_CANYON,
  WorldId.FROZEN_SKIES,
  WorldId.SHADOW_REALM,
  WorldId.STORM_KINGDOM,
  WorldId.CELESTIAL_RUINS,
  WorldId.VOID_FRONTIER,
] as const;

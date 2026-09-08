import { useCallback, useEffect, useRef } from 'react';
import { AetherlingSpecies, GuardianId } from '../types/game.ts';
import type { AetherlingSpecies as Species, GuardianId as Gid, SaveGame } from '../types/game.ts';
import { PortraitCanvas } from '../components/PortraitCanvas.tsx';
import { assets } from '../assets/AssetLoader.ts';
import { aetherPath, guardianPath } from '../assets/assetManifest.ts';
import { drawAetherSprite, drawGuardianSprite } from '../assets/drawEntity.ts';

interface Props {
  save: SaveGame;
  guardianId?: Gid;
}

function partySpecies(save: SaveGame, slot: 0 | 1, fallback: Species): Species {
  const id = save.equipped[slot];
  return save.aetherlings.find((unit) => unit.id === id)?.species ?? fallback;
}

function GuardianFigure({ id, size }: { id: Gid; size: number }) {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawGuardianSprite(ctx, id, size * 0.92, 'portrait');
    },
    [id, size],
  );
  return <PortraitCanvas size={size} offsetY={0} className="lp-hero-guardian-art" draw={draw} />;
}

function AetherFigure({ species, size }: { species: Species; size: number }) {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawAetherSprite(ctx, species, size * 0.88, { pose: 'portrait' });
    },
    [species, size],
  );
  return <PortraitCanvas size={size} offsetY={0} className="lp-hero-aether-art" draw={draw} />;
}

export function HeroParty({ save, guardianId }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);
  const guardian = guardianId || save.equippedGuardian || GuardianId.AURELIA;
  const left = partySpecies(save, 0, AetherlingSpecies.FLICKER);
  const right = partySpecies(save, 1, AetherlingSpecies.LUMEN);

  useEffect(() => {
    void assets.load([
      guardianPath(guardian, 'portrait'),
      aetherPath(left, 'portrait'),
      aetherPath(right, 'portrait'),
    ]);
  }, [guardian, left, right]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;
    const stage = layer.closest('.lp-hero') ?? layer;

    const onMove = (event: Event) => {
      const pointer = event as PointerEvent;
      const box = stage.getBoundingClientRect();
      const x = ((pointer.clientX - box.left) / box.width - 0.5) * 18;
      const y = ((pointer.clientY - box.top) / box.height - 0.5) * 12;
      layer.style.setProperty('--lp-px', `${x}px`);
      layer.style.setProperty('--lp-py', `${y}px`);
    };
    const onLeave = () => {
      layer.style.removeProperty('--lp-px');
      layer.style.removeProperty('--lp-py');
    };
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="lp-hero-party" ref={layerRef} aria-hidden="true">
      <div className="lp-hero-party-glow" />
      <div className="lp-hero-aether lp-hero-aether-a">
        <AetherFigure species={left} size={120} />
      </div>
      <div className="lp-hero-guardian">
        <GuardianFigure id={guardian} size={260} />
      </div>
      <div className="lp-hero-aether lp-hero-aether-b">
        <AetherFigure species={right} size={128} />
      </div>
    </div>
  );
}

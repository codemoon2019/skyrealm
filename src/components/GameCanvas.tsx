import { useCallback, useEffect, useRef, type PointerEvent } from 'react';
import type { GameEngine } from '../game/GameEngine.ts';
import type { GameBridge } from '../game/phaser/GameBridge.ts';
import { createPhaserGame, destroyPhaserGame } from '../game/phaser/PhaserGame.ts';
import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from '../game/constants.ts';
import { useGameInput } from '../hooks/useGameInput.ts';

interface Props {
  engine: GameEngine;
  bridge: GameBridge;
  pointerControl: boolean;
}

export function GameCanvas({ engine, bridge, pointerControl }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  useGameInput(engine);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const game = createPhaserGame(host, engine, bridge);
    return () => {
      destroyPhaserGame(game);
    };
  }, [engine, bridge]);

  const toGame = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const canvas = hostRef.current?.querySelector('canvas');
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return { x: 0, y: 0 };
    return {
      x: ((event.clientX - rect.left) / rect.width) * LOGICAL_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * LOGICAL_HEIGHT,
    };
  }, []);

  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerControl) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const p = toGame(event);
    engine.input.setPointer(p.x, p.y, true);
  };

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerControl || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const p = toGame(event);
    engine.input.setPointer(p.x, p.y, true);
  };

  const onUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerControl) return;
    engine.input.setPointer(engine.input.pointerX, engine.input.pointerY, false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="game-stage">
      <div
        className="game-host"
        ref={hostRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onContextMenu={(event) => event.preventDefault()}
      />
    </div>
  );
}

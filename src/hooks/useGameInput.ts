import { useEffect } from 'react';
import type { GameEngine } from '../game/GameEngine.ts';

export function useGameInput(engine: GameEngine): void {
  useEffect(() => {
    return engine.input.attach(window);
  }, [engine]);
}

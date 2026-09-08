import { GameState } from '../../types/game.ts';
import type { BossKind, GameSettings, GameSnapshot, GameState as GameStateT, RunMode } from '../../types/game.ts';
import type { GameEngine } from '../GameEngine.ts';

export const BridgeEvent = {
  GAME_STARTED: 'GAME_STARTED',
  STATE: 'STATE',
  PLAYER_DIED: 'PLAYER_DIED',
  BOSS_STARTED: 'BOSS_STARTED',
  BOSS_DEFEATED: 'BOSS_DEFEATED',
  GAME_OVER: 'GAME_OVER',
} as const;

export type BridgeEvent = (typeof BridgeEvent)[keyof typeof BridgeEvent];

export type BridgeListener = (event: BridgeEvent, state: GameStateT) => void;

export class GameBridge {
  readonly engine: GameEngine;
  private readonly listeners = new Set<BridgeListener>();
  private prevState: GameStateT;
  private prevAlive = true;
  private prevBoss = false;
  private prevBosses = 0;

  constructor(engine: GameEngine) {
    this.engine = engine;
    this.prevState = engine.state;
  }

  on(fn: BridgeListener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  emit(event: BridgeEvent): void {
    const state = this.engine.state;
    for (const fn of this.listeners) fn(event, state);
  }

  /** Called from MainScene after engine.update — never from a React render. */
  sync(): void {
    const e = this.engine;
    if (e.state !== this.prevState) {
      const prev = this.prevState;
      this.prevState = e.state;
      this.emit(BridgeEvent.STATE);
      if (e.state === GameState.GAME_OVER) this.emit(BridgeEvent.GAME_OVER);
      if (e.state === GameState.BOSS_FIGHT && prev !== GameState.BOSS_FIGHT) {
        this.emit(BridgeEvent.BOSS_STARTED);
      }
    }
    if (this.prevAlive && !e.player.alive) this.emit(BridgeEvent.PLAYER_DIED);
    this.prevAlive = e.player.alive;
    const hasBoss = !!e.boss?.alive;
    if (this.prevBoss && !hasBoss && e.score.bossesDefeated > this.prevBosses) {
      this.emit(BridgeEvent.BOSS_DEFEATED);
    }
    this.prevBoss = hasBoss;
    this.prevBosses = e.score.bossesDefeated;
  }

  startGame(mode: RunMode = 'NORMAL', raid?: BossKind): void {
    this.engine.startGame(mode, raid);
    this.prevState = this.engine.state;
    this.prevAlive = true;
    this.prevBoss = false;
    this.prevBosses = this.engine.score.bossesDefeated;
    this.emit(BridgeEvent.GAME_STARTED);
    this.emit(BridgeEvent.STATE);
  }

  pause(): void {
    this.engine.pause();
    this.sync();
  }

  resume(): void {
    this.engine.resume();
    this.sync();
  }

  restart(): void {
    this.engine.restart();
    this.prevState = this.engine.state;
    this.prevAlive = true;
    this.prevBoss = false;
    this.emit(BridgeEvent.GAME_STARTED);
    this.emit(BridgeEvent.STATE);
  }

  goToMenu(): void {
    this.engine.goToMenu();
    this.sync();
  }

  applySettings(next: Partial<GameSettings>): void {
    this.engine.applySettings(next);
  }

  getSnapshot(): GameSnapshot {
    return this.engine.getSnapshot();
  }

  unlockAudio(): void {
    this.engine.audio.unlock();
  }
}

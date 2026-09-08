import { EnemyType } from '../types/game.ts';
import type { StageBeat, StageDef } from '../types/game.ts';
import type { Enemy } from './Enemy.ts';
import type { ObjectPool } from './ObjectPool.ts';
import { LOGICAL_WIDTH } from './constants.ts';
import { randRange } from '../utils/random.ts';
import { formationSlots } from './content/formations.ts';
import type { FormationKind } from './content/formations.ts';

export class WaveManager {
  private time = 0;
  private cursor = 0;
  private beatIndex = 0;
  private finished = false;
  private clearGrace = 0;

  start(): void {
    this.time = 0;
    this.cursor = 0;
    this.beatIndex = 0;
    this.finished = false;
    this.clearGrace = 0;
  }

  update(
    dt: number,
    stage: StageDef,
    enemies: Enemy[],
    pool: ObjectPool<Enemy>,
    hpScale: number,
    speedScale: number,
    spawnRate: number,
  ): boolean {
    this.time += dt;
    while (this.cursor < stage.spawns.length) {
      const event = stage.spawns[this.cursor]!;
      const due = event.time / spawnRate;
      if (this.time < due) break;
      this.spawnGroup(event.type, event.count, enemies, pool, hpScale, speedScale);
      this.cursor += 1;
    }
    const wavesDone = this.cursor >= stage.spawns.length;
    const longEnough = this.time >= stage.minDuration / spawnRate;
    if (wavesDone && enemies.length === 0 && longEnough) {
      this.clearGrace += dt;
      if (this.clearGrace > 1.1) this.finished = true;
    } else {
      this.clearGrace = 0;
    }
    return this.finished;
  }

  pullBeats(stage: StageDef, spawnRate: number): StageBeat[] {
    const due: StageBeat[] = [];
    const beats = stage.beats ?? [];
    while (this.beatIndex < beats.length) {
      const next = beats[this.beatIndex]!;
      if (this.time < next.time / spawnRate) break;
      due.push(next);
      this.beatIndex += 1;
    }
    return due;
  }

  spawnGroup(
    type: EnemyType,
    count: number,
    enemies: Enemy[],
    pool: ObjectPool<Enemy>,
    hpScale: number,
    speedScale: number,
  ): void {
    const cluster = type === EnemyType.SWARM;
    const baseX = randRange(70, LOGICAL_WIDTH - 70);
    for (let i = 0; i < count; i++) {
      const enemy = pool.acquire();
      if (!enemy) return;
      const x = cluster ? baseX + (i - count / 2) * 18 : randRange(40, LOGICAL_WIDTH - 40);
      enemy.spawn(type, x, hpScale, speedScale);
      if (cluster) enemy.y -= i * 14;
      enemies.push(enemy);
    }
  }

  spawnFormation(
    kind: FormationKind,
    type: EnemyType,
    count: number,
    enemies: Enemy[],
    pool: ObjectPool<Enemy>,
    hpScale: number,
    speedScale: number,
  ): number {
    const slots = formationSlots(kind, count);
    let spawned = 0;
    const hold =
      type !== EnemyType.KAMIKAZE &&
      type !== EnemyType.SCOUT &&
      type !== EnemyType.CRAWLER &&
      type !== EnemyType.MINI_BOSS;
    for (const slot of slots) {
      const enemy = pool.acquire();
      if (!enemy) break;
      enemy.spawn(type, slot.x, hpScale, speedScale);
      enemy.x = slot.x;
      enemy.y = slot.y;
      enemy.phase = slot.phase;
      if (hold) enemy.vx = 0;
      enemies.push(enemy);
      spawned += 1;
    }
    return spawned;
  }
}

import { LOGICAL_WIDTH } from './constants.ts';
import { BossKind, EnemyType, ProjectileKind } from '../types/game.ts';
import type { BossKind as BossKindT } from '../types/game.ts';
import type { EnemyProjectile, MuzzleCue } from './EnemyProjectile.ts';
import type { ObjectPool } from './ObjectPool.ts';
import type { Player } from './Player.ts';
import { randRange } from '../utils/random.ts';
import { squashScale } from './cartoon.ts';
import { BOSS_META } from './content/bosses.ts';
import { drawBossSprite } from '../assets/drawEntity.ts';

export class Boss {
  kind: BossKindT = BossKind.IRON_HYDRA;
  name = 'IRON HYDRA';
  raid = false;
  damageTaken = 0;
  x = LOGICAL_WIDTH * 0.5;
  y = 140;
  health = 1000;
  maxHealth = 1000;
  radius = 52;
  hitFlash = 0;
  fireCd = 0;
  patternCd = 0;
  age = 0;
  phase = 1;
  vx = 0;
  vy = 40;
  alive = true;
  intro = 1.2;
  lastPhase = 1;

  spawn(kind: BossKindT, hpScale: number, raid = false): void {
    const meta = BOSS_META[kind];
    this.kind = kind;
    this.name = meta.name;
    this.raid = raid;
    this.damageTaken = 0;
    this.health = (raid ? meta.raidHealth : meta.health) * hpScale;
    this.maxHealth = this.health;
    this.radius = meta.radius;
    this.x = LOGICAL_WIDTH * 0.5;
    this.y = -90;
    this.hitFlash = 0;
    this.fireCd = 1;
    this.patternCd = 0;
    this.age = 0;
    this.phase = 1;
    this.vx = 70;
    this.vy = 0;
    this.alive = true;
    this.intro = 1.4;
    this.lastPhase = 1;
  }

  phaseLine(): string {
    const lines = ['PHASE ONE', 'IT SEES YOU', 'THE REALM SHAKES', 'ENRAGE!'];
    return lines[this.phase - 1] ?? 'RAWR!';
  }

  hpRatio(): number {
    return this.health / this.maxHealth;
  }

  currentPhase(): number {
    const r = this.hpRatio();
    if (r > 0.7) return 1;
    if (r > 0.4) return 2;
    if (r > 0.15) return 3;
    return 4;
  }

  hurt(amount: number): boolean {
    this.health -= amount;
    this.damageTaken += amount;
    this.hitFlash = 0.08;
    if (this.health <= 0) {
      this.health = 0;
      this.alive = false;
      return true;
    }
    return false;
  }

  update(
    dt: number,
    player: Player,
    projectiles: EnemyProjectile[],
    pool: ObjectPool<EnemyProjectile>,
    spawnMinion: (type: EnemyType, y: number) => void,
    projSpeed: number,
    onAttack: () => void,
    onPhase?: (line: string) => void,
    onMuzzle?: MuzzleCue,
  ): void {
    this.age += dt;
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.phase = this.currentPhase();
    if (this.phase !== this.lastPhase) {
      this.lastPhase = this.phase;
      onPhase?.(this.phaseLine());
    }
    const targetY = 150;
    // One settle rate for the whole life of the boss, so the descent doesn't
    // visibly change pace at the instant the intro window closes.
    this.y += (targetY - this.y) * Math.min(1, dt * 2.2);
    if (this.intro > 0) {
      this.intro -= dt;
      // Drift sideways on the way down so the entrance has some sway to it, but
      // hold off on the bounce-off-the-walls patrol until the fight is live.
      this.x += this.vx * dt * 0.35;
      return;
    }
    this.x += this.vx * dt;
    if (this.x < 80 || this.x > LOGICAL_WIDTH - 80) this.vx *= -1;
    const rage = this.phase === 4;
    if (rage && BOSS_META[this.kind].pattern === 'serpent' && Math.random() < dt * 0.35) {
      this.x = randRange(90, LOGICAL_WIDTH - 90);
    }

    this.fireCd -= dt;
    this.patternCd -= dt;
    const interval = this.phase === 1 ? 1.15 : this.phase === 2 ? 0.85 : this.phase === 3 ? 0.62 : 0.42;
    if (this.fireCd <= 0) {
      this.fireCd = interval;
      this.firePattern(player, projectiles, pool, projSpeed);
      // One flash per volley: a rage-phase ring of fourteen bullets leaves the
      // same barrel, so per-bullet flashes would just pile up in one blob.
      onMuzzle?.(this.x, this.y + 24, player.x - this.x, player.y - this.y - 24, BOSS_META[this.kind].element);
      onAttack();
    }
    if (this.patternCd <= 0) {
      this.patternCd = rage ? 3.2 : 5.5;
      const pat = BOSS_META[this.kind].pattern;
      if (pat === 'hydra') spawnMinion(EnemyType.SCOUT, this.x);
      if (pat === 'titan') {
        spawnMinion(EnemyType.DRONE, this.x - 40);
        spawnMinion(EnemyType.DRONE, this.x + 40);
      }
      if (pat === 'serpent' || pat === 'queen') spawnMinion(EnemyType.KAMIKAZE, this.x);
      if (pat === 'storm') spawnMinion(EnemyType.MAGE, this.x);
      if (rage) spawnMinion(EnemyType.SWARM, this.x);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const scale = squashScale(this.hitFlash, this.vy);
    const bob = Math.sin(this.age * 4) * 3;
    const pulse = 1 + Math.sin(this.age * 6) * 0.08;
    ctx.save();
    ctx.translate(this.x, this.y + bob);
    ctx.scale(scale.sx * pulse, scale.sy * pulse);
    if (this.hitFlash > 0) ctx.globalAlpha = 0.65;
    const pose = !this.alive ? 'death' : this.hitFlash > 0 ? 'hit' : this.fireCd < 0.2 ? 'attack' : 'idle';
    drawBossSprite(ctx, this.kind, this.radius, this.age, pose);
    ctx.restore();
  }

  private firePattern(
    player: Player,
    projectiles: EnemyProjectile[],
    pool: ObjectPool<EnemyProjectile>,
    projSpeed: number,
  ): void {
    const aim = (speed: number, spread = 0) => {
      const dx = player.x - this.x;
      const dy = player.y - this.y + spread;
      const dist = Math.hypot(dx, dy) || 1;
      return { vx: (dx / dist) * speed, vy: (dy / dist) * speed };
    };

    const pat = BOSS_META[this.kind].pattern;
    if (pat === 'hydra') {
      const a = aim(220);
      this.shot(projectiles, pool, a.vx, a.vy, ProjectileKind.STRAIGHT, 12, projSpeed);
      if (this.phase >= 2) {
        this.shot(projectiles, pool, -40, 240, ProjectileKind.STRAIGHT, 10, projSpeed);
        this.shot(projectiles, pool, 40, 240, ProjectileKind.STRAIGHT, 10, projSpeed);
      }
      if (this.phase >= 3) {
        this.shot(projectiles, pool, -90, 160, ProjectileKind.SPREAD, 10, projSpeed);
        this.shot(projectiles, pool, 90, 160, ProjectileKind.SPREAD, 10, projSpeed);
      }
      if (this.phase >= 4) {
        this.shot(projectiles, pool, 0, 200, ProjectileKind.MISSILE, 14, projSpeed);
      }
      return;
    }

    if (pat === 'titan' || pat === 'storm') {
      for (let i = -2; i <= 2; i++) {
        this.shot(projectiles, pool, i * 55, 180, ProjectileKind.STRAIGHT, 12, projSpeed);
      }
      if (this.phase >= 2) {
        const h = aim(110);
        this.shot(projectiles, pool, h.vx, h.vy, ProjectileKind.HOMING, 12, projSpeed);
      }
      if (this.phase >= 3) {
        this.shot(projectiles, pool, -20, 90, ProjectileKind.PLASMA, 16, projSpeed);
        this.shot(projectiles, pool, 20, 90, ProjectileKind.PLASMA, 16, projSpeed);
      }
      if (this.phase >= 4) {
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * 2 * i) / 8;
          this.shot(projectiles, pool, Math.cos(a) * 150, Math.sin(a) * 150, ProjectileKind.SPREAD, 10, projSpeed);
        }
      }
      return;
    }

    const count = this.phase >= 4 ? 14 : this.phase >= 3 ? 10 : 8;
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + this.age;
      this.shot(
        projectiles,
        pool,
        Math.cos(a) * 140,
        Math.sin(a) * 140,
        this.phase >= 3 ? ProjectileKind.PLASMA : ProjectileKind.STRAIGHT,
        12,
        projSpeed,
      );
    }
    if (this.phase >= 2) {
      const a = aim(200);
      this.shot(projectiles, pool, a.vx, a.vy, ProjectileKind.MISSILE, 14, projSpeed);
    }
  }

  private shot(
    projectiles: EnemyProjectile[],
    pool: ObjectPool<EnemyProjectile>,
    vx: number,
    vy: number,
    kind: (typeof ProjectileKind)[keyof typeof ProjectileKind],
    damage: number,
    projSpeed: number,
  ): void {
    const p = pool.acquire();
    if (!p) return;
    p.spawn(this.x, this.y + 24, vx, vy, kind, damage, projSpeed, BOSS_META[this.kind].element);
    projectiles.push(p);
  }
}

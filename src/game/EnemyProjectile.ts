import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from './constants.ts';
import { ElementId, ProjectileKind } from '../types/game.ts';
import type { ElementId as El, ProjectileKind as ProjectileKindT } from '../types/game.ts';
import { drawMonsterShot } from './fantasyDraw.ts';

/**
 * Fired at each shot's spawn point and heading, so the presentation layer can
 * flash a muzzle without the combat classes knowing anything about VFX.
 */
export type MuzzleCue = (x: number, y: number, vx: number, vy: number, element: El) => void;

export class EnemyProjectile {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  damage = 10;
  radius = 4;
  life = 4;
  kind: ProjectileKindT = ProjectileKind.STRAIGHT;
  turn = 0;
  /** Element of whatever fired this, which colours the shot and its wake. */
  element: El = ElementId.ARCANE;

  reset(): void {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.damage = 10;
    this.radius = 4;
    this.life = 4;
    this.kind = ProjectileKind.STRAIGHT;
    this.turn = 0;
    this.element = ElementId.ARCANE;
  }

  spawn(
    x: number,
    y: number,
    vx: number,
    vy: number,
    kind: ProjectileKindT,
    damage: number,
    speedScale: number,
    element: El = ElementId.ARCANE,
  ): void {
    this.x = x;
    this.y = y;
    this.vx = vx * speedScale;
    this.vy = vy * speedScale;
    this.kind = kind;
    this.damage = damage;
    this.life = 5;
    this.element = element;
    this.turn = kind === ProjectileKind.HOMING ? 2.1 : 0;
    this.radius =
      kind === ProjectileKind.PLASMA ? 7 : kind === ProjectileKind.MISSILE ? 4 : kind === ProjectileKind.HOMING ? 5 : 3.5;
  }

  update(dt: number, px: number, py: number): boolean {
    if (this.kind === ProjectileKind.HOMING && this.turn > 0) {
      const dx = px - this.x;
      const dy = py - this.y;
      const dist = Math.hypot(dx, dy) || 1;
      const tx = (dx / dist) * 130;
      const ty = (dy / dist) * 130;
      this.vx += (tx - this.vx) * this.turn * dt;
      this.vy += (ty - this.vy) * this.turn * dt;
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
    return (
      this.life > 0 &&
      this.x > -40 &&
      this.x < LOGICAL_WIDTH + 40 &&
      this.y > -40 &&
      this.y < LOGICAL_HEIGHT + 40
    );
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.atan2(this.vy, this.vx) + Math.PI / 2);
    drawMonsterShot(ctx, this.kind, this.element, this.radius);
    ctx.restore();
  }
}

import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from './constants.ts';
import { randRange, randInt } from '../utils/random.ts';
import { drawBurningAsteroid, drawFlamePlume } from './fantasyDraw.ts';
import { EMBER_ASTEROID } from './content/hazards.ts';

export class Asteroid {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  radius = 18;
  health = 20;
  rotation = 0;
  spin = 0;
  verts: number[] = [];
  size: 1 | 2 | 3 = 2;
  age = 0;

  spawn(size: 1 | 2 | 3, x?: number, y?: number): void {
    this.size = size;
    this.x = x ?? randRange(30, LOGICAL_WIDTH - 30);
    this.y = y ?? -30;
    this.vx = randRange(-18, 18);
    this.vy = randRange(105, 185) / size;
    this.radius = size === 3 ? 28 : size === 2 ? 18 : 10;
    this.health = size === 3 ? 36 : size === 2 ? 20 : 10;
    this.rotation = randRange(0, Math.PI * 2);
    this.spin = randRange(-1.6, 1.6);
    this.age = 0;
    this.verts = [];
    const count = randInt(6, 8);
    for (let i = 0; i < count; i++) {
      this.verts.push(randRange(0.7, 1.15));
    }
  }

  update(dt: number): boolean {
    this.age += dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt + Math.sin(this.age * 3) * 10 * dt;
    this.rotation += this.spin * dt;
    return this.y < LOGICAL_HEIGHT + 40 && this.health > 0;
  }

  hurt(amount: number): boolean {
    this.health -= amount;
    return this.health <= 0;
  }

  score(): number {
    return this.size === 3 ? 120 : this.size === 2 ? 80 : 50;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    const len = this.radius * EMBER_ASTEROID.plume;
    ctx.save();
    ctx.rotate(Math.atan2(-this.vy, -this.vx));
    ctx.translate(len * 0.5, 0);
    drawFlamePlume(ctx, len, EMBER_ASTEROID);
    ctx.restore();
    drawBurningAsteroid(ctx, this.radius, this.verts, this.rotation);
    ctx.restore();
  }
}

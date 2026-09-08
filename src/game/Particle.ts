import { randRange } from '../utils/random.ts';

export type ParticleShape = 'square' | 'star' | 'puff' | 'ring' | 'streak';

export class Particle {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  ax = 0;
  ay = 0;
  life = 0;
  maxLife = 1;
  size = 2;
  rotation = 0;
  spin = 0;
  friction = 0.98;
  /** Pixels of radius gained per second, for expanding flashes. */
  grow = 0;
  r = 255;
  g = 255;
  b = 255;
  fade = true;
  shape: ParticleShape = 'square';

  reset(): void {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.life = 0;
    this.maxLife = 1;
    this.size = 2;
    this.rotation = 0;
    this.spin = 0;
    this.friction = 0.98;
    this.grow = 0;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.fade = true;
    this.shape = 'square';
  }

  update(dt: number): boolean {
    this.life -= dt;
    if (this.grow !== 0) this.size += this.grow * dt;
    this.vx += this.ax * dt;
    this.vy += this.ay * dt;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rotation += this.spin * dt;
    return this.life > 0;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const alpha = this.fade ? Math.max(0, this.life / this.maxLife) : 1;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${alpha})`;
    if (this.shape === 'star') {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI / 4) * i;
        const r = i % 2 === 0 ? this.size : this.size * 0.4;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    } else if (this.shape === 'puff') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shape === 'ring') {
      ctx.strokeStyle = `rgba(${this.r},${this.g},${this.b},${alpha})`;
      ctx.lineWidth = Math.max(1, this.size * 0.16);
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.shape === 'streak') {
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 2.2, this.size * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-this.size * 0.5, -this.size * 0.5, this.size, this.size);
    }
    ctx.restore();
  }
}

export class ParticleSystem {
  readonly items: Particle[] = [];
  private readonly pool = {
    free: [] as Particle[],
  };

  burst(
    x: number,
    y: number,
    count: number,
    color: readonly [number, number, number],
    speed: number,
    life: number,
    size = 3,
    shape: ParticleShape = 'square',
  ): void {
    const max = Math.min(count, 80);
    for (let i = 0; i < max; i++) {
      const p = this.acquire();
      if (!p) return;
      const angle = randRange(0, Math.PI * 2);
      const spd = randRange(speed * 0.25, speed);
      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * spd;
      p.vy = Math.sin(angle) * spd;
      p.ax = 0;
      p.ay = 0;
      p.life = randRange(life * 0.5, life);
      p.maxLife = p.life;
      p.size = randRange(size * 0.5, size);
      p.rotation = angle;
      p.spin = randRange(-8, 8);
      p.friction = 0.96;
      p.r = color[0];
      p.g = color[1];
      p.b = color[2];
      p.fade = true;
      p.shape = shape;
    }
  }

  burstStars(
    x: number,
    y: number,
    count: number,
    color: readonly [number, number, number],
  ): void {
    this.burst(x, y, count, color, 220, 0.45, 5, 'star');
  }

  puff(x: number, y: number, color: readonly [number, number, number]): void {
    this.burst(x, y, 10, color, 80, 0.5, 7, 'puff');
  }

  /** Single shockwave ring that expands from `size` and fades out. */
  ringFlash(
    x: number,
    y: number,
    color: readonly [number, number, number],
    size: number,
    grow: number,
    life: number,
  ): void {
    const p = this.acquire();
    if (!p) return;
    p.x = x;
    p.y = y;
    p.vx = 0;
    p.vy = 0;
    p.ax = 0;
    p.ay = 0;
    p.life = life;
    p.maxLife = life;
    p.size = size;
    p.grow = grow;
    p.rotation = 0;
    p.spin = 0;
    p.friction = 1;
    p.r = color[0];
    p.g = color[1];
    p.b = color[2];
    p.fade = true;
    p.shape = 'ring';
  }

  /** Dash of wind or fire, rotated to lie along its own travel. */
  streak(
    x: number,
    y: number,
    vx: number,
    vy: number,
    color: readonly [number, number, number],
    life: number,
    size: number,
  ): void {
    const p = this.acquire();
    if (!p) return;
    p.x = x;
    p.y = y;
    p.vx = vx;
    p.vy = vy;
    p.ax = 0;
    p.ay = 0;
    p.life = life;
    p.maxLife = life;
    p.size = size;
    p.rotation = Math.atan2(vy, vx);
    p.spin = 0;
    p.friction = 0.97;
    p.r = color[0];
    p.g = color[1];
    p.b = color[2];
    p.fade = true;
    p.shape = 'streak';
  }

  emit(
    x: number,
    y: number,
    vx: number,
    vy: number,
    color: readonly [number, number, number],
    life: number,
    size: number,
  ): void {
    const p = this.acquire();
    if (!p) return;
    p.x = x;
    p.y = y;
    p.vx = vx;
    p.vy = vy;
    p.ax = 0;
    p.ay = 0;
    p.life = life;
    p.maxLife = life;
    p.size = size;
    p.rotation = 0;
    p.spin = randRange(-4, 4);
    p.friction = 0.94;
    p.r = color[0];
    p.g = color[1];
    p.b = color[2];
    p.fade = true;
    p.shape = 'puff';
  }

  update(dt: number): void {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const p = this.items[i]!;
      if (!p.update(dt)) {
        this.items[i] = this.items[this.items.length - 1]!;
        this.items.pop();
        p.reset();
        this.pool.free.push(p);
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const p of this.items) p.render(ctx);
  }

  clear(): void {
    for (const p of this.items) {
      p.reset();
      this.pool.free.push(p);
    }
    this.items.length = 0;
  }

  private acquire(): Particle | null {
    if (this.items.length >= 420) return null;
    const p = this.pool.free.pop() ?? new Particle();
    this.items.push(p);
    return p;
  }
}

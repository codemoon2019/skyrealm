import type { ParticleSystem } from '../Particle.ts';
import type { ProjectileStyle } from './projectileStyle.ts';

export function spawnProjectileImpact(
  particles: ParticleSystem,
  x: number,
  y: number,
  style: ProjectileStyle,
  opts: { crit?: boolean; boss?: boolean } = {},
): void {
  const scale = style.impactScale * (opts.crit ? 1.35 : 1) * (opts.boss ? 1.22 : 1);
  const puffs = opts.crit ? 8 : opts.boss ? 7 : 5;
  particles.burst(x, y, puffs, style.particleColor, 68 * scale, 0.16, 2 * scale, 'puff');
  particles.burst(x, y, opts.crit ? 6 : 4, style.trailColor, 38 * scale, 0.11, 1.35 * scale, 'star');
}

import type { ParticleSystem } from '../Particle.ts';
import type { ProjectileStyle, ShotSource } from './projectileStyle.ts';

export function spawnMuzzleFlash(
  particles: ParticleSystem,
  x: number,
  y: number,
  style: ProjectileStyle,
  source: ShotSource = 'player',
): void {
  const scale = style.muzzleFlashScale;
  const sidekick = source === 'sidekick';
  particles.burst(
    x,
    y,
    sidekick ? 3 : 4,
    style.particleColor,
    58 * scale,
    0.1,
    (sidekick ? 1.5 : 1.9) * scale,
    sidekick ? 'puff' : 'star',
  );
}

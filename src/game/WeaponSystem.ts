import type { Bullet } from './Bullet.ts';
import type { ObjectPool } from './ObjectPool.ts';
import type { Player } from './Player.ts';
import type { AudioManager } from './AudioManager.ts';
import { MUZZLE } from './constants.ts';
import type { VFXManager } from './vfx/VFXManager.ts';
import { guardianShotStyle, paintShot } from './vfx/projectileStyle.ts';

export class WeaponSystem {
  fire(player: Player, bullets: Bullet[], pool: ObjectPool<Bullet>, vfx: VFXManager, audio: AudioManager): number {
    const spawned = this.cast(player, bullets, pool);
    const extra = player.doubleShotTime > 0 || player.mushroomTime > 0 ? this.cast(player, bullets, pool) : 0;
    vfx.muzzle(player.x, player.y - MUZZLE.player, guardianShotStyle(player.guardian), 'player');
    this.cue(player.weaponLevel, audio);
    return spawned + extra;
  }

  private cast(player: Player, bullets: Bullet[], pool: ObjectPool<Bullet>): number {
    const level = player.weaponLevel;
    const style = guardianShotStyle(player.guardian);
    let spawned = 0;

    // Each tier's pace is a fraction of the guardian's own muzzle velocity, so a
    // heavy cannon still lags a tracer bolt without pinning every gun to one speed.
    const add = (
      ox: number,
      vx: number,
      damage: number,
      kind: 'laser' | 'cannon' | 'plasma',
      pace = 1,
    ) => {
      const b = pool.acquire();
      if (!b) return;
      const shot = player.rollShot(damage);
      b.spawn(player.x + ox, player.y - MUZZLE.player, vx, -style.speed * pace, shot.damage, kind);
      // The tier still picks the hitbox and pace; the art is the guardian's own.
      b.guardian = player.guardian;
      paintShot(b, style, 'player', shot.crit);
      bullets.push(b);
      spawned += 1;
    };

    if (level <= 1) {
      add(0, 0, 12, 'laser');
    } else if (level === 2) {
      add(-8, 0, 10, 'laser');
      add(8, 0, 10, 'laser');
    } else if (level === 3) {
      add(0, 0, 9, 'laser');
      add(-10, -150, 9, 'laser', 0.96);
      add(10, 150, 9, 'laser', 0.96);
    } else if (level === 4) {
      add(0, 0, 28, 'cannon', 0.85);
    } else {
      const fans = Math.min(5, 2 + Math.floor((level - 5) / 2));
      for (let i = -fans; i <= fans; i++) {
        add(i * 6, i * 28, level >= 8 ? 13 : 11, level >= 10 ? 'plasma' : 'laser', 1.04 + Math.abs(i) * 0.015);
      }
      if (level >= 6) {
        const extras = Math.min(4, level - 5);
        for (let n = 0; n < extras; n++) {
          const ox = (n - (extras - 1) / 2) * 7;
          add(ox, 0, 10, 'laser', 1.12);
        }
      }
    }
    return spawned;
  }

  private cue(level: number, audio: AudioManager): void {
    audio.play(level === 4 ? 'cannon' : 'laser');
  }
}

import { circleHit } from '../utils/collision.ts';
import type { Asteroid } from './Asteroid.ts';
import type { Hailstone } from './Hailstone.ts';
import type { Boss } from './Boss.ts';
import type { Bullet } from './Bullet.ts';
import type { Enemy } from './Enemy.ts';
import type { EnemyProjectile } from './EnemyProjectile.ts';
import type { Player } from './Player.ts';
import type { Coin } from './Coin.ts';
import type { PowerUp } from './PowerUp.ts';

export class CollisionSystem {
  bulletHitsEnemy(bullet: Bullet, enemy: Enemy): boolean {
    return circleHit(bullet.x, bullet.y, bullet.radius, enemy.x, enemy.y, enemy.radius);
  }

  bulletHitsBoss(bullet: Bullet, boss: Boss): boolean {
    return circleHit(bullet.x, bullet.y, bullet.radius, boss.x, boss.y, boss.radius);
  }

  bulletHitsAsteroid(bullet: Bullet, rock: Asteroid): boolean {
    return circleHit(bullet.x, bullet.y, bullet.radius, rock.x, rock.y, rock.radius);
  }

  bulletHitsHail(bullet: Bullet, hail: Hailstone): boolean {
    return circleHit(bullet.x, bullet.y, bullet.radius, hail.x, hail.y, hail.radius);
  }

  projectileHitsPlayer(shot: EnemyProjectile, player: Player): boolean {
    return circleHit(shot.x, shot.y, shot.radius, player.x, player.y, player.radius);
  }

  bodyHitsPlayer(x: number, y: number, radius: number, player: Player): boolean {
    return circleHit(x, y, radius, player.x, player.y, player.radius);
  }

  powerUpHitsPlayer(item: PowerUp, player: Player): boolean {
    return circleHit(item.x, item.y, item.radius, player.x, player.y, player.radius);
  }

  coinHitsPlayer(coin: Coin, player: Player): boolean {
    return circleHit(coin.x, coin.y, coin.radius, player.x, player.y, player.radius + 8);
  }
}

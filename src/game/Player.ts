import { GuardianId, PowerUpType } from '../types/game.ts';
import type { GuardianId as GuardianIdT, PowerUpType as PowerUpTypeT } from '../types/game.ts';
import { FORMATION, LOGICAL_HEIGHT, LOGICAL_WIDTH, PLAYER } from './constants.ts';
import type { ParticleSystem } from './Particle.ts';
import { clamp } from '../utils/random.ts';
import { leanTilt, squashScale, starBurst, type Mouth } from './cartoon.ts';
import { drawGuardianSprite } from '../assets/drawEntity.ts';

export class Player {
  x = PLAYER.startX;
  y = PLAYER.startY;
  vx = 0;
  vy = 0;
  health = PLAYER.maxHealth;
  maxHealth = PLAYER.maxHealth;
  shield = PLAYER.maxShield;
  maxShield = PLAYER.maxShield;
  movementSpeed = PLAYER.speed;
  weaponLevel = 1;
  fireRate = 7;
  fireCooldown = 0;
  specialEnergy = 0;
  invuln = 0;
  hitFlash = 0;
  /** Seconds left on the "buff gained" ring around the hero. */
  pickupFlash = 0;
  pickupType: PowerUpTypeT = PowerUpType.CLOVER;
  alive = true;
  rapidFire = 0;
  scoreMult = 0;
  radius = PLAYER.radius;
  destroyTimer = 0;
  age = 0;
  mood: Mouth = 'smile';
  moodTime = 0;
  guardian: GuardianIdT = GuardianId.AURELIA;
  baseFireRate = 7.2;
  damageMult = 1;
  coinMult = 1;
  energyMult = 1;
  xpMult = 1;
  bloomMagnet = false;
  magnetTime = 0;
  rushTime = 0;
  mushroomTime = 0;
  doubleShotTime = 0;
  freezeTime = 0;
  shadeTime = 0;
  hexCloneTime = 0;
  reviveLeft = 0;
  critChance = 0.08;
  critMult = 1.8;
  fragile = 1;
  usedAbility = false;

  reset(): void {
    this.x = PLAYER.startX;
    this.y = PLAYER.startY;
    this.vx = 0;
    this.vy = 0;
    this.movementSpeed = PLAYER.speed;
    this.health = this.maxHealth;
    this.shield = this.maxShield;
    this.weaponLevel = 1;
    this.fireRate = this.baseFireRate;
    this.fireCooldown = 0;
    this.specialEnergy = 40;
    this.invuln = 0;
    this.hitFlash = 0;
    this.pickupFlash = 0;
    this.alive = true;
    this.rapidFire = 0;
    this.scoreMult = 0;
    this.destroyTimer = 0;
    this.age = 0;
    this.mood = 'smile';
    this.moodTime = 0;
    this.magnetTime = 0;
    this.rushTime = 0;
    this.mushroomTime = 0;
    this.doubleShotTime = 0;
    this.freezeTime = 0;
    this.shadeTime = 0;
    this.hexCloneTime = 0;
    this.usedAbility = false;
    this.fragile = 1;
  }

  reactGrin(): void {
    this.mood = 'grin';
    this.moodTime = 0.45;
  }

  reactFire(): void {
    if (this.moodTime > 0 && this.mood === 'o') return;
    this.mood = 'smirk';
    this.moodTime = 0.16;
  }

  reactHit(): void {
    this.mood = 'shock';
    this.moodTime = 0.55;
  }

  magnetPull(): number {
    if (this.magnetTime > 0) return 920;
    if (this.bloomMagnet) return 420;
    return 220;
  }

  magnetDelay(): number {
    if (this.magnetTime > 0 || this.bloomMagnet) return 0.08;
    return 0.32;
  }

  shotDamage(base: number): number {
    const shade = this.shadeTime > 0 ? 2 : 1;
    return base * this.damageMult * shade;
  }

  rollShot(base: number): { damage: number; crit: boolean } {
    const crit = Math.random() < this.critChance * (this.shadeTime > 0 ? 2 : 1);
    return { damage: this.shotDamage(base) * (crit ? this.critMult : 1), crit };
  }

  update(
    dt: number,
    axisX: number,
    axisY: number,
    pointerAim: boolean,
    pointerX: number,
    pointerY: number,
    particles: ParticleSystem,
  ): void {
    if (!this.alive) {
      this.destroyTimer += dt;
      return;
    }

    if (pointerAim) {
      // Ease onto the cursor so the hero settles centered on it rather than
      // chasing at a fixed speed and stalling a few px short.
      const follow = dt > 0 ? (1 - Math.exp(-dt * FORMATION.pointerFollow)) / dt : 0;
      this.vx = (pointerX - this.x) * follow;
      this.vy = (pointerY - this.y) * follow;
    } else {
      this.vx = axisX * this.movementSpeed;
      this.vy = axisY * this.movementSpeed;
    }

    this.x = clamp(this.x + this.vx * dt, 24, LOGICAL_WIDTH - 24);
    this.y = clamp(this.y + this.vy * dt, PLAYER.minY, LOGICAL_HEIGHT - 36);
    this.age += dt;
    this.fireCooldown = Math.max(0, this.fireCooldown - dt);
    this.invuln = Math.max(0, this.invuln - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.pickupFlash = Math.max(0, this.pickupFlash - dt);
    this.rapidFire = Math.max(0, this.rapidFire - dt);
    this.scoreMult = Math.max(0, this.scoreMult - dt);
    this.magnetTime = Math.max(0, this.magnetTime - dt);
    this.rushTime = Math.max(0, this.rushTime - dt);
    this.mushroomTime = Math.max(0, this.mushroomTime - dt);
    this.doubleShotTime = Math.max(0, this.doubleShotTime - dt);
    this.freezeTime = Math.max(0, this.freezeTime - dt);
    this.shadeTime = Math.max(0, this.shadeTime - dt);
    this.hexCloneTime = Math.max(0, this.hexCloneTime - dt);
    this.moodTime = Math.max(0, this.moodTime - dt);
    if (this.moodTime <= 0) this.mood = 'smile';
    if (this.rushTime > 0) this.invuln = Math.max(this.invuln, 0.05);

    if (Math.random() < 0.55) {
      particles.emit(
        this.x + (Math.random() - 0.5) * 8,
        this.y + 16,
        (Math.random() - 0.5) * 20,
        60 + Math.random() * 30,
        [255, 220, 160],
        0.25,
        2.2,
      );
    }
  }

  currentFireRate(): number {
    const clover = this.weaponLevel >= 6 ? 1.15 : this.weaponLevel >= 4 ? 0.85 : 1;
    const base = this.baseFireRate * clover;
    return this.rapidFire > 0 || this.doubleShotTime > 0 || this.mushroomTime > 0 ? base * 1.35 : base;
  }

  tryFire(): boolean {
    if (!this.alive || this.fireCooldown > 0) return false;
    this.fireCooldown = 1 / this.currentFireRate();
    this.reactFire();
    return true;
  }

  upgradeWeapon(): void {
    this.weaponLevel = Math.min(12, this.weaponLevel + 1);
  }

  heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  addShield(amount: number): void {
    this.shield = Math.min(this.maxShield, this.shield + amount);
  }

  addEnergy(amount: number): void {
    this.specialEnergy = Math.min(PLAYER.specialCost, this.specialEnergy + amount * this.energyMult);
  }

  canSpecial(): boolean {
    return this.alive && this.specialEnergy >= PLAYER.specialCost;
  }

  consumeSpecial(): void {
    this.specialEnergy = 0;
    this.usedAbility = true;
    if (this.guardian === GuardianId.AURELIA) {
      this.heal(16);
      this.addShield(10);
    }
    if (this.guardian === GuardianId.KAIRO) {
      this.invuln = Math.max(this.invuln, 1.6);
      this.rushTime = Math.max(this.rushTime, 1.6);
    }
    if (this.guardian === GuardianId.NYXARA) {
      this.shadeTime = 3.2;
      this.invuln = Math.max(this.invuln, 3.2);
    }
    if (this.guardian === GuardianId.ELARA) {
      this.heal(28);
      this.addShield(22);
    }
    if (this.guardian === GuardianId.ORION) {
      this.hexCloneTime = 4;
    }
    if (this.guardian === GuardianId.VESPER) {
      this.freezeTime = 3.2;
      this.fragile = 1.35;
    }
  }

  tryRevive(): boolean {
    if (this.reviveLeft <= 0) return false;
    this.reviveLeft -= 1;
    this.alive = true;
    this.health = this.maxHealth * 0.5;
    this.invuln = 1.6;
    this.destroyTimer = 0;
    return true;
  }

  damage(amount: number): 'shield' | 'health' | 'dead' | 'ignored' | 'revived' {
    if (!this.alive || this.invuln > 0 || this.rushTime > 0) return 'ignored';
    this.hitFlash = 0.18;
    this.invuln = PLAYER.invulnTime;
    amount *= this.fragile;
    if (this.shield > 0) {
      this.shield = Math.max(0, this.shield - amount);
      if (this.shield > 0) return 'shield';
    } else {
      this.health -= amount;
    }
    if (this.health <= 0) {
      this.health = 0;
      if (this.tryRevive()) return 'revived';
      this.alive = false;
      return 'dead';
    }
    return 'health';
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.alive) return;
    const bob = Math.sin(this.age * 7) * 1.6;
    const scale = squashScale(this.hitFlash, this.vx);
    ctx.save();
    ctx.translate(this.x, this.y + bob);
    ctx.rotate(leanTilt(this.vx));
    ctx.scale(scale.sx, scale.sy);
    if (this.invuln > 0 && Math.floor(this.invuln * 16) % 2 === 0) ctx.globalAlpha = 0.45;
    const pose = !this.alive ? 'death' : this.hitFlash > 0 ? 'hit' : this.rushTime > 0 ? 'ability' : 'idle';
    drawGuardianSprite(ctx, this.guardian, this.radius * 2.8, pose);
    if (this.rushTime > 0) {
      ctx.strokeStyle = 'rgba(255,210,74,0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 2.15, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (this.shadeTime > 0) {
      ctx.strokeStyle = 'rgba(138,125,255,0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 1.95, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (this.shield > 0) {
      ctx.strokeStyle = 'rgba(126,200,255,0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 1.7, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (this.mood === 'shock') {
      starBurst(ctx, -6, -16, 5, '#ffe08a');
      starBurst(ctx, 14, -14, 4, '#fff');
    }
    ctx.restore();
  }
}

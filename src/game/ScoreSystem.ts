import { COMBO_THRESHOLDS } from './constants.ts';

export class ScoreSystem {
  score = 0;
  combo = 0;
  bestCombo = 0;
  enemiesDestroyed = 0;
  bossesDefeated = 0;
  shotsFired = 0;
  shotsHit = 0;
  levelScore = 0;
  levelKills = 0;
  levelShotsFired = 0;
  levelShotsHit = 0;

  resetRun(): void {
    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.enemiesDestroyed = 0;
    this.bossesDefeated = 0;
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.resetLevel();
  }

  resetLevel(): void {
    this.levelScore = 0;
    this.levelKills = 0;
    this.levelShotsFired = 0;
    this.levelShotsHit = 0;
  }

  multiplier(): number {
    if (this.combo >= COMBO_THRESHOLDS[3]) return 5;
    if (this.combo >= COMBO_THRESHOLDS[2]) return 4;
    if (this.combo >= COMBO_THRESHOLDS[1]) return 3;
    if (this.combo >= COMBO_THRESHOLDS[0]) return 2;
    return 1;
  }

  add(base: number, extraMult: number): number {
    const gained = Math.round(base * this.multiplier() * extraMult);
    this.score += gained;
    this.levelScore += gained;
    return gained;
  }

  registerKill(): void {
    this.combo += 1;
    this.enemiesDestroyed += 1;
    this.levelKills += 1;
    if (this.combo > this.bestCombo) this.bestCombo = this.combo;
  }

  resetCombo(): void {
    this.combo = 0;
  }

  accuracy(): number {
    if (this.shotsFired <= 0) return 0;
    return Math.min(1, this.shotsHit / this.shotsFired);
  }

  levelAccuracy(): number {
    if (this.levelShotsFired <= 0) return 0;
    return Math.min(1, this.levelShotsHit / this.levelShotsFired);
  }

  levelBonus(health: number, shield: number): number {
    const bonus = Math.round(health * 4 + shield * 3 + this.levelAccuracy() * 200 + this.combo * 20);
    this.score += bonus;
    return bonus;
  }
}

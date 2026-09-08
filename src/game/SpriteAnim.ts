export type AnimPose = 'idle' | 'attack' | 'hit' | 'ability' | 'death';

export class SpriteAnim {
  pose: AnimPose = 'idle';
  age = 0;
  private hold = 0;

  update(dt: number): void {
    this.age += dt;
    if (this.hold > 0) {
      this.hold -= dt;
      if (this.hold <= 0 && this.pose !== 'death') this.pose = 'idle';
    }
  }

  play(pose: AnimPose, seconds = 0.22): void {
    this.pose = pose;
    this.hold = seconds;
  }

  current(hitFlash: number, attacking: boolean, dead = false): AnimPose {
    if (dead) return 'death';
    if (this.hold > 0) return this.pose;
    if (hitFlash > 0) return 'hit';
    if (attacking) return 'attack';
    return 'idle';
  }
}

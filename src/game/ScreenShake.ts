import { randRange } from '../utils/random.ts';

export class ScreenShake {
  private trauma = 0;
  enabled = true;

  trigger(amount: number): void {
    if (!this.enabled) return;
    this.trauma = Math.min(1, this.trauma + amount);
  }

  update(dt: number): void {
    this.trauma = Math.max(0, this.trauma - dt * 2.4);
  }

  offset(): { x: number; y: number } {
    if (this.trauma <= 0.001) return { x: 0, y: 0 };
    const mag = this.trauma * this.trauma * 18;
    return { x: randRange(-mag, mag), y: randRange(-mag, mag) };
  }

  reset(): void {
    this.trauma = 0;
  }
}

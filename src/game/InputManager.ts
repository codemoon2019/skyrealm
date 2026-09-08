import { clamp } from '../utils/random.ts';

export class InputManager {
  up = false;
  down = false;
  left = false;
  right = false;
  fire = false;
  pointerAim = false;
  pointerX = 0;
  pointerY = 0;
  virtualX = 0;
  virtualY = 0;
  private specialLatch = false;
  private pauseLatch = false;
  private specialQueued = false;
  private pauseQueued = false;

  attach(target: Window): () => void {
    const onKeyDown = (event: KeyboardEvent) => {
      this.applyKey(event.code, true);
      if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'ArrowDown') {
        event.preventDefault();
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      this.applyKey(event.code, false);
    };
    const onBlur = () => this.releaseAll();
    target.addEventListener('keydown', onKeyDown);
    target.addEventListener('keyup', onKeyUp);
    target.addEventListener('blur', onBlur);
    return () => {
      target.removeEventListener('keydown', onKeyDown);
      target.removeEventListener('keyup', onKeyUp);
      target.removeEventListener('blur', onBlur);
    };
  }

  setVirtualAxis(x: number, y: number): void {
    this.virtualX = clamp(x, -1, 1);
    this.virtualY = clamp(y, -1, 1);
  }

  setVirtualFire(down: boolean): void {
    this.fire = down || this.fireHeldByKey;
  }

  setPointer(x: number, y: number, active: boolean): void {
    this.pointerX = x;
    this.pointerY = y;
    this.pointerAim = active;
  }

  queueSpecial(): void {
    this.specialQueued = true;
  }

  queuePause(): void {
    this.pauseQueued = true;
  }

  axis(): { x: number; y: number } {
    let x = this.virtualX;
    let y = this.virtualY;
    if (this.left) x -= 1;
    if (this.right) x += 1;
    if (this.up) y -= 1;
    if (this.down) y += 1;
    const mag = Math.hypot(x, y);
    if (mag > 1) {
      x /= mag;
      y /= mag;
    }
    return { x, y };
  }

  consumeSpecial(): boolean {
    if (this.specialQueued) {
      this.specialQueued = false;
      return true;
    }
    return false;
  }

  consumePause(): boolean {
    if (this.pauseQueued) {
      this.pauseQueued = false;
      return true;
    }
    return false;
  }

  releaseAll(): void {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.fire = false;
    this.pointerAim = false;
    this.virtualX = 0;
    this.virtualY = 0;
    this.fireHeldByKey = false;
  }

  private fireHeldByKey = false;

  private applyKey(code: string, down: boolean): void {
    switch (code) {
      case 'ArrowUp':
      case 'KeyW':
        this.up = down;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.down = down;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.left = down;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.right = down;
        break;
      case 'Space':
        this.fireHeldByKey = down;
        this.fire = down || this.pointerAim;
        break;
      case 'KeyE':
        if (down && !this.specialLatch) this.specialQueued = true;
        this.specialLatch = down;
        break;
      case 'KeyP':
      case 'Escape':
        if (down && !this.pauseLatch) this.pauseQueued = true;
        this.pauseLatch = down;
        break;
      default:
        break;
    }
  }
}

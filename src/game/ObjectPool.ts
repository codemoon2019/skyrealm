export class ObjectPool<T> {
  private readonly free: T[] = [];
  private created = 0;
  private readonly factory: () => T;
  private readonly reset: (item: T) => void;
  private readonly max: number;

  constructor(factory: () => T, reset: (item: T) => void, max: number) {
    this.factory = factory;
    this.reset = reset;
    this.max = max;
  }

  acquire(): T | null {
    const recycled = this.free.pop();
    if (recycled) return recycled;
    if (this.created >= this.max) return null;
    this.created += 1;
    return this.factory();
  }

  release(item: T): void {
    this.reset(item);
    this.free.push(item);
  }

  releaseAll(items: T[]): void {
    for (const item of items) this.release(item);
    items.length = 0;
  }
}

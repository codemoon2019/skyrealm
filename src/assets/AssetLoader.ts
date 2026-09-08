import { hangarBootUrls, SKIP_SHEET_URLS } from './assetManifest.ts';

const DEV = import.meta.env.DEV;

export class AssetLoader {
  private readonly images = new Map<string, HTMLImageElement | HTMLCanvasElement>();
  private readonly failed = new Set<string>();
  private readonly inflight = new Map<string, Promise<void>>();
  private readonly readyFns = new Set<() => void>();
  private readonly progressFns = new Set<() => void>();
  private readonly chromaQ: Array<{ url: string; img: HTMLImageElement; done: () => void }> = [];
  private chromaBusy = false;
  private loaded = 0;
  private total = 0;

  get progress(): number {
    return this.total <= 0 ? 0 : this.loaded / this.total;
  }

  has(url: string): boolean {
    return this.images.has(url);
  }

  get(url: string): HTMLImageElement | HTMLCanvasElement | null {
    return this.images.get(url) ?? null;
  }

  async loadCritical(): Promise<void> {
    await this.load(hangarBootUrls());
  }

  async load(urls: readonly string[]): Promise<void> {
    const jobs: Promise<void>[] = [];
    for (const url of new Set(urls)) {
      if (this.images.has(url) || this.failed.has(url)) continue;
      let job = this.inflight.get(url);
      if (!job) {
        this.total += 1;
        job = this.fetchOne(url).finally(() => this.inflight.delete(url));
        this.inflight.set(url, job);
      }
      jobs.push(job);
    }
    this.emitProgress();
    await Promise.all(jobs);
    this.emitReady();
  }

  onReady(fn: () => void): () => void {
    this.readyFns.add(fn);
    return () => {
      this.readyFns.delete(fn);
    };
  }

  onProgress(fn: () => void): () => void {
    this.progressFns.add(fn);
    return () => {
      this.progressFns.delete(fn);
    };
  }

  private emitReady(): void {
    for (const fn of this.readyFns) fn();
  }

  private emitProgress(): void {
    for (const fn of this.progressFns) fn();
  }

  private markLoaded(): void {
    this.loaded += 1;
    this.emitProgress();
  }

  draw(ctx: CanvasRenderingContext2D, url: string, size: number): boolean {
    const img = this.images.get(url);
    if (!img) return false;
    const w = 'naturalWidth' in img ? img.naturalWidth || img.width : img.width;
    const h = 'naturalHeight' in img ? img.naturalHeight || img.height : img.height;
    if (!w || !h) return false;
    const scale = size / Math.max(w, h);
    const dw = w * scale;
    const dh = h * scale;
    ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    return true;
  }

  drawCover(ctx: CanvasRenderingContext2D, url: string, x: number, y: number, w: number, h: number, alpha = 1): boolean {
    const img = this.images.get(url);
    if (!img) return false;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
    return true;
  }

  private fetchOne(url: string): Promise<void> {
    return new Promise((resolve) => {
      if (SKIP_SHEET_URLS.has(url)) {
        this.failed.add(url);
        this.markLoaded();
        resolve();
        return;
      }
      const img = new Image();
      img.decoding = 'async';
      img.fetchPriority = 'low';
      img.onload = () => {
        this.markLoaded();
        if (needsChroma(url)) {
          this.enqueueChroma(url, img, resolve);
          return;
        }
        this.images.set(url, img);
        resolve();
      };
      img.onerror = () => {
        this.failed.add(url);
        this.markLoaded();
        if (DEV) console.warn(`[SKYREALM] missing asset ${url}`);
        resolve();
      };
      img.src = url;
    });
  }

  private enqueueChroma(url: string, img: HTMLImageElement, done: () => void): void {
    this.chromaQ.push({ url, img, done });
    this.pumpChroma();
  }

  private pumpChroma(): void {
    if (this.chromaBusy) return;
    if (this.chromaQ.length === 0) return;
    this.chromaBusy = true;
    requestAnimationFrame(() => {
      const batch = this.chromaQ.splice(0, 4);
      for (const next of batch) {
        this.images.set(next.url, this.chroma(next.img));
        next.done();
      }
      this.chromaBusy = false;
      this.pumpChroma();
    });
  }

  private chroma(img: HTMLImageElement): HTMLCanvasElement | HTMLImageElement {
    try {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth || img.width;
      c.height = img.naturalHeight || img.height;
      if (c.width < 2 || c.height < 2) return img;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      if (!ctx) return img;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height);
      const px = data.data;
      let keyed = 0;
      for (let i = 0; i < px.length; i += 4) {
        const r = px[i]!;
        const g = px[i + 1]!;
        const b = px[i + 2]!;
        if (g >= 150 && r <= 110 && b <= 110 && g - r >= 55 && g - b >= 55) {
          px[i + 3] = 0;
          keyed += 1;
        }
      }
      if (keyed < 20) return img;
      ctx.putImageData(data, 0, 0);
      return c;
    } catch {
      return img;
    }
  }
}

function needsChroma(url: string): boolean {
  return !url.includes('/environments/') && !url.includes('/ui/logo') && !url.includes('/ui/style_bible');
}

export const assets = new AssetLoader();

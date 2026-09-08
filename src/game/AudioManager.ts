/** Semitones above the root for each step of a coin streak, then it holds. */
const COIN_LADDER = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24] as const;

/** CC0: Once Upon a Time (TAD) and Fairy Adventure (MintoDog) via OpenGameArt. */
const BEDS = {
  hangar: '/audio/once_upon_a_time.mp3',
  flight: '/audio/fairy_adventure.ogg',
} as const;

const MUSIC_VOLUME = 0.2;

export type MusicBed = keyof typeof BEDS | 'none';

export class AudioManager {
  soundEnabled = true;
  musicEnabled = true;
  private ctx: AudioContext | null = null;
  private sfx: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private wanted: MusicBed = 'hangar';
  private playing: MusicBed = 'none';
  private source: AudioBufferSourceNode | null = null;
  private readonly buffers = new Map<string, AudioBuffer>();
  private bedsJob: Promise<void> | null = null;

  unlock(): void {
    const ctx = this.ensure();
    if (ctx.state === 'suspended') void ctx.resume();
    void this.loadBeds();
    this.applyBed();
  }

  setSound(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  setMusic(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (this.musicGain) this.musicGain.gain.value = enabled ? MUSIC_VOLUME : 0;
    if (enabled) this.applyBed();
    else this.stopSource();
  }

  setBed(bed: MusicBed): void {
    this.wanted = bed;
    this.applyBed();
  }

  update(_dt: number): void {
    // File beds loop on their own; the old generated scale is gone.
  }

  play(name: SfxName): void {
    if (!this.soundEnabled) return;
    this.unlock();
    switch (name) {
      case 'laser':
        this.tone(740, 0.07, 'square', 0.05);
        break;
      case 'cannon':
        this.tone(180, 0.12, 'sawtooth', 0.07);
        this.tone(90, 0.16, 'sine', 0.05);
        break;
      case 'hit':
        this.tone(210, 0.05, 'triangle', 0.05);
        break;
      case 'explode':
        this.noise(0.18, 0.08);
        this.tone(90, 0.2, 'sawtooth', 0.06);
        break;
      case 'powerup':
        this.tone(520, 0.08, 'square', 0.05);
        this.tone(780, 0.1, 'square', 0.04, undefined, 0.06);
        break;
      case 'playerHit':
        this.tone(140, 0.14, 'sawtooth', 0.08);
        this.noise(0.12, 0.06);
        break;
      case 'shield':
        this.tone(420, 0.1, 'triangle', 0.05);
        break;
      case 'warning':
        this.tone(311, 0.22, 'square', 0.07);
        this.tone(220, 0.22, 'square', 0.05, undefined, 0.12);
        break;
      case 'bossAttack':
        this.tone(70, 0.16, 'sawtooth', 0.07);
        break;
      case 'special':
        this.noise(0.28, 0.12);
        this.tone(60, 0.3, 'sine', 0.1);
        this.tone(180, 0.2, 'triangle', 0.06);
        break;
      case 'bossExplode':
        this.noise(0.5, 0.16);
        this.tone(48, 0.45, 'sawtooth', 0.1);
        break;
      case 'menu':
        this.tone(660, 0.06, 'square', 0.04);
        break;
      case 'countdown':
        this.tone(440, 0.1, 'triangle', 0.06);
        break;
      case 'go':
        this.tone(660, 0.16, 'triangle', 0.07);
        break;
      case 'clear':
        this.tone(392, 0.12, 'triangle', 0.07);
        this.tone(523, 0.14, 'triangle', 0.06, undefined, 0.1);
        this.tone(784, 0.22, 'triangle', 0.08, undefined, 0.2);
        break;
      case 'crit':
        this.tone(880, 0.08, 'square', 0.06);
        this.tone(1320, 0.1, 'triangle', 0.05, undefined, 0.04);
        break;
      case 'egg':
        this.tone(300, 0.1, 'sine', 0.05);
        this.tone(500, 0.12, 'square', 0.05, undefined, 0.08);
        this.tone(760, 0.16, 'triangle', 0.06, undefined, 0.16);
        break;
      case 'evo':
        this.tone(220, 0.2, 'sawtooth', 0.06);
        this.tone(440, 0.22, 'triangle', 0.07, undefined, 0.1);
        this.tone(880, 0.28, 'sine', 0.06, undefined, 0.22);
        break;
      case 'levelup':
        this.tone(523, 0.12, 'triangle', 0.06);
        this.tone(659, 0.14, 'triangle', 0.06, undefined, 0.1);
        this.tone(784, 0.2, 'triangle', 0.07, undefined, 0.2);
        break;
      default:
        break;
    }
  }

  /**
   * Coin pickup, climbing a pentatonic ladder with the player's streak so a
   * sweep of treasure rings upwards before settling at the top of the run.
   */
  coin(step: number): void {
    if (!this.soundEnabled) return;
    this.unlock();
    const base = 784 * Math.pow(2, COIN_LADDER[Math.min(step, COIN_LADDER.length - 1)]! / 12);
    this.tone(base, 0.07, 'triangle', 0.045);
    this.tone(base * 1.5, 0.09, 'triangle', 0.035, undefined, 0.045);
  }

  destroy(): void {
    this.stopSource();
    void this.ctx?.close();
    this.ctx = null;
    this.sfx = null;
    this.musicGain = null;
  }

  private ensure(): AudioContext {
    if (this.ctx) return this.ctx;
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0.7;
    master.connect(ctx.destination);
    const sfx = ctx.createGain();
    sfx.gain.value = 1;
    sfx.connect(master);
    const musicGain = ctx.createGain();
    musicGain.gain.value = this.musicEnabled ? MUSIC_VOLUME : 0;
    musicGain.connect(master);
    this.ctx = ctx;
    this.sfx = sfx;
    this.musicGain = musicGain;
    void this.loadBeds();
    return ctx;
  }

  private loadBeds(): Promise<void> {
    if (this.bedsJob) return this.bedsJob;
    const ctx = this.ensure();
    this.bedsJob = Promise.all(
      (Object.keys(BEDS) as Array<keyof typeof BEDS>).map(async (id) => {
        const res = await fetch(BEDS[id]);
        if (!res.ok) throw new Error(`music ${id} ${res.status}`);
        const raw = await res.arrayBuffer();
        const buf = await ctx.decodeAudioData(raw.slice(0));
        this.buffers.set(id, buf);
      }),
    )
      .then(() => {
        this.applyBed();
      })
      .catch((err) => {
        this.bedsJob = null;
        if (import.meta.env.DEV) console.warn('[SKYREALM] music bed failed', err);
      });
    return this.bedsJob;
  }

  private applyBed(): void {
    if (!this.ctx || !this.musicGain || !this.musicEnabled) return;
    if (this.wanted === 'none') {
      this.stopSource();
      return;
    }
    const buf = this.buffers.get(this.wanted);
    if (!buf) {
      void this.loadBeds();
      return;
    }
    if (this.playing === this.wanted && this.source) return;
    this.stopSource();
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.connect(this.musicGain);
    src.start();
    this.source = src;
    this.playing = this.wanted;
  }

  private stopSource(): void {
    try {
      this.source?.stop();
    } catch {
      // already stopped
    }
    this.source?.disconnect();
    this.source = null;
    this.playing = 'none';
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    dest?: GainNode | null,
    delay = 0,
  ): void {
    const ctx = this.ctx;
    const out = dest ?? this.sfx;
    if (!ctx || !out) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t = ctx.currentTime + delay;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(out);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  private noise(duration: number, volume: number): void {
    const ctx = this.ctx;
    const out = this.sfx;
    if (!ctx || !out) return;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(out);
    src.start();
  }
}

export type SfxName =
  | 'laser'
  | 'cannon'
  | 'hit'
  | 'explode'
  | 'powerup'
  | 'playerHit'
  | 'shield'
  | 'warning'
  | 'bossAttack'
  | 'special'
  | 'bossExplode'
  | 'menu'
  | 'countdown'
  | 'go'
  | 'clear'
  | 'crit'
  | 'egg'
  | 'evo'
  | 'levelup';

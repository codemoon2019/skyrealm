import { EnemyType, WorldId } from '../../types/game.ts';
import type { EnemyType as En, WorldId as W } from '../../types/game.ts';
import { LOGICAL_WIDTH } from '../constants.ts';

export type FormationKind =
  | 'vee'
  | 'arc'
  | 'line'
  | 'columns'
  | 'diamond'
  | 'petal'
  | 'sine'
  | 'ring'
  | 'wedge'
  | 'spiral';

export interface WavePiece {
  kind: FormationKind;
  type: En;
  count: number;
  banner: string;
}

export interface FormationSlot {
  x: number;
  y: number;
  phase: number;
}

export const WORLD_WAVES: Record<W, readonly WavePiece[]> = {
  [WorldId.MEADOWS]: [
    { kind: 'petal', type: EnemyType.SWARM, count: 10, banner: 'PETAL WALTZ' },
    { kind: 'sine', type: EnemyType.SPORE, count: 8, banner: 'SEED DRIFT' },
    { kind: 'vee', type: EnemyType.SCOUT, count: 7, banner: 'SWALLOW VEE' },
    { kind: 'arc', type: EnemyType.AETHER_TICK, count: 9, banner: 'TICK CRESCENT' },
  ],
  [WorldId.CRYSTAL_FOREST]: [
    { kind: 'diamond', type: EnemyType.DRONE, count: 8, banner: 'CRYSTAL LATTICE' },
    { kind: 'ring', type: EnemyType.ZIGZAG, count: 8, banner: 'PRISM RING' },
    { kind: 'line', type: EnemyType.MAGE, count: 5, banner: 'RUNE ROW' },
    { kind: 'wedge', type: EnemyType.DRONE, count: 7, banner: 'SHARD WEDGE' },
  ],
  [WorldId.EMBER_CANYON]: [
    { kind: 'wedge', type: EnemyType.KAMIKAZE, count: 7, banner: 'EMBER ARROW' },
    { kind: 'line', type: EnemyType.BOMBER, count: 5, banner: 'CINDER ROW' },
    { kind: 'vee', type: EnemyType.SCOUT, count: 7, banner: 'HEAT VEE' },
    { kind: 'columns', type: EnemyType.BOMBER, count: 6, banner: 'TWIN FURNACES' },
  ],
  [WorldId.FROZEN_SKIES]: [
    { kind: 'line', type: EnemyType.FLYER, count: 7, banner: 'FROST PARADE' },
    { kind: 'columns', type: EnemyType.CRAWLER, count: 8, banner: 'TWIN FLOES' },
    { kind: 'arc', type: EnemyType.SWARM, count: 9, banner: 'SNOW CRESCENT' },
    { kind: 'sine', type: EnemyType.FLYER, count: 8, banner: 'ICE RIBBON' },
  ],
  [WorldId.SHADOW_REALM]: [
    { kind: 'columns', type: EnemyType.VOID_BAT, count: 8, banner: 'NIGHT COLUMNS' },
    { kind: 'arc', type: EnemyType.BONE_WISP, count: 8, banner: 'BONE CRESCENT' },
    { kind: 'sine', type: EnemyType.VOID_BAT, count: 8, banner: 'VEIL RIBBON' },
    { kind: 'wedge', type: EnemyType.KAMIKAZE, count: 6, banner: 'SHADE ARROW' },
  ],
  [WorldId.STORM_KINGDOM]: [
    { kind: 'sine', type: EnemyType.FLYER, count: 8, banner: 'STORM RIBBON' },
    { kind: 'vee', type: EnemyType.BOMBER, count: 7, banner: 'THUNDER VEE' },
    { kind: 'ring', type: EnemyType.MAGE, count: 6, banner: 'GALE HALO' },
    { kind: 'line', type: EnemyType.FLYER, count: 7, banner: 'CLOUD LINE' },
  ],
  [WorldId.CELESTIAL_RUINS]: [
    { kind: 'ring', type: EnemyType.TANK, count: 5, banner: 'RUIN HALO' },
    { kind: 'diamond', type: EnemyType.TANK, count: 6, banner: 'WARD DIAMOND' },
    { kind: 'arc', type: EnemyType.ELITE, count: 4, banner: 'AUREOLE' },
    { kind: 'vee', type: EnemyType.TANK, count: 5, banner: 'RELIC VEE' },
  ],
  [WorldId.VOID_FRONTIER]: [
    { kind: 'spiral', type: EnemyType.KAMIKAZE, count: 8, banner: 'VOID COIL' },
    { kind: 'wedge', type: EnemyType.MAGE, count: 6, banner: 'HEX WEDGE' },
    { kind: 'ring', type: EnemyType.MAGE, count: 6, banner: 'NULL RING' },
    { kind: 'sine', type: EnemyType.KAMIKAZE, count: 7, banner: 'RIFT RIBBON' },
  ],
};

export function formationSlots(kind: FormationKind, count: number): FormationSlot[] {
  const mid = LOGICAL_WIDTH * 0.5;
  const top = -40;
  const n = Math.max(1, count);
  const slots: FormationSlot[] = [];

  if (kind === 'line') {
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      slots.push({ x: 58 + t * (LOGICAL_WIDTH - 116), y: top, phase: i * 0.45 });
    }
    return clampSlots(slots);
  }

  if (kind === 'vee' || kind === 'wedge') {
    const step = kind === 'wedge' ? 32 : 38;
    const drop = kind === 'wedge' ? 22 : 26;
    slots.push({ x: mid, y: top, phase: 0 });
    for (let i = 1; slots.length < n; i++) {
      slots.push({ x: mid - i * step, y: top - i * drop, phase: i * 0.35 });
      if (slots.length < n) slots.push({ x: mid + i * step, y: top - i * drop, phase: i * 0.35 });
    }
    return clampSlots(slots.slice(0, n));
  }

  if (kind === 'arc') {
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const a = Math.PI * (0.18 + t * 0.64);
      slots.push({
        x: mid + Math.cos(a) * 190,
        y: top - 20 + Math.sin(a) * 70,
        phase: i * 0.4,
      });
    }
    return clampSlots(slots);
  }

  if (kind === 'columns') {
    const left = LOGICAL_WIDTH * 0.28;
    const right = LOGICAL_WIDTH * 0.72;
    for (let i = 0; i < n; i++) {
      const col = i % 2 === 0 ? left : right;
      const row = Math.floor(i / 2);
      slots.push({ x: col, y: top - row * 36, phase: row * 0.5 });
    }
    return clampSlots(slots);
  }

  if (kind === 'diamond') {
    const ring = [
      [0, -70],
      [-70, -20],
      [70, -20],
      [0, 30],
      [-40, -46],
      [40, -46],
      [-40, 6],
      [40, 6],
    ] as const;
    for (let i = 0; i < n; i++) {
      const [ox, oy] = ring[i % ring.length]!;
      slots.push({ x: mid + ox, y: top + oy, phase: i * 0.3 });
    }
    return clampSlots(slots);
  }

  if (kind === 'petal') {
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x = mid + Math.sin(a) ** 3 * 120;
      const y = top - 36 + (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a)) * 4.2;
      slots.push({ x, y, phase: a });
    }
    return clampSlots(slots);
  }

  if (kind === 'sine') {
    for (let i = 0; i < n; i++) {
      slots.push({
        x: mid + Math.sin(i * 0.85) * 150,
        y: top - i * 30,
        phase: i * 0.55,
      });
    }
    return clampSlots(slots);
  }

  if (kind === 'ring') {
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n - Math.PI / 2;
      slots.push({
        x: mid + Math.cos(a) * 108,
        y: top - 70 + Math.sin(a) * 62,
        phase: a,
      });
    }
    return clampSlots(slots);
  }

  for (let i = 0; i < n; i++) {
    const a = i * 0.72;
    const rad = 22 + i * 14;
    slots.push({
      x: mid + Math.cos(a) * rad,
      y: top - 36 + Math.sin(a) * rad * 0.55 - i * 12,
      phase: a,
    });
  }
  return clampSlots(slots);
}

function clampSlots(slots: FormationSlot[]): FormationSlot[] {
  const minX = 42;
  const maxX = LOGICAL_WIDTH - 42;
  for (const s of slots) s.x = Math.max(minX, Math.min(maxX, s.x));
  return slots;
}

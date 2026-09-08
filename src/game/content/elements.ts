import { ElementId } from '../../types/game.ts';
import type { ElementId as El } from '../../types/game.ts';

export const ELEMENT_LIST = [
  ElementId.FIRE,
  ElementId.WATER,
  ElementId.NATURE,
  ElementId.SHADOW,
  ElementId.LIGHT,
  ElementId.ARCANE,
] as const;

export const ELEMENT_COLOR: Record<El, string> = {
  [ElementId.FIRE]: '#ff6b4a',
  [ElementId.WATER]: '#3df0ff',
  [ElementId.NATURE]: '#7dff9a',
  [ElementId.SHADOW]: '#8a7dff',
  [ElementId.LIGHT]: '#ffe08a',
  [ElementId.ARCANE]: '#ff7ad9',
};

const BEATS: Partial<Record<El, El>> = {
  [ElementId.FIRE]: ElementId.NATURE,
  [ElementId.NATURE]: ElementId.WATER,
  [ElementId.WATER]: ElementId.FIRE,
  [ElementId.LIGHT]: ElementId.SHADOW,
  [ElementId.SHADOW]: ElementId.LIGHT,
};

export function elementMult(from: El, to: El): number {
  if (from === ElementId.ARCANE || to === ElementId.ARCANE) return 1;
  if (BEATS[from] === to) return 1.35;
  if (BEATS[to] === from) return 0.75;
  return 1;
}

export function weaknessOf(el: El): El | null {
  for (const [atk, def] of Object.entries(BEATS)) {
    if (def === el) return atk as El;
  }
  return null;
}

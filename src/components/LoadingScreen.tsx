import { BRAND } from '../brand.ts';
import { BrandMark } from './BrandMark.tsx';

interface Props {
  progress: number;
}

const LORE = [
  { at: 0, line: 'The isles stir in the morning light…' },
  { at: 0.22, line: 'Guardians wake upon the wind…' },
  { at: 0.48, line: 'Aetherlings gather at the gate…' },
  { at: 0.72, line: 'The old story turns a golden page…' },
  { at: 0.92, line: 'The Aether opens.' },
] as const;

function loreFor(progress: number): string {
  let line: string = LORE[0].line;
  for (const step of LORE) {
    if (progress >= step.at) line = step.line;
  }
  return line;
}

export function LoadingScreen({ progress }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)));
  return (
    <div className="overlay overlay-menu overlay-home">
      <div className="menu-frame load-gate">
        <div className="load-sparkles" aria-hidden="true">
          <span className="load-petal load-petal-a" />
          <span className="load-petal load-petal-b" />
          <span className="load-petal load-petal-c" />
          <span className="load-spark load-spark-a" />
          <span className="load-spark load-spark-b" />
          <span className="load-spark load-spark-c" />
        </div>
        <div className="load-card">
          <BrandMark size={108} />
          <p className="eyebrow">{BRAND.subtitle}</p>
          <h1 className="title-xl">{BRAND.name}</h1>
          <p className="load-lore">{loreFor(progress)}</p>
          <div
            className="load-well"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label="Loading"
          >
            <div className="load-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="load-pct">{pct}%</p>
        </div>
      </div>
    </div>
  );
}

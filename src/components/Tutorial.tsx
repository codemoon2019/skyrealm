interface Props {
  step: number;
  onNext: () => void;
}

const BEATS = [
  { title: 'MOVE', body: 'Drag on the sky, or use WASD / arrows. Your Guardian stays under your finger.' },
  { title: 'ATTACK', body: 'Auto-fire never stops. Clover pickups raise attack level. E spends special energy.' },
  { title: 'AETHERLINGS', body: 'Two companions follow and fight on their own. Hatch eggs in EGGS, then equip them in AETHERLINGS.' },
  { title: 'BOSS', body: 'A realm boss arrives with a shown weakness. Match elements, then bank the loot.' },
];

export function Tutorial({ step, onNext }: Props) {
  const beat = BEATS[Math.min(step, BEATS.length - 1)]!;
  const last = step >= BEATS.length - 1;
  return (
    <div className="overlay">
      <div className="panel">
        <p className="eyebrow">FIRST FLIGHT</p>
        <h2>{beat.title}</h2>
        <p className="hangar-blurb">{beat.body}</p>
        <button type="button" className="ns-btn ns-btn-primary" onClick={onNext}>
          {last ? 'TAKE FLIGHT' : 'NEXT'}
        </button>
      </div>
    </div>
  );
}

export const TUTORIAL_STEPS = BEATS.length;

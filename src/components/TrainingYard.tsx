import type { SaveGame } from '../types/game.ts';
import { HangarChrome } from './HangarChrome.tsx';

interface Props {
  save: SaveGame;
  onStart: () => void;
  onBack: () => void;
}

export function TrainingYard({ save, onStart, onBack }: Props) {
  return (
    <HangarChrome title="TRAINING" save={save} onBack={onBack} wide={false}>
      <p className="subhead">Dummy foes. No coins, eggs, or trophies. Test damage, elements, and abilities.</p>
      <div className="menu-actions">
        <button type="button" className="ns-btn ns-btn-primary" onClick={onStart}>
          ENTER YARD
        </button>
      </div>
    </HangarChrome>
  );
}

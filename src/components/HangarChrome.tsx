import type { ReactNode } from 'react';
import type { SaveGame } from '../types/game.ts';

interface Props {
  title: string;
  save: SaveGame;
  onBack: () => void;
  notice?: string;
  children: ReactNode;
  wide?: boolean;
}

export function HangarChrome({ title, save, onBack, notice, children, wide = true }: Props) {
  return (
    <div className="overlay">
      <div className={`panel hangar-panel${wide ? ' panel-wide' : ''}`}>
        <div className="hangar-chrome">
          <button type="button" className="ns-btn hangar-back" onClick={onBack}>
            BACK
          </button>
          <h2>{title}</h2>
          <p className="hangar-bank">
            COINS {Math.round(save.profile.coins).toLocaleString()} · CRYSTALS {Math.round(save.profile.crystals).toLocaleString()} · ENERGY {Math.round(save.profile.bossEnergy).toLocaleString()}
          </p>
        </div>
        {notice && <p className="hangar-note">{notice}</p>}
        {children}
      </div>
    </div>
  );
}

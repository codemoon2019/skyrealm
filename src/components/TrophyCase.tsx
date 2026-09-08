import type { SaveGame } from '../types/game.ts';
import { ACHIEVEMENTS } from '../services/GameSession.ts';
import { HangarChrome } from './HangarChrome.tsx';

interface Props {
  save: SaveGame;
  onBack: () => void;
}

export function TrophyCase({ save, onBack }: Props) {
  return (
    <HangarChrome title="ACHIEVEMENTS" save={save} onBack={onBack}>
        <ul className="hangar-list">
          {ACHIEVEMENTS.map((a) => (
            <li key={a.id} className="hangar-item">
              <div>
                <strong>{save.achievements[a.id] ? '✓ ' : ''}{a.name}</strong>
                <span>{a.blurb}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="hud-label">DAILY MISSIONS</p>
        <ul className="hangar-list">
          {save.daily.missions.map((m) => (
            <li key={m.id} className="hangar-item">
              <div>
                <strong>{m.done ? '✓ ' : ''}{m.label}</strong>
                <span>{m.have}/{m.need}</span>
              </div>
            </li>
          ))}
        </ul>
    </HangarChrome>
  );
}

import type { SaveGame } from '../types/game.ts';
import { QUEST_DEFS } from '../game/content/quests.ts';
import { HangarChrome } from './HangarChrome.tsx';

interface Props {
  save: SaveGame;
  notice: string;
  now: number;
  onStart: (id: string) => void;
  onClaim: (id: string) => void;
  onBack: () => void;
}

export function QuestBoard({ save, notice, now, onStart, onClaim, onBack }: Props) {
  return (
    <HangarChrome title="QUESTS" save={save} notice={notice} onBack={onBack}>
      <p className="hangar-blurb">Send a party on a timer. Come back to claim coins, crystals, and a chance at an egg. This is not a flight.</p>
      <ul className="hangar-list">
        {QUEST_DEFS.map((q) => {
          const active = save.quests.find((item) => item.defId === q.id);
          const ready = active && now >= active.endsAt;
          const left = active ? Math.max(0, Math.ceil((active.endsAt - now) / 1000)) : 0;
          return (
            <li key={q.id} className="hangar-item">
              <div>
                <strong>{q.name}</strong>
                <span>
                  {q.minutes} min · {q.coins} coins · {q.crystals} crystals · egg {Math.round(q.eggChance * 100)}%
                </span>
                {active && <span>{ready ? 'READY TO CLAIM' : `${left}s remaining`}</span>}
              </div>
              {active ? (
                <button type="button" className="ns-btn ns-btn-primary" onClick={() => onClaim(active.id)} disabled={!ready}>
                  CLAIM
                </button>
              ) : (
                <button type="button" className="ns-btn" onClick={() => onStart(q.id)}>
                  SEND ON QUEST
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </HangarChrome>
  );
}

import { GuardianId } from '../types/game.ts';
import type { SaveGame } from '../types/game.ts';
import { GUARDIAN_LIST, GUARDIAN_META, guardianXpNeed } from '../game/content/guardians.ts';
import { drawGuardianSprite } from '../assets/drawEntity.ts';
import { HangarChrome } from './HangarChrome.tsx';
import { PortraitCanvas } from './PortraitCanvas.tsx';

interface Props {
  save: SaveGame;
  notice: string;
  onPick: (id: (typeof GuardianId)[keyof typeof GuardianId]) => void;
  onBack: () => void;
}

export function GuardianHall({ save, notice, onPick, onBack }: Props) {
  return (
    <HangarChrome title="GUARDIANS" save={save} notice={notice} onBack={onBack}>
      <div className="guardian-grid">
        {GUARDIAN_LIST.map((id) => {
          const def = GUARDIAN_META[id];
          const own = save.guardians[id];
          return (
            <button
              key={id}
              type="button"
              className={`ns-btn guardian-btn ${save.equippedGuardian === id ? 'ns-btn-primary' : ''}`}
              onClick={() => onPick(id)}
              disabled={!own.unlocked}
            >
              <PortraitCanvas size={72} draw={(ctx) => drawGuardianSprite(ctx, id, 64, 'portrait')} />
              <strong>{def.name}</strong>
              <small>{own.unlocked ? `${def.title} · LV ${own.level}` : `SEALED · ${def.unlock}`}</small>
              <small>{def.special}: {def.specialBlurb}</small>
              {own.unlocked && <small>XP {own.xp}/{guardianXpNeed(own.level)}</small>}
            </button>
          );
        })}
      </div>
    </HangarChrome>
  );
}

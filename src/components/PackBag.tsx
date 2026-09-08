import type { SaveGame } from '../types/game.ts';
import { ELEMENT_LIST } from '../game/content/elements.ts';
import { EggTier } from '../types/game.ts';
import { HangarChrome } from './HangarChrome.tsx';

interface Props {
  save: SaveGame;
  onBack: () => void;
}

export function PackBag({ save, onBack }: Props) {
  return (
    <HangarChrome title="INVENTORY" save={save} onBack={onBack}>
        <ul className="stats">
          <li><span>COINS</span><strong>{Math.round(save.profile.coins).toLocaleString()}</strong></li>
          <li><span>CRYSTALS</span><strong>{Math.round(save.profile.crystals).toLocaleString()}</strong></li>
          <li><span>TROPHIES</span><strong>{Math.round(save.profile.trophies).toLocaleString()}</strong></li>
          <li><span>BOSS ENERGY</span><strong>{save.profile.bossEnergy}</strong></li>
          <li><span>ESSENCE</span><strong>{save.profile.essence}</strong></li>
        </ul>
        <p className="hud-label">EGGS</p>
        <ul className="stats">
          {(Object.values(EggTier) as (typeof EggTier)[keyof typeof EggTier][]).map((t) => (
            <li key={t}><span>{t}</span><strong>{save.eggs[t]}</strong></li>
          ))}
        </ul>
        <p className="hud-label">SHARDS</p>
        <ul className="stats">
          {ELEMENT_LIST.map((el) => (
            <li key={el}><span>{el}</span><strong>{save.profile.shards[el]}</strong></li>
          ))}
        </ul>
        <p className="muted">Companions live in the Aetherling field guide.</p>
    </HangarChrome>
  );
}

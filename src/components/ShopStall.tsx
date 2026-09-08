import type { SaveGame } from '../types/game.ts';
import type { GameSession } from '../services/GameSession.ts';
import { HangarChrome } from './HangarChrome.tsx';

interface Props {
  save: SaveGame;
  session: GameSession;
  notice: string;
  onBuy: (id: string) => void;
  onBack: () => void;
}

export function ShopStall({ save, session, notice, onBuy, onBack }: Props) {
  return (
    <HangarChrome title="SHOP" save={save} notice={notice} onBack={onBack}>
        <ul className="hangar-list">
          {session.shopOffers().map((o) => (
            <li key={o.id} className="hangar-item">
              <div>
                <strong>{o.label}</strong>
                <span>{o.cost} {o.pay}</span>
              </div>
              <button type="button" className="ns-btn ns-btn-primary" onClick={() => onBuy(o.id)}>
                BUY
              </button>
            </li>
          ))}
        </ul>
        <p className="muted">Hangar coins and crystals only. Offers rotate each local day.</p>
    </HangarChrome>
  );
}

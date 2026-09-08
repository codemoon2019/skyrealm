import { EggTier } from '../types/game.ts';
import type { SaveGame } from '../types/game.ts';
import { EGG_ODDS } from '../game/content/eggs.ts';
import { SPECIES_META } from '../game/content/aetherlings.ts';
import type { OwnedAetherling } from '../types/game.ts';
import { drawEggIcon } from '../game/fantasyDraw.ts';
import { drawAetherSprite } from '../assets/drawEntity.ts';
import { assets } from '../assets/AssetLoader.ts';
import { eggAssets } from '../assets/assetManifest.ts';
import { HangarChrome } from './HangarChrome.tsx';
import { PortraitCanvas } from './PortraitCanvas.tsx';

const EGG_COLOR: Record<(typeof EggTier)[keyof typeof EggTier], string> = {
  [EggTier.BASIC]: '#f4d4b8',
  [EggTier.RARE]: '#7ee8ff',
  [EggTier.EPIC]: '#c46bff',
  [EggTier.LEGENDARY]: '#ffd24a',
  [EggTier.MYTHIC]: '#ff7ad9',
};

interface Props {
  save: SaveGame;
  notice: string;
  reveal: OwnedAetherling | null;
  duplicate: boolean;
  onOpen: (tier: (typeof EggTier)[keyof typeof EggTier]) => void;
  onBack: () => void;
}

export function EggNest({ save, notice, reveal, duplicate, onOpen, onBack }: Props) {
  return (
    <HangarChrome title="EGGS" save={save} notice={notice} onBack={onBack}>
        {reveal && (
          <div className="egg-reveal">
            <PortraitCanvas size={88} draw={(ctx) => drawAetherSprite(ctx, reveal.species, 52, { pose: 'portrait' })} />
            <strong>{duplicate ? 'DUPLICATE → ESSENCE' : 'NEW BOND'}</strong>
            <em>{SPECIES_META[reveal.species].name}</em>
            <span>{reveal.rarity} · {reveal.element}</span>
          </div>
        )}
        <ul className="hangar-list">
          {(Object.values(EggTier) as (typeof EggTier)[keyof typeof EggTier][]).map((tier) => (
            <li key={tier} className="hangar-item egg-row">
              <PortraitCanvas
                size={48}
                draw={(ctx) => {
                  if (!assets.draw(ctx, eggAssets[tier], 36)) drawEggIcon(ctx, EGG_COLOR[tier], 0, 16);
                }}
              />
              <div>
                <strong>{tier} · x{save.eggs[tier]}</strong>
                <span>{EGG_ODDS[tier].map((r) => `${r.pct}% ${r.rarity}`).join(' · ')}</span>
              </div>
              <button type="button" className="ns-btn ns-btn-primary" onClick={() => onOpen(tier)}>
                OPEN
              </button>
            </li>
          ))}
        </ul>
    </HangarChrome>
  );
}

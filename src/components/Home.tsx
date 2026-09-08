import { useCallback, useEffect } from 'react';
import { BRAND } from '../brand.ts';
import type { SaveGame } from '../types/game.ts';
import { GUARDIAN_META } from '../game/content/guardians.ts';
import { SPECIES_META } from '../game/content/aetherlings.ts';
import { BrandMark } from './BrandMark.tsx';
import { MenuPlayground } from './MenuPlayground.tsx';
import { PortraitCanvas } from './PortraitCanvas.tsx';
import { drawAetherSprite, drawGuardianSprite } from '../assets/drawEntity.ts';
import { assets } from '../assets/AssetLoader.ts';
import { aetherPath, guardianPath, hangarChipUrls, uiAssets } from '../assets/assetManifest.ts';
import { web3UiOn } from '../web3/flags.ts';

interface Props {
  save: SaveGame;
  notice: string;
  onPlay: () => void;
  onOpen: (id: 'GUARDIANS' | 'AETHERLINGS' | 'QUESTS' | 'RAID' | 'EGGS' | 'SHOP' | 'ACHIEVEMENTS' | 'INVENTORY' | 'TRAINING' | 'COLLECTION' | 'HOW_TO_PLAY' | 'SETTINGS') => void;
  onPop: () => void;
  onLogin: () => void;
}

export function Home({ save, notice, onPlay, onOpen, onPop, onLogin }: Props) {
  const g = GUARDIAN_META[save.equippedGuardian];
  const a = save.equipped.map((id) => save.aetherlings.find((unit) => unit.id === id));
  const leftSpecies = a[0]?.species;
  const rightSpecies = a[1]?.species;
  const drawGuardian = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawGuardianSprite(ctx, save.equippedGuardian, 68, 'portrait');
    },
    [save.equippedGuardian],
  );
  const drawLeft = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (leftSpecies) drawAetherSprite(ctx, leftSpecies, 38, { pose: 'portrait' });
    },
    [leftSpecies],
  );
  const drawRight = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (rightSpecies) drawAetherSprite(ctx, rightSpecies, 38, { pose: 'portrait' });
    },
    [rightSpecies],
  );

  useEffect(() => {
    const urls = [guardianPath(save.equippedGuardian, 'portrait'), ...hangarChipUrls()];
    if (leftSpecies) urls.push(aetherPath(leftSpecies, 'portrait'));
    if (rightSpecies) urls.push(aetherPath(rightSpecies, 'portrait'));
    void assets.load(urls);
  }, [leftSpecies, rightSpecies, save.equippedGuardian]);

  return (
    <div className="overlay overlay-menu overlay-home">
      <div className="menu-frame">
        <MenuPlayground onPop={onPop} />
        <div className="home-layout">
          <div className="home-hero">
            <div className="home-brand-row">
              <BrandMark size={36} />
              <div>
                <p className="eyebrow">{BRAND.subtitle}</p>
                <h1 className="title-xl">{BRAND.name}</h1>
              </div>
            </div>
            <div className="home-fly">
              <div className="home-party-card">
                <div className="home-party">
                  <button type="button" className="home-party-slot" onClick={() => onOpen('GUARDIANS')} aria-label="Open Guardians">
                    <PortraitCanvas size={78} draw={drawGuardian} />
                  </button>
                  <button type="button" className="home-party-slot" onClick={() => onOpen('AETHERLINGS')} aria-label="Open Aetherlings">
                    <PortraitCanvas size={54} className={a[0] ? '' : 'is-empty'} draw={drawLeft} />
                  </button>
                  <button type="button" className="home-party-slot" onClick={() => onOpen('AETHERLINGS')} aria-label="Open Aetherlings">
                    <PortraitCanvas size={54} className={a[1] ? '' : 'is-empty'} draw={drawRight} />
                  </button>
                </div>
                <p className="hangar-blurb">
                  {g.name} LV {save.guardians[save.equippedGuardian].level} · {a[0] ? SPECIES_META[a[0].species].name : '—'} · {a[1] ? SPECIES_META[a[1].species].name : '—'}
                </p>
              </div>
              <div className="home-stats">
                <span className="home-chip">HIGH {Math.round(save.settings.highScore).toLocaleString()}</span>
                <span className="home-chip">
                  {assets.has(uiAssets.coin) && <img src={uiAssets.coin} alt="" />}
                  COINS {Math.round(save.profile.coins).toLocaleString()}
                </span>
                <span className="home-chip">
                  {assets.has(uiAssets.crystal) && <img src={uiAssets.crystal} alt="" />}
                  CRYSTALS {Math.round(save.profile.crystals).toLocaleString()}
                </span>
                <span className="home-chip">
                  {assets.has(uiAssets.trophy) && <img src={uiAssets.trophy} alt="" />}
                  TROPHIES {Math.round(save.profile.trophies).toLocaleString()}
                </span>
                <span className="home-chip">
                  {assets.has(uiAssets.energy) && <img src={uiAssets.energy} alt="" />}
                  ENERGY {Math.round(save.profile.bossEnergy).toLocaleString()}
                </span>
              </div>
              {notice && <p className="hangar-note">{notice}</p>}
              <button type="button" className="ns-btn ns-btn-primary home-play" onClick={onPlay}>
                TAKE FLIGHT
              </button>
              <p className="home-play-hint">Endless sky. Bank coins, crystals, and eggs.</p>
            </div>
            <div className="home-nav">
              <p className="home-group">PARTY</p>
              <div className="home-grid">
                <button type="button" className="ns-btn" onClick={() => onOpen('GUARDIANS')}>GUARDIANS</button>
                <button type="button" className="ns-btn" onClick={() => onOpen('AETHERLINGS')}>AETHERLINGS</button>
              </div>
              <p className="home-group">MISSIONS</p>
              <div className="home-grid home-grid-missions">
                <button type="button" className="ns-btn" onClick={() => onOpen('QUESTS')}>
                  QUESTS
                  <small>Send a timer, then claim</small>
                </button>
                <button type="button" className="ns-btn" onClick={() => onOpen('RAID')}>
                  BOSS RAID
                  <small>Spend 1 Boss Energy</small>
                </button>
                <button type="button" className="ns-btn" onClick={() => onOpen('TRAINING')}>
                  TRAINING
                  <small>Practice. No spoils.</small>
                </button>
              </div>
              <p className="home-group">VAULT</p>
              <div className="home-grid">
                <button type="button" className="ns-btn" onClick={() => onOpen('EGGS')}>EGGS</button>
                <button type="button" className="ns-btn" onClick={() => onOpen('SHOP')}>SHOP</button>
                <button type="button" className="ns-btn" onClick={() => onOpen('INVENTORY')}>INVENTORY</button>
                <button type="button" className="ns-btn" onClick={() => onOpen('ACHIEVEMENTS')}>ACHIEVEMENTS</button>
                {web3UiOn() && (
                  <button type="button" className="ns-btn" onClick={() => onOpen('COLLECTION')}>COLLECTION</button>
                )}
              </div>
            </div>
            <nav className="home-help" aria-label="Help">
              <button type="button" className="home-text-link" onClick={() => onOpen('HOW_TO_PLAY')}>HOW TO PLAY</button>
              <button type="button" className="home-text-link" onClick={() => onOpen('SETTINGS')}>SETTINGS</button>
              <button type="button" className="home-text-link" onClick={onLogin}>DAILY LOGIN</button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

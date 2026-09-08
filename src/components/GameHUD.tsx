import { useEffect, useRef, useState } from 'react';
import type { GameSnapshot } from '../types/game.ts';
import { RunMode } from '../types/game.ts';
import { assets } from '../assets/AssetLoader.ts';
import { powerUpAssets, uiAssets } from '../assets/assetManifest.ts';
import { BrandMark } from './BrandMark.tsx';

interface Props {
  snap: GameSnapshot;
  compact: boolean;
  onPause?: () => void;
}

const chipSrc = new Map<string, string>();

function iconSrc(url: string): string | null {
  const img = assets.get(url);
  if (!img) return null;
  if (img instanceof HTMLCanvasElement) {
    let src = chipSrc.get(url);
    if (!src) {
      src = img.toDataURL('image/png');
      chipSrc.set(url, src);
    }
    return src;
  }
  return url;
}

function HudIco({ url, className = 'hud-ico' }: { url: string; className?: string }) {
  const src = iconSrc(url);
  if (!src) return null;
  return <img className={className} src={src} alt="" />;
}

/**
 * Bumps a counter whenever `value` falls, so a flash element can be re-keyed to
 * replay its animation. Cheaper than juggling timeouts, and because the counter
 * starts at zero the flash never fires on first mount.
 */
function useDropPulse(value: number): number {
  const prev = useRef(value);
  const [hits, setHits] = useState(0);
  useEffect(() => {
    if (value < prev.current) setHits((n) => n + 1);
    prev.current = value;
  }, [value]);
  return hits;
}

interface BarProps {
  kind: 'hp' | 'sh' | 'sp';
  icon: string;
  pct: number;
  readout: string;
  /** Re-keys the flash overlay so a fresh loss replays the animation. */
  hits?: number;
  className?: string;
  title: string;
}

/**
 * One stat bar. The trailing "ghost" layer shares the fill's width but eases far
 * slower, so a hit leaves a pale streak that drains away and you can see how
 * much you just lost rather than only where you ended up.
 *
 * Stays pointer-transparent like the rest of the HUD: the top strip sits over
 * the play field, and anything clickable here would become a dead zone for
 * steering.
 */
function Bar({ kind, icon, pct, readout, hits = 0, className = '', title }: BarProps) {
  const width = `${Math.min(100, pct * 100)}%`;
  return (
    <div
      className={`bar bar-${kind} ${className}`}
      role="meter"
      aria-label={title}
      aria-valuenow={Math.round(pct * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <HudIco url={icon} />
      <div className="bar-track">
        <div className="bar-ghost" style={{ width }} />
        <div className={`bar-fill ${kind}`} style={{ width }} />
        {hits > 0 && <span key={hits} className="bar-hit" />}
      </div>
      <span className="bar-readout">{readout}</span>
    </div>
  );
}

export function GameHUD({ snap, compact, onPause }: Props) {
  const healthPct = Math.max(0, snap.health / snap.maxHealth);
  const shieldPct = Math.max(0, snap.shield / snap.maxShield);
  const specialPct = Math.max(0, snap.specialEnergy / 100);
  const showBuffs = snap.magnetTime > 0 || snap.rushTime > 0 || snap.doubleShotTime > 0 || snap.freezeTime > 0;
  const modeTag =
    snap.mode === RunMode.RAID ? 'RAID' : snap.mode === RunMode.TRAINING ? 'TRAINING' : 'ENDLESS';
  const pauseSrc = iconSrc(uiAssets.hudPause);
  const hpHits = useDropPulse(snap.health);
  const shieldHits = useDropPulse(snap.shield);

  return (
    <div className={`hud ${compact ? 'hud-compact' : ''}`}>
      {/* Sized to the 540x960 play field, so the readouts sit over the game
          instead of stretching across the whole window. */}
      <div className="hud-frame">
        <div className="hud-top">
          <div className="hud-block">
            <span className="hud-label">SCORE</span>
            <strong>{snap.score.toLocaleString()}</strong>
          </div>
          <div className="hud-block">
            <span className="hud-label">TREASURE</span>
            <strong className="hud-treasure">
              <span>
                <HudIco url={uiAssets.coin} />
                {snap.runCoins.toLocaleString()}
              </span>
              <span>
                <HudIco url={uiAssets.crystal} />
                {snap.runCrystals}
              </span>
            </strong>
          </div>
          <div className="hud-block">
            <span className="hud-label">ARM</span>
            <strong>{snap.weaponName}</strong>
          </div>
          {onPause && (
            <button type="button" className="hud-pause" onClick={onPause} aria-label="Pause">
              {pauseSrc ? <img src={pauseSrc} alt="" /> : <BrandMark size={28} />}
            </button>
          )}
        </div>

        {/* Own row: at play-field width there isn't room for this beside the
            score blocks without the guardian name wrapping to three lines. */}
        <div className="hud-stage-row">
          <div className="hud-block hud-center">
            <span className="hud-label">
              {snap.guardianName} · {snap.sectorName}
            </span>
            <strong className="hud-stage">{snap.stageTitle}</strong>
          </div>
        </div>

        <p className="hud-mode">{modeTag}</p>

        <div className="hud-bars">
          <Bar
            kind="hp"
            icon={uiAssets.hudHp}
            pct={healthPct}
            readout={`${Math.ceil(snap.health)}`}
            hits={hpHits}
            className={healthPct <= 0.3 ? 'is-critical' : ''}
            title="Health"
          />
          <Bar
            kind="sh"
            icon={uiAssets.hudShield}
            pct={shieldPct}
            readout={`${Math.ceil(snap.shield)}`}
            hits={shieldHits}
            className={snap.shield <= 0 ? 'is-empty' : ''}
            title="Shield"
          />
          <Bar
            kind="sp"
            icon={uiAssets.hudSpecial}
            pct={specialPct}
            readout={snap.specialReady ? 'READY' : `${Math.round(specialPct * 100)}%`}
            className={snap.specialReady ? 'is-ready' : ''}
            title="Special"
          />
        </div>

        {snap.comboMultiplier > 1 && (
          <div className="combo-banner">
            COMBO {snap.combo} · x{snap.comboMultiplier}
          </div>
        )}

        {showBuffs && (
          <div className="buff-row">
            {snap.magnetTime > 0 && (
              <span className="hud-buff">
                <HudIco url={powerUpAssets.MAGNET} />
                {snap.magnetTime.toFixed(1)}
              </span>
            )}
            {snap.rushTime > 0 && (
              <span className="hud-buff">
                <HudIco url={powerUpAssets.RUSH} />
                {snap.rushTime.toFixed(1)}
              </span>
            )}
            {snap.doubleShotTime > 0 && (
              <span className="hud-buff">
                <HudIco url={powerUpAssets.DOUBLE} />
                {snap.doubleShotTime.toFixed(1)}
              </span>
            )}
            {snap.freezeTime > 0 && (
              <span className="hud-buff">
                <HudIco url={powerUpAssets.FREEZE} />
                {snap.freezeTime.toFixed(1)}
              </span>
            )}
          </div>
        )}

        {snap.mode === RunMode.RAID && (
          <div className="buff-row">
            RAID {Math.max(0, snap.raidTimer).toFixed(0)}s · DMG {Math.round(snap.raidDamage)}
          </div>
        )}

        {snap.showBossBar && (
          <div className="boss-bar">
            <span>
              {snap.bossName} · {snap.bossElement} · WEAK {snap.bossWeak || '—'}
            </span>
            <div className="bar-track boss-track">
              <div
                className="bar-fill boss"
                style={{ width: `${Math.max(0, snap.bossHealth / snap.bossMaxHealth) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

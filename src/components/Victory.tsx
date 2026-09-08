import type { GameSnapshot } from '../types/game.ts';
import { RunMode } from '../types/game.ts';

interface Props {
  snap: GameSnapshot;
  onAgain: () => void;
  onMenu: () => void;
}

export function Victory({ snap, onAgain, onMenu }: Props) {
  const raid = snap.mode === RunMode.RAID;
  const felled = snap.bossesDefeated > 0;
  return (
    <div className="overlay">
      <div className="panel">
        <h2 className="victory-title">{raid ? (felled ? 'BOSS FELLED' : 'RAID SURVIVED') : 'SKY CLEARED'}</h2>
        {raid && (
          <p className="hangar-blurb">
            {felled
              ? `The boss fell. Raid damage ${Math.round(snap.raidDamage).toLocaleString()}.`
              : `The timer ended. Raid damage ${Math.round(snap.raidDamage).toLocaleString()}.`}
          </p>
        )}
        {snap.isNewHighScore && <p className="celebrate">NEW HIGH SCORE!</p>}
        <ul className="stats">
          <li>
            <span>FINAL SCORE</span>
            <strong>{snap.finalScore.toLocaleString()}</strong>
          </li>
          <li>
            <span>SPOILS</span>
            <strong>
              {snap.runCoins.toLocaleString()} coins · {snap.runCrystals} crystals
            </strong>
          </li>
          <li>
            <span>ENEMIES DESTROYED</span>
            <strong>{snap.enemiesDestroyed}</strong>
          </li>
          <li>
            <span>BOSSES DEFEATED</span>
            <strong>{snap.bossesDefeated}</strong>
          </li>
          <li>
            <span>BEST COMBO</span>
            <strong>{snap.bestCombo}</strong>
          </li>
          <li>
            <span>ACCURACY</span>
            <strong>{Math.round(snap.accuracy * 100)}%</strong>
          </li>
          <li>
            <span>HIGH SCORE</span>
            <strong>{snap.highScore.toLocaleString()}</strong>
          </li>
        </ul>
        <div className="menu-actions">
          <button type="button" className="ns-btn ns-btn-primary" onClick={onAgain}>
            PLAY AGAIN
          </button>
          <button type="button" className="ns-btn" onClick={onMenu}>
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}

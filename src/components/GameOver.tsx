import type { GameSnapshot } from '../types/game.ts';

interface Props {
  snap: GameSnapshot;
  onRetry: () => void;
  onMenu: () => void;
}

export function GameOver({ snap, onRetry, onMenu }: Props) {
  return (
    <div className="overlay">
      <div className="panel">
        <h2>GAME OVER</h2>
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
            <span>HIGH SCORE</span>
            <strong>{snap.highScore.toLocaleString()}</strong>
          </li>
          <li>
            <span>LEVEL</span>
            <strong>{snap.level}</strong>
          </li>
          <li>
            <span>BEST COMBO</span>
            <strong>{snap.bestCombo}</strong>
          </li>
        </ul>
        <div className="menu-actions">
          <button type="button" className="ns-btn ns-btn-primary" onClick={onRetry}>
            RETRY
          </button>
          <button type="button" className="ns-btn" onClick={onMenu}>
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}

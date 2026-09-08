interface Props {
  onResume: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onMenu: () => void;
}

export function PauseMenu({ onResume, onRestart, onSettings, onMenu }: Props) {
  return (
    <div className="overlay">
      <div className="panel">
        <h2>PAUSED</h2>
        <p className="hangar-blurb">P or Esc to resume. E spends special.</p>
        <div className="menu-actions">
          <button type="button" className="ns-btn ns-btn-primary" onClick={onResume}>
            RESUME
          </button>
          <button type="button" className="ns-btn" onClick={onRestart}>
            RESTART
          </button>
          <button type="button" className="ns-btn" onClick={onSettings}>
            SETTINGS
          </button>
          <button type="button" className="ns-btn" onClick={onMenu}>
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}

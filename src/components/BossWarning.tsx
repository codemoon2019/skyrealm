import { BOSS_WARNING_TIME } from '../game/constants.ts';

interface Props {
  name: string;
}

/**
 * Sweeps across live play while the boss descends. It must never dim the field
 * or take pointer events: the run is still going on underneath it. Element and
 * weakness are left to the boss bar rather than repeated here.
 */
export function BossWarning({ name }: Props) {
  const beat = { animationDuration: `${BOSS_WARNING_TIME}s` };
  return (
    <div className="boss-alert" style={beat}>
      <div className="boss-alert-strip" style={beat}>
        <span className="boss-alert-tag">WARNING</span>
        <strong className="boss-alert-name">{name}</strong>
        <span className="boss-alert-weak">BOSS APPROACHING</span>
      </div>
    </div>
  );
}

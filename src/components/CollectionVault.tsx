import { useEffect, useState } from 'react';
import type { SaveGame } from '../types/game.ts';
import { GUARDIAN_META } from '../game/content/guardians.ts';
import { SPECIES_META } from '../game/content/aetherlings.ts';
import { WEB3_FLAGS, walletUiOn } from '../web3/flags.ts';
import { shortAddress } from '../web3/WalletService.ts';
import { useWeb3 } from '../web3/useWeb3.ts';

type Tab = 'wallet' | 'assets' | 'claims' | 'market';

interface Props {
  save: SaveGame;
  onRemember: (address: string) => void;
  onBack: () => void;
}

export function CollectionVault({ save, onRemember, onBack }: Props) {
  const web3 = useWeb3();
  const [tab, setTab] = useState<Tab>('wallet');

  useEffect(() => {
    if (web3.address) onRemember(web3.address);
  }, [web3.address, onRemember]);

  const last = save.web3?.lastAddress;
  const unlocked = Object.values(save.guardians).filter((g) => g.unlocked);

  return (
    <div className="overlay">
      <div className="panel panel-wide hangar-panel">
        <h2>COLLECTION</h2>
        <p className="hangar-blurb">Your wallet lets you own this collectible.</p>
        <div className="collection-tabs">
          <button type="button" className={`ns-btn${tab === 'wallet' ? ' ns-btn-primary' : ''}`} onClick={() => setTab('wallet')}>
            WALLET
          </button>
          <button type="button" className={`ns-btn${tab === 'assets' ? ' ns-btn-primary' : ''}`} onClick={() => setTab('assets')}>
            MY ASSETS
          </button>
          <button type="button" className={`ns-btn${tab === 'claims' ? ' ns-btn-primary' : ''}`} onClick={() => setTab('claims')}>
            CLAIMS
          </button>
          <button type="button" className={`ns-btn${tab === 'market' ? ' ns-btn-primary' : ''}`} onClick={() => setTab('market')}>
            MARKET
          </button>
        </div>

        {tab === 'wallet' && (
          <div className="collection-block">
            {!web3.online && <p className="hangar-note">You're offline. Play continues; wallet actions are paused.</p>}
            {!web3.hasProvider && walletUiOn() && (
              <p className="muted">No wallet found. Install a browser wallet to own collectibles.</p>
            )}
            {!walletUiOn() && <p className="muted">Wallet connect is turned off for this build.</p>}
            {web3.address ? (
              <ul className="stats">
                <li>
                  <span>ADDRESS</span>
                  <strong>{shortAddress(web3.address)}</strong>
                </li>
                <li>
                  <span>NETWORK</span>
                  <strong>{web3.network}</strong>
                </li>
                <li>
                  <span>STATUS</span>
                  <strong>{web3.label}</strong>
                </li>
              </ul>
            ) : (
              <p className="muted">
                {last ? `Last wallet ${shortAddress(last)}. Connect when you want to own collectibles.` : 'Play without a wallet. Connect only if you want on-chain ownership later.'}
              </p>
            )}
            {web3.message && <p className="hangar-note">{web3.message}</p>}
            <div className="collection-actions">
              {web3.connected ? (
                <>
                  <button type="button" className="ns-btn" onClick={() => void web3.copyAddress()}>
                    COPY
                  </button>
                  <button type="button" className="ns-btn" onClick={web3.disconnect}>
                    DISCONNECT
                  </button>
                </>
              ) : (
                <button type="button" className="ns-btn ns-btn-primary" disabled={!walletUiOn()} onClick={() => void web3.connect()}>
                  CONNECT
                </button>
              )}
            </div>
          </div>
        )}

        {tab === 'assets' && (
          <div className="collection-block">
            <p className="hud-label">GAME ASSETS</p>
            <p className="muted">These live in your hangar save. Combat stats stay here, not on a token.</p>
            <ul className="stats">
              {unlocked.map((g) => (
                <li key={g.id}>
                  <span>{GUARDIAN_META[g.id].name}</span>
                  <strong>LV {g.level}</strong>
                </li>
              ))}
              {save.aetherlings.map((unit) => (
                <li key={unit.id}>
                  <span>{SPECIES_META[unit.species].name}</span>
                  <strong>{unit.rarity}</strong>
                </li>
              ))}
            </ul>
            <p className="hud-label">ON-CHAIN</p>
            {!WEB3_FLAGS.nft || !web3.address ? (
              <p className="muted">No on-chain collectibles yet. Nothing is minted from this screen.</p>
            ) : web3.ownedGuardians.length + web3.ownedAetherlings.length + web3.ownedEggs.length === 0 ? (
              <p className="muted">No on-chain collectibles on this wallet yet.</p>
            ) : (
              <ul className="stats">
                {[...web3.ownedGuardians, ...web3.ownedAetherlings, ...web3.ownedEggs].map((item) => (
                  <li key={`${item.kind}-${item.tokenId}`}>
                    <span>{item.name}</span>
                    <strong>{item.kind}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === 'claims' && (
          <div className="collection-block">
            <p className="muted">Nothing to claim.</p>
          </div>
        )}

        {tab === 'market' && (
          <div className="collection-block">
            <p className="muted">The market opens later.</p>
          </div>
        )}

        <button type="button" className="ns-btn ns-btn-primary" onClick={onBack}>
          BACK
        </button>
      </div>
    </div>
  );
}

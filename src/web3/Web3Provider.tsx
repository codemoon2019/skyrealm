import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { walletUiOn } from './flags.ts';
import {
  errorToStatus,
  getInjectedProvider,
  networkNote,
  requestAccounts,
  readChainId,
  statusLabel,
} from './WalletService.ts';
import { getOwnedAetherlings, getOwnedEggs, getOwnedGuardians } from './BlockchainService.ts';
import type { TxStatus, WalletSnapshot } from './types.ts';
import { EMPTY_WALLET, Web3Context, type Web3Api } from './useWeb3.ts';

export function Web3Provider({ children }: { children: ReactNode }) {
  const [snap, setSnap] = useState<WalletSnapshot>({
    ...EMPTY_WALLET,
    hasProvider: typeof window !== 'undefined' && Boolean(getInjectedProvider()),
    online: typeof navigator === 'undefined' ? true : navigator.onLine,
  });
  const [ownedGuardians, setOwnedGuardians] = useState<Web3Api['ownedGuardians']>([]);
  const [ownedAetherlings, setOwnedAetherlings] = useState<Web3Api['ownedAetherlings']>([]);
  const [ownedEggs, setOwnedEggs] = useState<Web3Api['ownedEggs']>([]);

  const setStatus = (status: TxStatus, message: string) => {
    setSnap((s) => ({ ...s, status, message }));
  };

  const applyAccounts = useCallback(async (accounts: string[]) => {
    const address = accounts[0] ?? null;
    const chainId = address ? await readChainId() : null;
    setSnap((s) => ({
      ...s,
      address,
      chainId,
      connected: Boolean(address),
      hasProvider: Boolean(getInjectedProvider()),
      status: address ? 'success' : 'idle',
      message: address ? 'Wallet connected. Your gameplay is unchanged.' : '',
    }));
    if (!address) {
      setOwnedGuardians([]);
      setOwnedAetherlings([]);
      setOwnedEggs([]);
      return;
    }
    const [g, a, e] = await Promise.all([
      getOwnedGuardians(address),
      getOwnedAetherlings(address),
      getOwnedEggs(address),
    ]);
    setOwnedGuardians(g);
    setOwnedAetherlings(a);
    setOwnedEggs(e);
  }, []);

  useEffect(() => {
    const onOnline = () => setSnap((s) => ({ ...s, online: true }));
    const onOffline = () =>
      setSnap((s) => ({
        ...s,
        online: false,
        message: "You're offline. Play continues; wallet actions are paused.",
      }));
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    const eth = getInjectedProvider();
    const onAccounts = (...args: unknown[]) => {
      const list = Array.isArray(args[0]) ? (args[0] as string[]) : [];
      void applyAccounts(list);
    };
    const onChain = () => {
      void readChainId().then((chainId) => setSnap((s) => ({ ...s, chainId })));
    };
    if (walletUiOn()) {
      eth?.on?.('accountsChanged', onAccounts);
      eth?.on?.('chainChanged', onChain);
    }
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      if (walletUiOn()) {
        eth?.removeListener?.('accountsChanged', onAccounts);
        eth?.removeListener?.('chainChanged', onChain);
      }
    };
  }, [applyAccounts]);

  const connect = useCallback(async () => {
    if (!walletUiOn()) {
      setStatus('failed', 'Wallet connect is turned off.');
      return;
    }
    if (!navigator.onLine) {
      setStatus('failed', "You're offline. Play continues; wallet actions are paused.");
      return;
    }
    if (!getInjectedProvider()) {
      setStatus('failed', 'No wallet found. Install a browser wallet to own collectibles.');
      return;
    }
    setStatus('awaiting_wallet', 'Waiting for your wallet…');
    try {
      const accounts = await requestAccounts();
      await applyAccounts(accounts);
    } catch (err) {
      const next = errorToStatus(err);
      setStatus(next.status, next.message);
    }
  }, [applyAccounts]);

  const disconnect = useCallback(() => {
    setSnap((s) => ({
      ...s,
      address: null,
      chainId: null,
      connected: false,
      status: 'idle',
      message: 'Wallet disconnected. Your hangar save is still here.',
    }));
    setOwnedGuardians([]);
    setOwnedAetherlings([]);
    setOwnedEggs([]);
  }, []);

  const copyAddress = useCallback(async () => {
    if (!snap.address) return;
    try {
      await navigator.clipboard.writeText(snap.address);
      setStatus('success', 'Address copied.');
    } catch {
      setStatus('failed', 'Could not copy address.');
    }
  }, [snap.address]);

  const value = useMemo<Web3Api>(
    () => ({
      ...snap,
      ownedGuardians,
      ownedAetherlings,
      ownedEggs,
      connect,
      disconnect,
      copyAddress,
      label: statusLabel(snap.status),
      network: networkNote(snap.chainId),
    }),
    [snap, ownedGuardians, ownedAetherlings, ownedEggs, connect, disconnect, copyAddress],
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

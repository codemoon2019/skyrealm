import { createContext, useContext } from 'react';
import type { OwnedCollectible, WalletSnapshot } from './types.ts';

export interface Web3Api extends WalletSnapshot {
  ownedGuardians: OwnedCollectible[];
  ownedAetherlings: OwnedCollectible[];
  ownedEggs: OwnedCollectible[];
  connect: () => Promise<void>;
  disconnect: () => void;
  copyAddress: () => Promise<void>;
  label: string;
  network: string;
}

export const EMPTY_WALLET: WalletSnapshot = {
  address: null,
  chainId: null,
  connected: false,
  online: typeof navigator === 'undefined' ? true : navigator.onLine,
  hasProvider: false,
  status: 'idle',
  message: '',
};

export const Web3Context = createContext<Web3Api | null>(null);

export function useWeb3(): Web3Api {
  const ctx = useContext(Web3Context);
  if (!ctx) {
    return {
      ...EMPTY_WALLET,
      ownedGuardians: [],
      ownedAetherlings: [],
      ownedEggs: [],
      connect: async () => undefined,
      disconnect: () => undefined,
      copyAddress: async () => undefined,
      label: 'Ready.',
      network: 'Wallet layer is off.',
    };
  }
  return ctx;
}

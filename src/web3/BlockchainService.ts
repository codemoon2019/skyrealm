import type { OwnedCollectible } from './types.ts';

/** Phase 1: no contracts. Ownership lookups stay empty until testnet deploy. */
export async function getOwnedGuardians(address: string): Promise<OwnedCollectible[]> {
  void address;
  return [];
}

export async function getOwnedAetherlings(address: string): Promise<OwnedCollectible[]> {
  void address;
  return [];
}

export async function getOwnedEggs(address: string): Promise<OwnedCollectible[]> {
  void address;
  return [];
}

export function explorerAddressUrl(address: string, chainId: number): string | null {
  if (chainId === 84532) return `https://sepolia.basescan.org/address/${address}`;
  if (chainId === 8453) return `https://basescan.org/address/${address}`;
  if (chainId === 11155111) return `https://sepolia.etherscan.io/address/${address}`;
  return null;
}

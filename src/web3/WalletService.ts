import { WEB3_FLAGS } from './flags.ts';
import type { EthereumProvider, TxStatus } from './types.ts';

export function getInjectedProvider(): EthereumProvider | null {
  return typeof window !== 'undefined' && window.ethereum ? window.ethereum : null;
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function requestAccounts(): Promise<string[]> {
  const eth = getInjectedProvider();
  if (!eth) throw new Error('No wallet found. Install a browser wallet to own collectibles.');
  const raw = await eth.request({ method: 'eth_requestAccounts' });
  return Array.isArray(raw) ? (raw as string[]) : [];
}

export async function readChainId(): Promise<number | null> {
  const eth = getInjectedProvider();
  if (!eth) return null;
  const raw = await eth.request({ method: 'eth_chainId' });
  const hex = typeof raw === 'string' ? raw : '0x0';
  return Number.parseInt(hex, 16);
}

export function statusLabel(status: TxStatus): string {
  switch (status) {
    case 'connecting':
      return 'Connecting…';
    case 'awaiting_wallet':
      return 'Waiting for your wallet…';
    case 'submitted':
      return 'Submitted.';
    case 'confirming':
      return 'Confirming ownership…';
    case 'success':
      return 'Done.';
    case 'failed':
      return 'That did not go through.';
    case 'rejected':
      return 'You declined the request.';
    default:
      return 'Ready.';
  }
}

export function networkNote(chainId: number | null): string {
  if (chainId == null) return 'No network yet.';
  if (chainId === WEB3_FLAGS.chainId) return `On ${WEB3_FLAGS.chainName}.`;
  return `Wrong network (${chainId}). Switch to ${WEB3_FLAGS.chainName} when you claim.`;
}

export function errorToStatus(err: unknown): { status: TxStatus; message: string } {
  const code = typeof err === 'object' && err && 'code' in err ? Number((err as { code: number }).code) : 0;
  if (code === 4001) return { status: 'rejected', message: 'You declined the request.' };
  const message = err instanceof Error ? err.message : 'Wallet request failed.';
  return { status: 'failed', message };
}

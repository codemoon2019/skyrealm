export type TxStatus =
  | 'idle'
  | 'connecting'
  | 'awaiting_wallet'
  | 'submitted'
  | 'confirming'
  | 'success'
  | 'failed'
  | 'rejected';

export interface WalletSnapshot {
  address: string | null;
  chainId: number | null;
  connected: boolean;
  online: boolean;
  hasProvider: boolean;
  status: TxStatus;
  message: string;
}

export interface OwnedCollectible {
  tokenId: string;
  name: string;
  kind: 'guardian' | 'aetherling' | 'egg' | 'badge';
}

export interface EthereumProvider {
  request(args: { method: string; params?: unknown[] | object }): Promise<unknown>;
  on?(event: string, handler: (...args: unknown[]) => void): void;
  removeListener?(event: string, handler: (...args: unknown[]) => void): void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

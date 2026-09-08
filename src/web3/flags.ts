function on(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}

function num(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const WEB3_FLAGS = {
  enabled: on(import.meta.env.VITE_WEB3_ENABLED),
  wallet: on(import.meta.env.VITE_WALLET_ENABLED),
  claims: on(import.meta.env.VITE_CLAIMS_ENABLED),
  nft: on(import.meta.env.VITE_NFT_ENABLED),
  marketplace: on(import.meta.env.VITE_MARKETPLACE_ENABLED),
  token: on(import.meta.env.VITE_TOKEN_ENABLED),
  chainId: num(import.meta.env.VITE_WEB3_CHAIN_ID, 84532),
  chainName: import.meta.env.VITE_WEB3_CHAIN_NAME || 'Base Sepolia',
  rpc: import.meta.env.VITE_WEB3_RPC || '',
} as const;

export function web3UiOn(): boolean {
  return WEB3_FLAGS.enabled;
}

export function walletUiOn(): boolean {
  return WEB3_FLAGS.enabled && WEB3_FLAGS.wallet;
}

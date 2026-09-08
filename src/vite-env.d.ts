/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEB3_ENABLED?: string;
  readonly VITE_WALLET_ENABLED?: string;
  readonly VITE_CLAIMS_ENABLED?: string;
  readonly VITE_NFT_ENABLED?: string;
  readonly VITE_MARKETPLACE_ENABLED?: string;
  readonly VITE_TOKEN_ENABLED?: string;
  readonly VITE_WEB3_CHAIN_ID?: string;
  readonly VITE_WEB3_CHAIN_NAME?: string;
  readonly VITE_WEB3_RPC?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

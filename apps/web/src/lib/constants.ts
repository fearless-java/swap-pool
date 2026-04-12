export const SUPPORTED_CHAINS = [
  "mainnet",
  "polygon",
  "arbitrum",
  "optimism",
  "base",
] as const

export type SupportedChain = (typeof SUPPORTED_CHAINS)[number]

export const CHAIN_IDS = {
  mainnet: 1,
  polygon: 137,
  arbitrum: 42161,
  optimism: 10,
  base: 8453,
} as const

export const RPC_URLS = {
  mainnet: process.env.NEXT_PUBLIC_MAINNET_RPC_URL || "https://eth.llamarpc.com",
  polygon: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://polygon.llamarpc.com",
  arbitrum: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || "https://arbitrum.llamarpc.com",
  optimism: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL || "https://optimism.llamarpc.com",
  base: process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://base.llamarpc.com",
} as const

export const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID"

export const APP_NAME = "SushiSwap"

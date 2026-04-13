/**
 * Chain ID type definitions for multi-chain support
 */

// EVM Chain IDs
export const EVM_CHAIN_IDS = {
  mainnet: 1,
  polygon: 137,
  arbitrum: 42161,
  optimism: 10,
  base: 8453,
  avalanche: 43114,
  zkSync: 324,
  linea: 59144,
} as const

export type EvmChainId = (typeof EVM_CHAIN_IDS)[keyof typeof EVM_CHAIN_IDS]

// Solana Chain ID (using cluster name for identification)
export const SVM_CHAIN_IDS = {
  mainnet: "mainnet",
  devnet: "devnet",
  testnet: "testnet",
} as const

export type SvmChainId = (typeof SVM_CHAIN_IDS)[keyof typeof SVM_CHAIN_IDS]

// Union type for all supported chains
export type ChainId = EvmChainId | SvmChainId

// Helper to check if a chain ID is EVM
export function isEvmChainId(chainId: ChainId): chainId is EvmChainId {
  return typeof chainId === "number"
}

// Helper to check if a chain ID is SVM
export function isSvmChainId(chainId: ChainId): chainId is SvmChainId {
  return typeof chainId === "string"
}

// Common chain names mapping
export const CHAIN_NAMES: Record<number, string> = {
  [EVM_CHAIN_IDS.mainnet]: "Ethereum",
  [EVM_CHAIN_IDS.polygon]: "Polygon",
  [EVM_CHAIN_IDS.arbitrum]: "Arbitrum",
  [EVM_CHAIN_IDS.optimism]: "Optimism",
  [EVM_CHAIN_IDS.base]: "Base",
  [EVM_CHAIN_IDS.avalanche]: "Avalanche",
  [EVM_CHAIN_IDS.zkSync]: "zkSync",
  [EVM_CHAIN_IDS.linea]: "Linea",
}

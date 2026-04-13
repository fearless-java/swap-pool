/**
 * Chain ID type definitions for multi-chain support
 * Compatible with @sushiswap/core types
 */

// EVM Chain IDs - compatible with @sushiswap/core
// Note: Using named keys for internal use while EvmChainId type is compatible with @sushiswap/core
export const EVM_CHAIN_IDS = {
  mainnet: 1,
  polygon: 137,
  arbitrum: 42161,
  optimism: 10,
  base: 8453,
  sepolia: 11155111,
} as const

// Import EvmChainId type from @sushiswap/core for internal use and re-export for compatibility
import type { EvmChainId } from '@sushiswap/core/evm'
export type { EvmChainId }

// Solana Chain ID (using cluster name for identification)
// Updated to match @sushiswap/core naming convention
export const SVM_CHAIN_IDS = {
  solana: "solana",
  solanaDevnet: "solana-devnet",
  solanaTestnet: "solana-testnet",
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
  [EVM_CHAIN_IDS.sepolia]: "Sepolia",
}

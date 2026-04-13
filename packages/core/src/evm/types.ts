/**
 * EVM Chain type definitions
 * Note: EvmChainId is re-exported from chains.ts for consistency
 */

// Import EvmChainId for internal use and re-export for external consumers
import type { EvmChainId } from './chains'
export type { EvmChainId }

/**
 * EVM Chain configuration
 */
export interface EvmChainConfig {
  id: EvmChainId
  name: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
}

/**
 * EVM Chain ID to configuration mapping
 */
export type EvmChainConfigMap = Record<EvmChainId, EvmChainConfig>

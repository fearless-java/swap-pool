/**
 * Type guard to check if a chain ID is a valid EVM chain ID
 */
import { type EvmChainId, EVM_CHAIN_IDS } from './chains'

/**
 * Check if a given chain ID is a valid EVM chain ID
 * @param chainId - The chain ID to check
 * @returns True if the chain ID is a valid EVM chain ID
 */
export function isEvmChainId(chainId: unknown): chainId is EvmChainId {
  if (typeof chainId !== 'number') {
    return false
  }
  return EVM_CHAIN_IDS.includes(chainId as EvmChainId)
}

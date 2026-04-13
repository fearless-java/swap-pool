/**
 * Type guard to check if a chain ID is a valid Stellar chain ID
 */
import { type StellarChainId, STELLAR_CHAIN_IDS } from './chains'

/**
 * Check if a given chain ID is a valid Stellar chain ID
 * @param chainId - The chain ID to check
 * @returns True if the chain ID is a valid Stellar chain ID
 */
export function isStellarChainId(chainId: unknown): chainId is StellarChainId {
  if (typeof chainId !== 'string') {
    return false
  }
  return STELLAR_CHAIN_IDS.includes(chainId as StellarChainId)
}

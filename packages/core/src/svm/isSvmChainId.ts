/**
 * Type guard to check if a chain ID is a valid SVM chain ID
 */
import { type SvmChainId, SVM_CHAIN_IDS } from './chains'

/**
 * Check if a given chain ID is a valid SVM chain ID
 * @param chainId - The chain ID to check
 * @returns True if the chain ID is a valid SVM chain ID
 */
export function isSvmChainId(chainId: unknown): chainId is SvmChainId {
  if (typeof chainId !== 'string') {
    return false
  }
  return SVM_CHAIN_IDS.includes(chainId as SvmChainId)
}

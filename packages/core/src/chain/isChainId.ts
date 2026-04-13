/**
 * Unified type guard to check if a chain ID is valid
 */

import { isEvmChainId } from '../evm'
import { isSvmChainId } from '../svm'
import { isStellarChainId } from '../stellar'
import type { ChainId } from './ChainId'

/**
 * Check if a given chain ID is a valid ChainId (EVM, SVM, or Stellar)
 * @param chainId - The chain ID to check
 * @returns True if the chain ID is a valid unified ChainId
 */
export function isChainId(chainId: unknown): chainId is ChainId {
  return isEvmChainId(chainId) || isSvmChainId(chainId) || isStellarChainId(chainId)
}

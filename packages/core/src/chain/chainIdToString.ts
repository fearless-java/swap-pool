/**
 * Convert a ChainId to string representation
 */

import { EVM_CHAIN_META } from '../evm'
import { SVM_CHAIN_CONFIG } from '../svm'
import { STELLAR_CHAIN_CONFIG } from '../stellar'
import { type ChainId } from './ChainId'
import { isEvmChainId } from '../evm'
import { isSvmChainId } from '../svm'
import { isStellarChainId } from '../stellar'

/**
 * Convert a ChainId to its string representation
 * @param chainId - The chain ID to convert
 * @returns String representation of the chain ID
 */
export function chainIdToString(chainId: ChainId): string {
  if (isEvmChainId(chainId)) {
    return chainId.toString()
  }
  if (isSvmChainId(chainId)) {
    return chainId
  }
  if (isStellarChainId(chainId)) {
    return chainId
  }
  throw new Error(`Unknown chain ID: ${chainId}`)
}

/**
 * Get chain name from ChainId
 * @param chainId - The chain ID
 * @returns The chain name
 */
export function getChainName(chainId: ChainId): string {
  if (isEvmChainId(chainId)) {
    return EVM_CHAIN_META[chainId]?.name ?? `Unknown EVM Chain (${chainId})`
  }
  if (isSvmChainId(chainId)) {
    return SVM_CHAIN_CONFIG[chainId].name
  }
  if (isStellarChainId(chainId)) {
    return STELLAR_CHAIN_CONFIG[chainId].name
  }
  return 'Unknown Chain'
}

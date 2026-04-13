/**
 * Unified ChainId type - combines EVM, SVM, and Stellar chain IDs
 */

import type { EvmChainId } from '../evm'
import type { SvmChainId } from '../svm'
import type { StellarChainId } from '../stellar'

/**
 * Unified ChainId type that encompasses all supported chains:
 * - EVM chains (identified by numeric IDs)
 * - SVM chains (Solana, identified by string IDs)
 * - Stellar chains (identified by string IDs)
 */
export type ChainId = EvmChainId | SvmChainId | StellarChainId

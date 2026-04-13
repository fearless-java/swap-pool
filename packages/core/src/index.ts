/**
 * @sushiswap/core - Core type definitions for SushiSwap Clone
 *
 * A pure TypeScript package containing type definitions for:
 * - EVM chains (60+ chains)
 * - SVM/Solana chains
 * - Stellar chains
 * - Unified ChainId type
 * - Currency types (Native, Token)
 * - Common contract addresses
 */

// EVM module
export {
  EVM_CHAIN_IDS,
  type EvmChainId,
  EVM_CHAIN_META,
  isEvmChainId,
  type EvmChainConfig,
  type EvmChainConfigMap,
} from './evm'

// SVM module
export {
  SVM_CHAIN_IDS,
  type SvmChainId,
  SVM_CHAIN_CONFIG,
  isSvmChainId,
  type SvmChainConfig,
  type SvmChainConfigMap,
} from './svm'

// Stellar module
export {
  STELLAR_CHAIN_IDS,
  type StellarChainId,
  STELLAR_CHAIN_CONFIG,
  isStellarChainId,
  type StellarChainConfig,
  type StellarChainConfigMap,
} from './stellar'

// Chain module (unified)
export { type ChainId, isChainId, chainIdToString, getChainName } from './chain'

// Currency module
export {
  type NativeCurrency,
  type TokenCurrency,
  type Currency,
  type CurrencyAmount,
  type Price,
  type BaseCurrency,
  isNative,
  isToken,
  WETH9,
  WETH9_ARBITRUM,
  WETH9_OPTIMISM,
  WETH9_POLYGON,
  WETH9_BASE,
  WETH9_ZKSYNC,
  WETH9_MAP,
  getWETH9,
} from './currency'

// Constants module
export {
  TOKENS,
  NATIVE_CURRENCY_ADDRESS,
  type TokenSymbol,
  MULTICALL3_ADDRESS,
  getMulticall3Address,
} from './constants'

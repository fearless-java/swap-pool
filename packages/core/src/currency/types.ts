/**
 * Currency type definitions - Native tokens and Tokens (ERC20/SPL)
 */

import type { ChainId } from '../chain'

/**
 * Base currency interface
 */
export interface BaseCurrency {
  /** Chain ID where this currency exists */
  chainId: ChainId
  /** Currency symbol (e.g., ETH, USDC) */
  symbol: string
  /** Currency name (e.g., Ether, USD Coin) */
  name: string
  /** Number of decimals */
  decimals: number
}

/**
 * Native token currency (e.g., ETH on Ethereum, SOL on Solana)
 */
export interface NativeCurrency extends BaseCurrency {
  type: 'native'
}

/**
 * Token currency (e.g., ERC20 tokens on EVM, SPL tokens on Solana)
 */
export interface TokenCurrency extends BaseCurrency {
  type: 'token'
  /** Contract address (for EVM) or mint address (for SVM/Stellar) */
  address: string
  /** Token logo URI */
  logoURI?: string
}

/**
 * Currency type - either Native or Token
 */
export type Currency = NativeCurrency | TokenCurrency

/**
 * Currency amount - represents an amount of a currency
 */
export interface CurrencyAmount {
  currency: Currency
  amount: string // String representation of BigInt
}

/**
 * Price type - represents a price ratio between two currencies
 */
export interface Price<C1 extends Currency = Currency, C2 extends Currency = Currency> {
  baseCurrency: C1
  quoteCurrency: C2
  numerator: string // String representation of BigInt
  denominator: string // String representation of BigInt
}

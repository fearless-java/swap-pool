/**
 * Type guard to check if a currency is a token (ERC20/SPL)
 */

import type { Currency, TokenCurrency } from './types'

/**
 * Check if a currency is a token (ERC20 on EVM, SPL on Solana, etc.)
 * @param currency - The currency to check
 * @returns True if the currency is a token
 */
export function isToken(currency: Currency): currency is TokenCurrency {
  return currency.type === 'token'
}

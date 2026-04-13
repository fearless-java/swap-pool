/**
 * Type guard to check if a currency is a native token
 */

import type { Currency, NativeCurrency } from './types'

/**
 * Check if a currency is a native token (e.g., ETH, MATIC, SOL)
 * @param currency - The currency to check
 * @returns True if the currency is a native token
 */
export function isNative(currency: Currency): currency is NativeCurrency {
  return currency.type === 'native'
}

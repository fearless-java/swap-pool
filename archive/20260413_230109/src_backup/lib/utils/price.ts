/**
 * Price formatting utilities
 */

/**
 * Format a price value for display
 * @param price - The price value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted price string
 */
export function formatPrice(price: number, decimals: number = 2): string {
  if (price === 0) return "$0.00"
  if (price < 0.00001) return "$<0.00001"
  if (price < 0.01) return `$${price.toFixed(6)}`
  if (price < 1) return `$${price.toFixed(4)}`
  if (price < 1000) return `$${price.toFixed(decimals)}`
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
}

/**
 * Format a price change percentage
 * @param change - The change value (e.g., 5.5 for 5.5%)
 * @returns Formatted change string
 */
export function formatPriceChange(change: number | undefined): string {
  if (change === undefined || change === null) return "0.00%"
  const sign = change >= 0 ? "+" : ""
  return `${sign}${change.toFixed(2)}%`
}

/**
 * Parse a price string to number
 * @param priceStr - The price string to parse
 * @returns Parsed number or 0 if invalid
 */
export function parsePrice(priceStr: string | number | undefined): number {
  if (priceStr === undefined || priceStr === null) return 0
  const parsed = typeof priceStr === "string" ? parseFloat(priceStr) : priceStr
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Format a token amount for display
 * @param amount - The amount value
 * @param decimals - Number of decimal places
 * @param symbol - Token symbol (optional)
 * @returns Formatted amount string
 */
export function formatTokenAmount(
  amount: string | number,
  decimals: number,
  symbol?: string
): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
  const divisor = 10 ** decimals
  const formatted = (numAmount / divisor).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  })
  return symbol ? `${formatted} ${symbol}` : formatted
}

/**
 * Convert wei/lamports to human readable amount
 * @param amount - The amount in smallest unit (wei/lamports)
 * @param decimals - Token decimals
 * @returns Human readable amount as number
 */
export function toReadableAmount(amount: string | bigint, decimals: number): number {
  const amountStr = typeof amount === "bigint" ? amount.toString() : amount
  const divisor = 10 ** decimals
  return parseFloat(amountStr) / divisor
}

/**
 * Convert human readable amount to wei/lamports
 * @param amount - The amount in human readable form
 * @param decimals - Token decimals
 * @returns Amount in smallest unit as string
 */
export function toSmallestUnit(amount: number | string, decimals: number): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
  const multiplier = 10 ** decimals
  return (numAmount * multiplier).toFixed(0)
}

/**
 * Format a USD value with appropriate precision
 * @param value - The USD value
 * @returns Formatted USD string
 */
export function formatUSD(value: number): string {
  if (value === 0) return "$0.00"
  if (value < 0.01) return "$0.00"
  if (value < 1) return `$${value.toFixed(4)}`
  if (value < 1000) return `$${value.toFixed(2)}`
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Calculate price impact percentage
 * @param inputAmount - Input amount
 * @param outputAmount - Output amount
 * @param inputDecimals - Input token decimals
 * @param outputDecimals - Output token decimals
 * @param marketPrice - Market price ratio
 * @returns Price impact percentage
 */
export function calculatePriceImpact(
  inputAmount: string,
  outputAmount: string,
  inputDecimals: number,
  outputDecimals: number,
  marketPrice: number
): number {
  const input = parseFloat(inputAmount) / 10 ** inputDecimals
  const output = parseFloat(outputAmount) / 10 ** outputDecimals

  if (input === 0 || marketPrice === 0) return 0

  const expectedOutput = input * marketPrice
  const impact = ((expectedOutput - output) / expectedOutput) * 100

  return Math.max(0, impact)
}

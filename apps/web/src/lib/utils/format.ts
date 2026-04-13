/**
 * Format a balance bigint to a human-readable string
 */
export function formatBalance(balance: bigint, decimals: number): string {
  if (balance === 0n) return "0"

  const divisor = 10n ** BigInt(decimals)
  const wholePart = balance / divisor
  const fractionalPart = balance % divisor

  if (fractionalPart === 0n) {
    return wholePart.toString()
  }

  // Pad fractional part to full decimal length
  const fractionalStr = fractionalPart.toString().padStart(decimals, "0")
  // Trim trailing zeros
  const trimmedFractional = fractionalStr.replace(/0+$/, "")

  if (trimmedFractional === "") {
    return wholePart.toString()
  }

  // Check if result has no whole part (less than 1)
  if (wholePart === 0n) {
    return `0.${trimmedFractional}`
  }

  return `${wholePart}.${trimmedFractional}`
}

/**
 * Shorten an Ethereum address
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return ""
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Get token id in format "${chainId}:${address}"
 */
export function getTokenId(chainId: number, address: string): string {
  return `${chainId}:${address.toLowerCase()}`
}

/**
 * Format a string amount with specified decimal places
 * @param amount - String representation of amount (e.g., "1000000")
 * @param decimals - Number of decimal places to show
 */
export function formatAmount(amount: string, decimals: number): string {
  const num = parseFloat(amount)
  if (isNaN(num)) return "0"

  const divisor = Math.pow(10, decimals)
  const result = num / divisor

  if (result === 0) return "0"
  if (result < 0.0001) return result.toExponential(2)

  return result.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals > 6 ? 6 : decimals,
  })
}

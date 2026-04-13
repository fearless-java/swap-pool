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

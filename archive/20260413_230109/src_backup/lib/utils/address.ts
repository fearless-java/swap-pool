/**
 * Address utility functions for EVM and Solana
 */

import type { EvmChainId, SvmChainId } from "../../types/chain"
import { isEvmChainId } from "../../types/chain"

/**
 * Check if an address is a valid EVM address
 * @param address - The address to check
 * @returns True if valid EVM address
 */
export function isValidEvmAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

/**
 * Check if an address is a valid Solana address (Base58)
 * @param address - The address to check
 * @returns True if valid Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  // Solana addresses are Base58 encoded, typically 32-44 characters
  if (!address || address.length < 32 || address.length > 44) return false
  return /^[1-9A-HJ-NP-Za-km-z]+$/.test(address)
}

/**
 * Normalize an EVM address to lowercase
 * @param address - The address to normalize
 * @returns Normalized address
 */
export function normalizeEvmAddress(address: string): string {
  return address.toLowerCase()
}

/**
 * Validate and normalize an address based on chain type
 * @param address - The address to validate
 * @param chainId - The chain ID
 * @returns Normalized address or null if invalid
 */
export function normalizeAddress(address: string, chainId: EvmChainId | SvmChainId): string | null {
  if (isEvmChainId(chainId)) {
    if (!isValidEvmAddress(address)) return null
    return normalizeEvmAddress(address)
  }
  // Solana
  if (!isValidSolanaAddress(address)) return null
  return address
}

/**
 * Truncate an EVM address for display
 * @param address - The address to truncate
 * @param startChars - Characters to show at start (default: 6)
 * @param endChars - Characters to show at end (default: 4)
 * @returns Truncated address
 */
export function truncateEvmAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address) return ""
  if (address.length <= startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

/**
 * Truncate a Solana address for display
 * @param address - The address to truncate
 * @param startChars - Characters to show at start (default: 6)
 * @param endChars - Characters to show at end (default: 4)
 * @returns Truncated address
 */
export function truncateSolanaAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address) return ""
  if (address.length <= startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

/**
 * Get the native token symbol for a chain
 * @param chainId - The chain ID
 * @returns Native token symbol
 */
export function getNativeTokenSymbol(chainId: EvmChainId | SvmChainId): string {
  if (isEvmChainId(chainId)) {
    const NATIVE_TOKENS: Record<EvmChainId, string> = {
      1: "ETH",
      137: "MATIC",
      42161: "ETH",
      10: "ETH",
      8453: "ETH",
      43114: "AVAX",
      324: "ETH",
      59144: "ETH",
    }
    return NATIVE_TOKENS[chainId] || "ETH"
  }
  return "SOL"
}

/**
 * Get the wrapped token address for a chain
 * @param chainId - The chain ID
 * @returns Wrapped token address
 */
export function getWrappedTokenAddress(chainId: EvmChainId | SvmChainId): string {
  if (isEvmChainId(chainId)) {
    const WRAPPED_TOKENS: Record<EvmChainId, string> = {
      1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
      137: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // WMATIC
      42161: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // WETH
      10: "0x4200000000000000000000000000000000000006", // WETH
      8453: "0x4200000000000000000000000000000000000006", // WETH
      43114: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", // WAVAX
      324: "0x5AEa71C1fB49C8d7aC77E0f87aB976F5C5cA7f9E", // WETH
      59144: "0x5d47bAbA1322a13c82B919F4a8302f46F2E3c1bE", // WETH
    }
    return WRAPPED_TOKENS[chainId] || "0x0000000000000000000000000000000000000000"
  }
  // Solana
  return "So11111111111111111111111111111111111111112" // wSOL
}

/**
 * Check if an address is a native token address
 * @param address - The address to check
 * @param chainId - The chain ID
 * @returns True if native token
 */
export function isNativeTokenAddress(address: string, chainId: EvmChainId | SvmChainId): boolean {
  if (isEvmChainId(chainId)) {
    return (
      address.toLowerCase() === "0x0000000000000000000000000000000000000000" ||
      address.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ||
      address.toLowerCase() === getNativeTokenSymbol(chainId).toLowerCase()
    )
  }
  // Solana
  return address === "So11111111111111111111111111111111111111112"
}

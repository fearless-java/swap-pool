/**
 * Token type definitions for SushiSwap clone
 */

/**
 * Token interface representing an ERC-20 token
 */
export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  chainId: number
  logoURI?: string
}

/**
 * TokenAmount representing a token amount
 */
export interface TokenAmount {
  token: Token
  amount: string
  formatted: string
}

/**
 * Currency representing either a native token (ETH, MATIC, etc.) or a Token
 * For native tokens, address is null
 */
export interface Currency {
  address: null | string
  symbol: string
  name: string
  decimals: number
  chainId: number
  logoURI?: string
}

/**
 * TokenPair representing a pair of tokens for swapping
 */
export interface TokenPair {
  token0: Token
  token1: Token
}

/**
 * TokenList representing a list of tokens (e.g., from a token list JSON)
 */
export interface TokenList {
  name: string
  tokens: Token[]
}

/**
 * Type guard to check if a value is a Token
 */
export function isToken(value: unknown): value is Token {
  if (!value || typeof value !== "object") return false
  const obj = value as Partial<Token>
  return (
    typeof obj.address === "string" &&
    typeof obj.symbol === "string" &&
    typeof obj.name === "string" &&
    typeof obj.decimals === "number" &&
    typeof obj.chainId === "number"
  )
}

/**
 * Type guard to check if a value is a Currency
 * Currency is similar to Token but address can be null (for native tokens)
 */
export function isCurrency(value: unknown): value is Currency {
  if (!value || typeof value !== "object") return false
  const obj = value as Partial<Currency>
  return (
    (obj.address === null || typeof obj.address === "string") &&
    typeof obj.symbol === "string" &&
    typeof obj.name === "string" &&
    typeof obj.decimals === "number" &&
    typeof obj.chainId === "number"
  )
}

/**
 * Helper to check if a Currency is a native token (ETH, MATIC, etc.)
 */
export function isNativeToken(currency: Currency): boolean {
  return currency.address === null
}

/**
 * Helper to check if two tokens are equal (same address on same chain)
 */
export function isSameToken(tokenA: Token, tokenB: Token): boolean {
  return tokenA.address === tokenB.address && tokenA.chainId === tokenB.chainId
}

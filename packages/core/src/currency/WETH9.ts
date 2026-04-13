/**
 * WETH9 (Wrapped Ether) token definitions
 */

import type { TokenCurrency } from './types'

/**
 * WETH9 token on Ethereum mainnet
 */
export const WETH9: TokenCurrency = {
  type: 'token',
  chainId: 1,
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  symbol: 'WETH',
  name: 'Wrapped Ether',
  decimals: 18,
  logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
}

/**
 * WETH9 token on Arbitrum
 */
export const WETH9_ARBITRUM: TokenCurrency = {
  type: 'token',
  chainId: 42161,
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  symbol: 'WETH',
  name: 'Wrapped Ether',
  decimals: 18,
}

/**
 * WETH9 token on Optimism
 */
export const WETH9_OPTIMISM: TokenCurrency = {
  type: 'token',
  chainId: 10,
  address: '0x4200000000000000000000000000000000000006',
  symbol: 'WETH',
  name: 'Wrapped Ether',
  decimals: 18,
}

/**
 * WETH9 token on Polygon
 */
export const WETH9_POLYGON: TokenCurrency = {
  type: 'token',
  chainId: 137,
  address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  symbol: 'WETH',
  name: 'Wrapped Ether',
  decimals: 18,
}

/**
 * WETH9 token on Base
 */
export const WETH9_BASE: TokenCurrency = {
  type: 'token',
  chainId: 8453,
  address: '0x4200000000000000000000000000000000000006',
  symbol: 'WETH',
  name: 'Wrapped Ether',
  decimals: 18,
}

/**
 * WETH9 token on zkSync Era
 */
export const WETH9_ZKSYNC: TokenCurrency = {
  type: 'token',
  chainId: 324,
  address: '0x5AEa5776659D2E58Ea0686c4A88599F64a6F0B36',
  symbol: 'WETH',
  name: 'Wrapped Ether',
  decimals: 18,
}

/**
 * Map of chain ID to WETH9 token on that chain
 */
export const WETH9_MAP: Record<number, TokenCurrency> = {
  1: WETH9,
  42161: WETH9_ARBITRUM,
  10: WETH9_OPTIMISM,
  137: WETH9_POLYGON,
  8453: WETH9_BASE,
  324: WETH9_ZKSYNC,
}

/**
 * Get WETH9 token by chain ID
 * @param chainId - The chain ID
 * @returns The WETH9 token or undefined if not supported
 */
export function getWETH9(chainId: number): TokenCurrency | undefined {
  return WETH9_MAP[chainId]
}

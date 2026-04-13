/**
 * Price type definitions for token prices
 */

import type { ChainId } from "./chain"

/**
 * Token price data structure
 */
export interface TokenPrice {
  address: string
  chainId: ChainId
  price: number // USD price
  price24hChange?: number // 24h price change percentage
  lastUpdated: number // timestamp
}

/**
 * Price Map structure - key = chainId:address
 */
export type PriceMap = Map<string, TokenPrice>

/**
 * Create a price map key from chain ID and address
 */
export function createPriceKey(chainId: ChainId, address: string): string {
  return `${chainId}:${address.toLowerCase()}`
}

/**
 * Parse a price map key into chain ID and address
 */
export function parsePriceKey(key: string): { chainId: ChainId; address: string } {
  const [chainIdStr, address] = key.split(":")
  const chainId = Number(chainIdStr) as ChainId
  return { chainId, address }
}

/**
 * CoinGecko coin ID mapping for common tokens
 * In production, this should be fetched from CoinGecko's /coins/list endpoint
 */
export const COINGECKO_COIN_IDS: Record<string, string> = {
  "1:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "wrapped-ether",
  "1:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "usd-coin",
  "1:0xdac17f958d2ee523a2206206994597c13d831ec7": "tether",
  "1:0x6b175474e89094c44da98b954eedeac495271d0f": "dai",
  "1:0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": "wrapped-bitcoin",
  "137:0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270": "wmatic",
  "137:0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": "weth",
  "137:0x2791bca1f2de4661ed88a30c99a7a9449aa84174": "usd-coin",
  "137:0xc2132d05d31c914a87c6611c10748aeb04b58e8f": "tether",
  "42161:0x82af49447d8a07e3bd95bd0d56f35241523fbab1": "weth",
  "42161:0xaf88d065e77c8cc2239327c5edb3a432268e5831": "usd-coin",
  "42161:0xfd086bc7cd5c481dcc9c85ebe478a1c0b69d19b": "tether",
  "8453:0x4200000000000000000000000000000000000006": "weth",
  "8453:0x50c5725949a6f0c72e6c4a641af24f2399e0265b": "usd-coin",
  "mainnet:So11111111111111111111111111111111111111112": "wrapped-sol",
  "mainnet:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "usd-coin",
  "mainnet:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": "tether",
}

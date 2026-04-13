/**
 * CoinGecko API integration for token prices
 * Free API, no API key required (rate limited)
 */

import type { ChainId } from "../../types/chain"
import { createPriceKey } from "../../types/price"

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

/**
 * CoinGecko simple price response
 */
export interface CoinGeckoSimplePriceResponse {
  [coinId: string]: {
    usd?: number
    usd_24h_change?: number
    usd_24h_vol?: number
    usd_market_cap?: number
  }
}

/**
 * Get token prices from CoinGecko
 * @param coinIds - Array of CoinGecko coin IDs
 * @param currencies - Array of currency codes (default: ['usd'])
 */
export async function getTokenPrices(
  coinIds: string[],
  currencies: string[] = ["usd"]
): Promise<CoinGeckoSimplePriceResponse> {
  if (coinIds.length === 0) return {}

  const ids = coinIds.join(",")
  const vs_currencies = currencies.join(",")

  const url = `${COINGECKO_BASE_URL}/simple/price?ids=${ids}&vs_currencies=${vs_currencies}&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get coin info from CoinGecko
 * @param coinId - CoinGecko coin ID
 */
export interface CoinGeckoCoinInfo {
  id: string
  symbol: string
  name: string
  description?: {
    en?: string
  }
  image?: {
    thumb?: string
    small?: string
    large?: string
  }
  market_data?: {
    current_price?: Record<string, number>
    price_change_24h?: number
    price_change_percentage_24h?: number
  }
}

export async function getCoinInfo(coinId: string): Promise<CoinGeckoCoinInfo | null> {
  const url = `${COINGECKO_BASE_URL}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    return response.json()
  } catch {
    return null
  }
}

/**
 * Search for coins on CoinGecko
 */
export interface CoinGeckoSearchResult {
  coins: Array<{
    id: string
    name: string
    symbol: string
    thumb?: string
  }>
}

export async function searchCoins(query: string): Promise<CoinGeckoSearchResult> {
  const url = `${COINGECKO_BASE_URL}/search?query=${encodeURIComponent(query)}`

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Convert chain ID and token address to CoinGecko coin ID
 * This is a simplified version - in production, you'd maintain a more comprehensive mapping
 */
export function getCoinGeckoId(chainId: ChainId, tokenAddress: string): string | null {
  const key = createPriceKey(chainId, tokenAddress)

  // Common token mappings
  const COMMON_TOKENS: Record<string, string> = {
    // Ethereum
    "1:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "wrapped-ether",
    "1:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "usd-coin",
    "1:0xdac17f958d2ee523a2206206994597c13d831ec7": "tether",
    "1:0x6b175474e89094c44da98b954eedeac495271d0f": "dai",
    "1:0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": "wrapped-bitcoin",
    "1:0x0000000000000000000000000000000000000000": "ethereum",
    // Polygon
    "137:0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270": "wmatic",
    "137:0x7ceb23fd6bc0add59e62ac25578270cff1b9f619": "weth",
    "137:0x2791bca1f2de4661ed88a30c99a7a9449aa84174": "usd-coin",
    "137:0xc2132d05d31c914a87c6611c10748aeb04b58e8f": "tether",
    // Arbitrum
    "42161:0x82af49447d8a07e3bd95bd0d56f35241523fbab1": "weth",
    "42161:0xaf88d065e77c8cc2239327c5edb3a432268e5831": "usd-coin",
    // Base
    "8453:0x4200000000000000000000000000000000000006": "weth",
    "8453:0x50c5725949a6f0c72e6c4a641af24f2399e0265b": "usd-coin",
  }

  return COMMON_TOKENS[key.toLowerCase()] || null
}

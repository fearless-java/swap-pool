/**
 * 0x API integration for EVM trade quotes
 * Free tier with rate limiting
 */

import type { EvmChainId } from "../../types/chain"

/**
 * 0x Quote request parameters
 */
export interface ZeroXQuoteParams {
  chainId: EvmChainId
  sellToken: string // Token address or symbol (e.g., "ETH", "0x..."))
  buyToken: string // Token address or symbol
  sellAmount?: string // Amount in wei (string for bigint compatibility)
  buyAmount?: string // Target buy amount
  slippagePercentage?: number // Default 0.5%
}

/**
 * 0x Quote response
 */
export interface ZeroXQuote {
  chainId: number
  price: string // Effective price
  guaranteedPrice: string // Worst case price after slippage
  estimatedPriceImpact?: string
  to: string // Router address
  data: string // Transaction data
  value: string // ETH value
  gas: string // Estimated gas
  gasPrice: string // Current gas price
  protocolFee: string // Protocol fee
  minimumProtocolFee: string // Minimum protocol fee
  buyTokenAddress: string
  sellTokenAddress: string
  buyAmount: string // Expected buy amount
  sellAmount: string // Sell amount
  sources: Array<{
    name: string
    proportion: string
  }> // Liquidity sources and their proportions
}

/**
 * Get 0x API base URL for a chain
 */
function getZeroXBaseUrl(chainId: EvmChainId): string {
  const CHAIN_URLS: Record<EvmChainId, string> = {
    1: "https://api.0x.org",
    137: "https://api.0x.org",
    42161: "https://api.0x.org",
    10: "https://api.0x.org",
    8453: "https://api.0x.org",
    43114: "https://api.0x.org",
    324: "https://api.0x.org",
    59144: "https://api.0x.org",
  }
  return CHAIN_URLS[chainId] || "https://api.0x.org"
}

/**
 * Get trade quote from 0x API
 */
export async function getEvmTradeQuote(params: ZeroXQuoteParams): Promise<ZeroXQuote | null> {
  const { chainId, sellToken, buyToken, sellAmount, buyAmount, slippagePercentage = 0.5 } = params

  const baseUrl = getZeroXBaseUrl(chainId)
  const queryParams = new URLSearchParams({
    sellToken,
    buyToken,
    slippagePercentage: slippagePercentage.toString(),
  })

  if (sellAmount) {
    queryParams.set("sellAmount", sellAmount)
  } else if (buyAmount) {
    queryParams.set("buyAmount", buyAmount)
  }

  const url = `${baseUrl}/swap/v1/quote?${queryParams.toString()}`

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        // 0x API recommends including this header
        "0x-api-version": "1.0.0",
      },
    })

    if (!response.ok) {
      if (response.status === 404) return null
      if (response.status === 429) {
        throw new Error("0x API rate limited")
      }
      throw new Error(`0x API error: ${response.status}`)
    }

    const data = await response.json()
    return data as ZeroXQuote
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch 0x quote")
  }
}

/**
 * Get available liquidity sources for a chain
 */
export async function getZeroXLiquiditySources(chainId: EvmChainId): Promise<
  Array<{
    name: string
    displayName: string
  }>
> {
  const baseUrl = getZeroXBaseUrl(chainId)

  try {
    // This endpoint returns available sources
    const response = await fetch(`${baseUrl}/swap/v1/sources?chainId=${chainId}`, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return getDefaultSources()
    }

    const data = await response.json()
    return data.sources || getDefaultSources()
  } catch {
    return getDefaultSources()
  }
}

/**
 * Default liquidity sources if API fails
 */
function getDefaultSources() {
  return [
    { name: "Uniswap_V2", displayName: "Uniswap V2" },
    { name: "Uniswap_V3", displayName: "Uniswap V3" },
    { name: "SushiSwap", displayName: "SushiSwap" },
    { name: "Curve", displayName: "Curve" },
    { name: "Balancer", displayName: "Balancer" },
  ]
}

/**
 * Check if a token is native ETH
 */
export function isNativeEth(tokenAddress: string): boolean {
  return (
    tokenAddress.toLowerCase() === "eth" ||
    tokenAddress.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  )
}

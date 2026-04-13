"use client"

/**
 * useEvmTradeQuote - Hook for fetching EVM chain trade quotes using 0x API
 * Supports Ethereum, Polygon, Arbitrum, Optimism, Base, and other EVM chains
 */

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import type { EvmChainId } from "../../types/chain"
import { getEvmTradeQuote, type ZeroXQuote } from "../../lib/api/zero-x"
import { parsePrice } from "../../lib/utils/price"
import { isNativeEth } from "../../lib/api/zero-x"

/**
 * Trade quote parameters
 */
export interface EvmTradeQuoteParams {
  chainId: EvmChainId
  fromToken: string // Token address or symbol
  toToken: string // Token address or symbol
  amount: string // Amount in wei (string for bigint compatibility)
  slippagePercentage?: number // Default 0.5%
  enabled?: boolean
}

/**
 * Normalized trade quote response
 */
export interface EvmTradeQuote {
  amountIn: bigint
  amountOut: bigint
  priceImpact: number // Percentage
  route: {
    path: string[] // Token addresses in the route
    proportions: number[] // Proportion from each source
  }
  gasEstimate: bigint
  gasEstimateUsd?: number // Estimated gas cost in USD
  sources: Array<{
    name: string
    proportion: number
  }>
  rawQuote: ZeroXQuote
}

/**
 * Query key factory for EVM trade quotes
 */
export const evmTradeQuoteKeys = {
  all: ["evm-trade-quote"] as const,
  lists: () => [...evmTradeQuoteKeys.all, "list"] as const,
  list: (filters: string) => [...evmTradeQuoteKeys.lists(), { filters }] as const,
  details: () => [...evmTradeQuoteKeys.all, "detail"] as const,
  detail: (params: EvmTradeQuoteParams) => [...evmTradeQuoteKeys.details(), { ...params }] as const,
}

/**
 * Normalize 0x quote to our format
 */
function normalizeQuote(quote: ZeroXQuote): EvmTradeQuote {
  return {
    amountIn: BigInt(quote.sellAmount),
    amountOut: BigInt(quote.buyAmount),
    priceImpact: parsePrice(quote.estimatedPriceImpact),
    route: {
      path: [quote.sellTokenAddress, quote.buyTokenAddress],
      proportions: quote.sources.map((s) => parseFloat(s.proportion)),
    },
    gasEstimate: BigInt(quote.gas),
    sources: quote.sources.map((s) => ({
      name: s.name,
      proportion: parseFloat(s.proportion),
    })),
    rawQuote: quote,
  }
}

/**
 * useEvmTradeQuote - Hook for fetching EVM chain trade quotes
 */
export function useEvmTradeQuote(params: EvmTradeQuoteParams) {
  const {
    chainId,
    fromToken,
    toToken,
    amount,
    slippagePercentage = 0.5,
    enabled = true,
  } = params

  const queryKey = useMemo(
    () =>
      evmTradeQuoteKeys.detail({
        chainId,
        fromToken,
        toToken,
        amount,
        slippagePercentage,
        enabled,
      }),
    [chainId, fromToken, toToken, amount, slippagePercentage, enabled]
  )

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const quote = await getEvmTradeQuote({
        chainId,
        sellToken: fromToken,
        buyToken: toToken,
        sellAmount: amount,
        slippagePercentage,
      })

      if (!quote) {
        throw new Error("No quote available")
      }

      return normalizeQuote(quote)
    },
    enabled: enabled && Boolean(fromToken) && Boolean(toToken) && Boolean(amount) && Number(amount) > 0,
    staleTime: 1000, // 1 second - quotes are volatile
    refetchInterval: 2500, // 2.5 seconds - high frequency polling for quotes
    refetchOnWindowFocus: true,
    gcTime: 0, // Don't cache - quotes should be fresh
    retry: false, // Don't retry - fail fast
  })

  return {
    quote: query.data ?? null,
    amountIn: query.data?.amountIn ?? BigInt(0),
    amountOut: query.data?.amountOut ?? BigInt(0),
    priceImpact: query.data?.priceImpact ?? 0,
    gasEstimate: query.data?.gasEstimate ?? BigInt(0),
    gasEstimateUsd: query.data?.gasEstimateUsd,
    sources: query.data?.sources ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    error: query.error as Error | null,
    refetch: query.refetch,
  }
}

/**
 * useEvmTradeQuoteExactIn - Hook for exact input trades (most common)
 */
export function useEvmTradeQuoteExactIn(
  chainId: EvmChainId,
  fromToken: string,
  toToken: string,
  amountIn: string,
  slippagePercentage: number = 0.5,
  enabled: boolean = true
) {
  return useEvmTradeQuote({
    chainId,
    fromToken,
    toToken,
    amount: amountIn,
    slippagePercentage,
    enabled,
  })
}

/**
 * useEvmTradeQuoteExactOut - Hook for exact output trades
 */
export function useEvmTradeQuoteExactOut(
  chainId: EvmChainId,
  fromToken: string,
  toToken: string,
  amountOut: string,
  slippagePercentage: number = 0.5,
  enabled: boolean = true
) {
  return useEvmTradeQuote({
    chainId,
    fromToken,
    toToken,
    amount: amountOut,
    slippagePercentage,
    enabled,
  })
}

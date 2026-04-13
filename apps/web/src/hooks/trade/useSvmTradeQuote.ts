"use client"

/**
 * useSvmTradeQuote - Hook for fetching Solana chain trade quotes using Jupiter API
 * Supports Solana mainnet, devnet, and testnet
 */

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import type { SvmChainId } from "../../types/chain"
import { getSvmTradeQuote, type JupiterQuote } from "../../lib/api/jupiter"
import { isNativeSol } from "../../lib/api/jupiter"

/**
 * Trade quote parameters for Solana
 */
export interface SvmTradeQuoteParams {
  chainId: SvmChainId
  fromToken: string // Solana token address (Base58)
  toToken: string // Solana token address (Base58)
  amount: string // Amount in lamports (string for bigint compatibility)
  slippageBps?: number // Slippage in basis points (default: 50 = 0.5%)
  enabled?: boolean
}

/**
 * Normalized Solana trade quote response
 */
export interface SvmTradeQuote {
  amountIn: bigint
  amountOut: bigint
  priceImpact: number // Percentage
  minimumAmountOut: bigint // Worst case output with slippage
  route: {
    path: string[] // Token addresses in the route
    ammKeys: string[] // AMM program keys
    labels: string[] // DEX labels
  }
  swapMode: string
  rawQuote: JupiterQuote
}

/**
 * Query key factory for SVM trade quotes
 */
export const svmTradeQuoteKeys = {
  all: ["svm-trade-quote"] as const,
  lists: () => [...svmTradeQuoteKeys.all, "list"] as const,
  list: (filters: string) => [...svmTradeQuoteKeys.lists(), { filters }] as const,
  details: () => [...svmTradeQuoteKeys.all, "detail"] as const,
  detail: (params: SvmTradeQuoteParams) => [...svmTradeQuoteKeys.details(), { ...params }] as const,
}

/**
 * Normalize Jupiter quote to our format
 */
function normalizeQuote(quote: JupiterQuote): SvmTradeQuote {
  return {
    amountIn: BigInt(quote.inAmount),
    amountOut: BigInt(quote.outAmount),
    minimumAmountOut: BigInt(quote.otherAmountThreshold),
    priceImpact: parseFloat(quote.priceImpactPct) * 100, // Convert to percentage
    route: {
      path: quote.routePlan.map((r) => r.swapInfo.inputMint),
      ammKeys: quote.routePlan.map((r) => r.swapInfo.ammKey),
      labels: quote.routePlan.map((r) => r.swapInfo.label),
    },
    swapMode: quote.swapMode,
    rawQuote: quote,
  }
}

/**
 * Parse a string to number safely
 */
function parsePrice(value: string): number {
  const parsed = parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * useSvmTradeQuote - Hook for fetching Solana chain trade quotes
 */
export function useSvmTradeQuote(params: SvmTradeQuoteParams) {
  const {
    chainId,
    fromToken,
    toToken,
    amount,
    slippageBps = 50, // 0.5% default
    enabled = true,
  } = params

  const queryKey = useMemo(
    () =>
      svmTradeQuoteKeys.detail({
        chainId,
        fromToken,
        toToken,
        amount,
        slippageBps,
        enabled,
      }),
    [chainId, fromToken, toToken, amount, slippageBps, enabled]
  )

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const quote = await getSvmTradeQuote({
        chainId,
        inputMint: fromToken,
        outputMint: toToken,
        amount,
        slippageBps,
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
    minimumAmountOut: query.data?.minimumAmountOut ?? BigInt(0),
    priceImpact: query.data?.priceImpact ?? 0,
    route: query.data?.route ?? { path: [], ammKeys: [], labels: [] },
    swapMode: query.data?.swapMode ?? "ExactIn",
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    error: query.error as Error | null,
    refetch: query.refetch,
  }
}

/**
 * useSvmTradeQuoteExactIn - Hook for exact input trades on Solana (most common)
 */
export function useSvmTradeQuoteExactIn(
  chainId: SvmChainId,
  fromToken: string,
  toToken: string,
  amountIn: string,
  slippageBps: number = 50,
  enabled: boolean = true
) {
  return useSvmTradeQuote({
    chainId,
    fromToken,
    toToken,
    amount: amountIn,
    slippageBps,
    enabled,
  })
}

/**
 * useSvmTradeQuoteExactOut - Hook for exact output trades on Solana
 */
export function useSvmTradeQuoteExactOut(
  chainId: SvmChainId,
  fromToken: string,
  toToken: string,
  amountOut: string,
  slippageBps: number = 50,
  enabled: boolean = true
) {
  return useSvmTradeQuote({
    chainId,
    fromToken,
    toToken,
    amount: amountOut,
    slippageBps,
    enabled,
  })
}

/**
 * Format lamports to SOL
 */
export function lamportsToSol(lamports: string | bigint): number {
  const lamportsNum = typeof lamports === "bigint" ? Number(lamports) : parseFloat(lamports)
  return lamportsNum / 1_000_000_000
}

/**
 * Format SOL to lamports
 */
export function solToLamports(sol: number): string {
  return Math.round(sol * 1_000_000_000).toString()
}

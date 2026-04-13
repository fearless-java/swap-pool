"use client"

/**
 * useTokenPrice - Hook for fetching a single token price
 * Uses TanStack Query for caching and the price context for state management
 */

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import type { ChainId } from "../../types/chain"
import { createPriceKey, type TokenPrice } from "../../types/price"
import { getCoinGeckoId, getTokenPrices } from "../../lib/api/coingecko"
import { usePriceContext } from "../../context/PriceProvider"

/**
 * Query key factory for single token price
 */
export const tokenPriceKeys = {
  all: ["token-price"] as const,
  lists: () => [...tokenPriceKeys.all, "list"] as const,
  list: (filters: string) => [...tokenPriceKeys.lists(), { filters }] as const,
  details: () => [...tokenPriceKeys.all, "detail"] as const,
  detail: (chainId: ChainId, address: string) =>
    [...tokenPriceKeys.details(), { chainId, address }] as const,
}

/**
 * Fetch a single token price from CoinGecko
 */
async function fetchTokenPrice(chainId: ChainId, address: string): Promise<TokenPrice | null> {
  const coinId = getCoinGeckoId(chainId, address)
  if (!coinId) return null

  const priceData = await getTokenPrices([coinId])
  const data = priceData[coinId]

  if (!data) return null

  return {
    address,
    chainId,
    price: data.usd ?? 0,
    price24hChange: data.usd_24h_change,
    lastUpdated: Date.now(),
  }
}

/**
 * useTokenPrice - Hook for fetching a single token price
 */
export function useTokenPrice(
  chainId: ChainId,
  address: string,
  options?: {
    enabled?: boolean
    staleTime?: number
    refetchInterval?: number
  }
) {
  const { updatePrice } = usePriceContext()

  const enabled = options?.enabled !== false
  const staleTime = options?.staleTime ?? 30 * 1000 // 30 seconds default
  const refetchInterval = options?.refetchInterval ?? 30 * 1000 // 30 seconds default

  const queryKey = useMemo(
    () => tokenPriceKeys.detail(chainId, address),
    [chainId, address]
  )

  const query = useQuery({
    queryKey,
    queryFn: () => fetchTokenPrice(chainId, address),
    enabled,
    staleTime,
    refetchInterval,
    refetchOnWindowFocus: true,
    gcTime: 5 * 60 * 1000, // 5 minutes
  })

  // Update context when price changes
  if (query.data) {
    updatePrice(chainId, address, query.data)
  }

  return {
    price: query.data?.price ?? null,
    priceData: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error as Error | null,
    refetch: query.refetch,
    lastUpdated: query.data?.lastUpdated ?? null,
  }
}

/**
 * useTokenPriceFromContext - Hook for getting price from context only (no fetch)
 * Use this when prices are already loaded via useTokenPrices
 */
export function useTokenPriceFromContext(chainId: ChainId, address: string): TokenPrice | undefined {
  const { getPrice } = usePriceContext()
  return useMemo(() => getPrice(chainId, address), [getPrice, chainId, address])
}

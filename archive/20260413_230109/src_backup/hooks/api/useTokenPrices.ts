"use client"

/**
 * useTokenPrices - Hook for batch fetching multiple token prices
 * Uses TanStack Query for caching and CoinGecko API for data
 */

import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import type { ChainId } from "../../types/chain"
import { createPriceKey, type TokenPrice, type PriceMap } from "../../types/price"
import { getCoinGeckoId, getTokenPrices } from "../../lib/api/coingecko"
import { usePriceContext } from "../../context/PriceProvider"

/**
 * Token price request parameters
 */
export interface TokenPriceRequest {
  chainId: ChainId
  address: string
}

/**
 * Fetch prices from CoinGecko API
 */
async function fetchTokenPrices(requests: TokenPriceRequest[]): Promise<PriceMap> {
  // Group requests by chain type for proper API calls
  const coinGeckoRequests: TokenPriceRequest[] = []

  for (const request of requests) {
    const coinId = getCoinGeckoId(request.chainId, request.address)
    if (coinId) {
      coinGeckoRequests.push(request)
    }
  }

  if (coinGeckoRequests.length === 0) {
    return new Map()
  }

  // Get CoinGecko coin IDs
  const coinIds = coinGeckoRequests
    .map((r) => getCoinGeckoId(r.chainId, r.address))
    .filter((id): id is string => id !== null)

  if (coinIds.length === 0) {
    return new Map()
  }

  // Fetch prices from CoinGecko
  const priceData = await getTokenPrices(coinIds)

  // Convert to PriceMap
  const prices = new Map<string, TokenPrice>()
  const timestamp = Date.now()

  for (const request of coinGeckoRequests) {
    const coinId = getCoinGeckoId(request.chainId, request.address)
    if (!coinId) continue

    const data = priceData[coinId]
    if (!data) continue

    const key = createPriceKey(request.chainId, request.address)
    prices.set(key, {
      address: request.address,
      chainId: request.chainId,
      price: data.usd ?? 0,
      price24hChange: data.usd_24h_change,
      lastUpdated: timestamp,
    })
  }

  return prices
}

/**
 * Query key factory for token prices
 */
export const tokenPricesKeys = {
  all: ["token-prices"] as const,
  lists: () => [...tokenPricesKeys.all, "list"] as const,
  list: (filters: string) => [...tokenPricesKeys.lists(), { filters }] as const,
  details: () => [...tokenPricesKeys.all, "detail"] as const,
  detail: (chainId: ChainId, address: string) => [...tokenPricesKeys.details(), { chainId, address }] as const,
}

/**
 * useTokenPrices - Hook for batch fetching multiple token prices
 */
export function useTokenPrices(
  tokens: TokenPriceRequest[],
  options?: {
    enabled?: boolean
    staleTime?: number
    refetchInterval?: number
  }
) {
  const { setPrices, updatePrice } = usePriceContext()

  const enabled = options?.enabled !== false && tokens.length > 0
  const staleTime = options?.staleTime ?? 30 * 1000 // 30 seconds default
  const refetchInterval = options?.refetchInterval ?? 30 * 1000 // 30 seconds default

  const queryKey = useMemo(
    () => tokenPricesKeys.list(JSON.stringify(tokens.sort())),
    [tokens]
  )

  const query = useQuery({
    queryKey,
    queryFn: () => fetchTokenPrices(tokens),
    enabled,
    staleTime,
    refetchInterval,
    refetchOnWindowFocus: true,
    gcTime: 5 * 60 * 1000, // 5 minutes
  })

  // Update context when prices change
  useEffect(() => {
    if (query.data && query.data.size > 0) {
      // Update all prices at once
      setPrices(query.data)
    }
  }, [query.data, setPrices])

  return {
    prices: query.data ?? new Map(),
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error as Error | null,
    refetch: query.refetch,
  }
}

/**
 * useTokenPricesByChain - Hook for fetching prices grouped by chain
 */
export function useTokenPricesByChain(
  tokensByChain: Record<number, string[]>,
  options?: {
    enabled?: boolean
    staleTime?: number
    refetchInterval?: number
  }
) {
  // Flatten tokens for the main hook
  const tokens = useMemo(() => {
    const result: TokenPriceRequest[] = []
    for (const [chainIdStr, addresses] of Object.entries(tokensByChain)) {
      const chainId = Number(chainIdStr) as ChainId
      for (const address of addresses) {
        result.push({ chainId, address })
      }
    }
    return result
  }, [tokensByChain])

  return useTokenPrices(tokens, options)
}

"use client"

import { useQuery } from "@tanstack/react-query"
import { tokens } from "@/lib/tokens/constants"
import { EvmChainId, Token } from "@/lib/tokens/types"

interface UseTrendingTokensParams {
  chainId: EvmChainId | undefined
  limit?: number
}

interface UseTrendingTokensResult {
  tokens: Token[]
  isLoading: boolean
  isError: boolean
}

const DEFAULT_LIMIT = 20

export function useTrendingTokens({
  chainId,
  limit = DEFAULT_LIMIT,
}: UseTrendingTokensParams): UseTrendingTokensResult {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["trendingTokens", chainId, limit],
    queryFn: async () => {
      if (!chainId) return []

      // Filter by chain and return top tokens by index (simulating popularity)
      // In a real app, this could come from an API or be based on volume data
      return tokens
        .filter((token) => token.chainId === chainId)
        .slice(0, limit)
    },
    staleTime: 3600 * 1000, // 1 hour
    enabled: Boolean(chainId),
  })

  return {
    tokens: data || [],
    isLoading,
    isError,
  }
}

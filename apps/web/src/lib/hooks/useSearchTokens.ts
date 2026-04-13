"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { tokens } from "@/lib/tokens/constants"
import { useMemo } from "react"
import { EvmChainId, Token } from "@/lib/tokens/types"

interface UseSearchTokensParams {
  chainId: EvmChainId | undefined
  search?: string
  pageSize?: number
  customTokens?: string[]
}

interface UseSearchTokensResult {
  tokens: Token[]
  hasMore: boolean
  isLoading: boolean
  isError: boolean
  fetchNextPage: () => void
}

const DEFAULT_PAGE_SIZE = 20

export function useSearchTokens({
  chainId,
  search,
  pageSize = DEFAULT_PAGE_SIZE,
  customTokens = [],
}: UseSearchTokensParams): UseSearchTokensResult {
  const queryKey = ["searchTokens", chainId, search, customTokens.sort().join(",")]

  const filteredTokens = useMemo(() => {
    if (!chainId) return []

    let filtered = tokens.filter((token) => token.chainId === chainId)

    // Filter by custom tokens if provided
    if (customTokens.length > 0) {
      const customTokenSet = new Set(customTokens.map((t) => t.toLowerCase()))
      filtered = filtered.filter(
        (token) => customTokenSet.has(token.address.toLowerCase())
      )
    }

    // Filter by search query
    if (search && search.trim()) {
      const searchLower = search.toLowerCase().trim()
      filtered = filtered.filter(
        (token) =>
          token.symbol.toLowerCase().includes(searchLower) ||
          token.name.toLowerCase().includes(searchLower) ||
          token.address.toLowerCase() === searchLower
      )
    }

    return filtered
  }, [chainId, search, customTokens])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam * pageSize
      const end = start + pageSize
      return filteredTokens.slice(start, end)
    },
    getNextPageParam: (_, allPages) => {
      const totalFetched = allPages.reduce((acc, page) => acc + page.length, 0)
      if (totalFetched < filteredTokens.length) {
        return allPages.length
      }
      return undefined
    },
    initialPageParam: 0,
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: Boolean(chainId),
  })

  const allTokens = useMemo(() => {
    if (!data) return []
    return data.pages.flat()
  }, [data])

  return {
    tokens: allTokens,
    hasMore: Boolean(hasNextPage),
    isLoading,
    isError,
    fetchNextPage,
  }
}

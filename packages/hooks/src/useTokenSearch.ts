import { useMemo } from 'react'
import { useAllTokens } from './useAllTokens'

interface TokenListToken {
  address: string
  chainId: number
  decimals: number
  symbol: string
  name: string
  logoURI?: string
}

interface UseTokenSearchParams {
  addresses: Array<{ address: string; chainId: number }>
  searchQuery: string
  chainId?: number
  limit?: number
}

/**
 * Type guard to validate Ethereum address format
 */
function isValidEthAddress(address: string): address is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function useTokenSearch({
  addresses,
  searchQuery,
  chainId,
  limit = 10,
}: UseTokenSearchParams) {
  // Filter and validate addresses before passing to useAllTokens
  const validAddresses = addresses
    .filter((a): a is { address: `0x${string}`; chainId: number } => isValidEthAddress(a.address))

  const { tokens, isLoading: isLoadingTokens } = useAllTokens({
    addresses: validAddresses,
  })

  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) return tokens.slice(0, limit)

    const query = searchQuery.toLowerCase().trim()
    const isAddress = /^0x[a-fA-F0-9]{40}$/.test(query)

    return tokens
      .filter((token) => {
        // Filter by chain if specified
        if (chainId && token.chainId !== chainId) return false

        if (isAddress) {
          return token.address.toLowerCase() === query
        }

        return (
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query) ||
          token.address.toLowerCase().includes(query)
        )
      })
      .slice(0, limit)
  }, [tokens, searchQuery, chainId, limit])

  return {
    tokens: filteredTokens,
    isLoading: isLoadingTokens,
  }
}

import { useQuery } from '@tanstack/react-query'
import { getEvmTradeQuote } from '@/lib/api/zero-x'
import type { EvmChainId } from '@/types/chain'
import type { Address } from 'viem'

interface UseEvmTradeQuoteParams {
  chainId: EvmChainId
  tokenIn?: Address
  tokenOut?: Address
  fromToken?: Address
  toToken?: Address
  amountIn: string
  slippagePercentage?: number
  enabled?: boolean
}

export function useEvmTradeQuote({
  chainId,
  tokenIn,
  tokenOut,
  fromToken,
  toToken,
  amountIn,
  slippagePercentage = 0.5,
  enabled = true,
}: UseEvmTradeQuoteParams) {
  // Support both tokenIn/tokenOut and fromToken/toToken naming conventions
  const actualTokenIn = tokenIn ?? fromToken
  const actualTokenOut = tokenOut ?? toToken

  const queryResult = useQuery({
    queryKey: ['evm-trade-quote', chainId, actualTokenIn, actualTokenOut, amountIn, slippagePercentage],
    queryFn: async () => {
      if (!amountIn || parseFloat(amountIn) <= 0) return null

      const quote = await getEvmTradeQuote({
        chainId,
        tokenIn: actualTokenIn,
        tokenOut: actualTokenOut,
        amountIn,
        slippagePercentage,
      })

      return quote
    },
    enabled: enabled && !!chainId && !!actualTokenIn && !!actualTokenOut && !!amountIn,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes cache
    refetchInterval: false, // Disable auto-refetch
    refetchOnWindowFocus: false,
  })

  // Transform useQuery result to expose quote and isLoading as expected by consumers
  return {
    ...queryResult,
    quote: queryResult.data ?? null,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    isError: queryResult.isError,
  }
}

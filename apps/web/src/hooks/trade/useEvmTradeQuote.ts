import { useQuery } from '@tanstack/react-query'
import { getEvmTradeQuote } from '@/lib/api/zero-x'
import type { EvmChainId } from '@/types/chain'
import type { Address } from 'viem'

interface UseEvmTradeQuoteParams {
  chainId: EvmChainId
  tokenIn: Address
  tokenOut: Address
  amountIn: string
  slippagePercentage?: number
  enabled?: boolean
}

export function useEvmTradeQuote({
  chainId,
  tokenIn,
  tokenOut,
  amountIn,
  slippagePercentage = 0.5,
  enabled = true,
}: UseEvmTradeQuoteParams) {
  return useQuery({
    queryKey: ['evm-trade-quote', chainId, tokenIn, tokenOut, amountIn, slippagePercentage],
    queryFn: async () => {
      if (!amountIn || parseFloat(amountIn) <= 0) return null

      const quote = await getEvmTradeQuote({
        chainId,
        tokenIn,
        tokenOut,
        amountIn,
        slippagePercentage,
      })

      return quote
    },
    enabled: enabled && !!chainId && !!tokenIn && !!tokenOut && !!amountIn,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes cache
    refetchInterval: false, // Disable auto-refetch
    refetchOnWindowFocus: false,
  })
}

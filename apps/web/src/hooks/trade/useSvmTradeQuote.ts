import { useQuery } from '@tanstack/react-query'
import { getSvmTradeQuote } from '@/lib/api/jupiter'
import type { SvmChainId } from '@/types/chain'

interface UseSvmTradeQuoteParams {
  chainId: SvmChainId
  inputMint: string
  outputMint: string
  amount: string
  slippageBps?: number
  enabled?: boolean
}

export function useSvmTradeQuote({
  chainId,
  inputMint,
  outputMint,
  amount,
  slippageBps = 50,
  enabled = true,
}: UseSvmTradeQuoteParams) {
  return useQuery({
    queryKey: ['svm-trade-quote', chainId, inputMint, outputMint, amount, slippageBps],
    queryFn: async () => {
      if (!amount || parseFloat(amount) <= 0) return null

      const quote = await getSvmTradeQuote({
        chainId,
        inputMint,
        outputMint,
        amount,
        slippageBps,
      })

      return quote
    },
    enabled: enabled && !!inputMint && !!outputMint && !!amount,
    staleTime: 1000 * 30, // 30 seconds - reduce polling
    gcTime: 1000 * 60 * 5, // 5 minutes cache
    refetchInterval: false, // Disable auto-refetch, only manual
    refetchOnWindowFocus: false,
  })
}

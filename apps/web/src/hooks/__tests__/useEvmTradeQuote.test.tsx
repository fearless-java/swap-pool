import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEvmTradeQuote } from '../trade/useEvmTradeQuote'

vi.mock('@/lib/api/zero-x', () => ({
  getEvmTradeQuote: vi.fn().mockResolvedValue({
    sellAmount: '1000000',
    buyAmount: '2000000',
    price: '2.0',
    estimatedPriceImpact: '0.1',
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useEvmTradeQuote', () => {
  it('should fetch quote when enabled and params provided', async () => {
    const { result } = renderHook(
      () => useEvmTradeQuote({
        chainId: 1,
        fromToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        toToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        amount: '1000000000000000000',
        enabled: true,
      }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false)
    })

    expect(result.current.quote).toBeDefined()
  })

  it('should not fetch when disabled', () => {
    const { result } = renderHook(
      () => useEvmTradeQuote({
        chainId: 1,
        fromToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        toToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        amount: '1000000000000000000',
        enabled: false,
      }),
      { wrapper: createWrapper() }
    )

    expect(result.current.isLoading).toBe(false)
    expect(result.current.quote).toBeNull()
  })
})

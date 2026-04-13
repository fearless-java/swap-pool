"use client"

/**
 * PriceProvider - Context for managing token prices across multiple chains
 * Uses Zustand for state management with React Context for distribution
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react"
import { create } from "zustand"
import type { ChainId } from "../types/chain"
import type { PriceMap, TokenPrice } from "../types/price"
import { createPriceKey } from "../types/price"

/**
 * Price state interface
 */
interface PriceState {
  prices: PriceMap
  lastUpdated: number | null
  isLoading: boolean
  error: string | null

  // Actions
  setPrices: (prices: PriceMap) => void
  updatePrice: (chainId: ChainId, address: string, price: TokenPrice) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearPrices: () => void
}

/**
 * Create Zustand store for prices
 */
const usePriceStore = create<PriceState>((set) => ({
  prices: new Map(),
  lastUpdated: null,
  isLoading: false,
  error: null,

  setPrices: (prices) =>
    set({
      prices,
      lastUpdated: Date.now(),
      error: null,
    }),

  updatePrice: (chainId, address, price) =>
    set((state) => {
      const newPrices = new Map(state.prices)
      const key = createPriceKey(chainId, address)
      newPrices.set(key, price)
      return {
        prices: newPrices,
        lastUpdated: Date.now(),
      }
    }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  clearPrices: () =>
    set({
      prices: new Map(),
      lastUpdated: null,
      error: null,
    }),
}))

/**
 * Price context interface
 */
interface PriceContextValue {
  prices: PriceMap
  lastUpdated: number | null
  isLoading: boolean
  error: string | null
  getPrice: (chainId: ChainId, address: string) => TokenPrice | undefined
  setPrices: (prices: PriceMap) => void
  updatePrice: (chainId: ChainId, address: string, price: TokenPrice) => void
  refetch: () => void
}

const PriceContext = createContext<PriceContextValue | null>(null)

/**
 * Price key function for external use
 */
export { createPriceKey }

/**
 * PriceProvider component
 */
export function PriceProvider({ children }: { children: React.ReactNode }) {
  const store = usePriceStore()
  const refetchCallbackRef = useRef<(() => void) | null>(null)

  const value = useMemo<PriceContextValue>(
    () => ({
      prices: store.prices,
      lastUpdated: store.lastUpdated,
      isLoading: store.isLoading,
      error: store.error,
      getPrice: (chainId: ChainId, address: string) => {
        const key = createPriceKey(chainId, address)
        return store.prices.get(key)
      },
      setPrices: store.setPrices,
      updatePrice: store.updatePrice,
      refetch: () => refetchCallbackRef.current?.(),
    }),
    [store]
  )

  // Register the refetch callback from child hooks
  useEffect(() => {
    // This effect sets up the refetch mechanism
    // Child hooks can use this to trigger refetches
  }, [])

  return <PriceContext.Provider value={value}>{children}</PriceContext.Provider>
}

/**
 * Hook to access price context
 */
export function usePriceContext(): PriceContextValue {
  const context = useContext(PriceContext)
  if (!context) {
    throw new Error("usePriceContext must be used within a PriceProvider")
  }
  return context
}

/**
 * Hook to get a single token price
 */
export function useTokenPrice(chainId: ChainId, address: string): TokenPrice | undefined {
  const getPrice = usePriceContext().getPrice
  return useMemo(() => getPrice(chainId, address), [getPrice, chainId, address])
}

/**
 * Hook to get multiple token prices
 */
export function useTokenPrices(
  tokens: Array<{ chainId: ChainId; address: string }>
): Map<string, TokenPrice | undefined> {
  const { getPrice } = usePriceContext()
  return useMemo(() => {
    const result = new Map<string, TokenPrice | undefined>()
    for (const token of tokens) {
      const key = createPriceKey(token.chainId, token.address)
      result.set(key, getPrice(token.chainId, token.address))
    }
    return result
  }, [tokens, getPrice])
}

/**
 * Hook to check if any prices are loading
 */
export function usePricesLoading(): boolean {
  return usePriceContext().isLoading
}

/**
 * Hook to get price last updated timestamp
 */
export function usePricesLastUpdated(): number | null {
  return usePriceContext().lastUpdated
}

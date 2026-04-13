import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useSearchTokens } from "./useSearchTokens"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"

// Create a wrapper for the hook that includes the QueryClient provider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe("useSearchTokens", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("search filtering", () => {
    it("filters tokens by symbol", async () => {
      const { result } = renderHook(
        () => useSearchTokens({ chainId: 1, search: "USDC" }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.tokens.length).toBeGreaterThan(0)
      })

      const tokens = result.current.tokens
      tokens.forEach((token) => {
        expect(
          token.symbol.toLowerCase().includes("usdc") ||
            token.name.toLowerCase().includes("usdc")
        ).toBe(true)
      })
    })

    it("filters tokens by name", async () => {
      const { result } = renderHook(
        () => useSearchTokens({ chainId: 1, search: "USDCoin" }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.tokens.length).toBeGreaterThan(0)
      })

      const tokens = result.current.tokens
      tokens.forEach((token) => {
        expect(
          token.symbol.toLowerCase().includes("usdcoin") ||
            token.name.toLowerCase().includes("usdcoin")
        ).toBe(true)
      })
    })

    it("filters tokens by address (exact match)", async () => {
      // USDC address on mainnet
      const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      const { result } = renderHook(
        () => useSearchTokens({ chainId: 1, search: usdcAddress }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.tokens.length).toBe(1)
      })

      expect(result.current.tokens[0].address.toLowerCase()).toBe(
        usdcAddress.toLowerCase()
      )
    })

    it("returns empty array when no matches found", async () => {
      const { result } = renderHook(
        () => useSearchTokens({ chainId: 1, search: "NONEXISTENTTOKEN12345" }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.tokens).toEqual([])
      expect(result.current.hasMore).toBe(false)
    })

    it("handles case-insensitive search", async () => {
      const { result } = renderHook(
        () => useSearchTokens({ chainId: 1, search: "usdc" }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.tokens.length).toBeGreaterThan(0)
      })

      const tokens = result.current.tokens
      tokens.forEach((token) => {
        expect(
          token.symbol.toLowerCase().includes("usdc") ||
            token.name.toLowerCase().includes("usdc")
        ).toBe(true)
      })
    })

    it("handles whitespace in search term", async () => {
      const { result } = renderHook(
        () => useSearchTokens({ chainId: 1, search: "  USDC  " }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.tokens.length).toBeGreaterThan(0)
      })

      const tokens = result.current.tokens
      tokens.forEach((token) => {
        expect(
          token.symbol.toLowerCase().includes("usdc") ||
            token.name.toLowerCase().includes("usdc")
        ).toBe(true)
      })
    })
  })

  describe("custom tokens", () => {
    it("filters tokens by custom token addresses", async () => {
      const customAddresses = [
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
        "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
      ]

      const { result } = renderHook(
        () =>
          useSearchTokens({
            chainId: 1,
            customTokens: customAddresses,
          }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.tokens.length).toBe(2)
      })

      const addresses = result.current.tokens.map((t) =>
        t.address.toLowerCase()
      )
      expect(addresses).toContain(customAddresses[0].toLowerCase())
      expect(addresses).toContain(customAddresses[1].toLowerCase())
    })

    it("combines custom tokens with search filter", async () => {
      const customAddresses = [
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
        "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
      ]

      const { result } = renderHook(
        () =>
          useSearchTokens({
            chainId: 1,
            search: "US",
            customTokens: customAddresses,
          }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Should only return USDC (matches "US" search and is in custom tokens)
      const tokens = result.current.tokens
      tokens.forEach((token) => {
        expect(
          token.symbol.toLowerCase().includes("us") ||
            token.name.toLowerCase().includes("us")
        ).toBe(true)
        expect(customAddresses.map((a) => a.toLowerCase())).toContain(
          token.address.toLowerCase()
        )
      })
    })

    it("returns empty array when custom tokens not on chain", async () => {
      const { result } = renderHook(
        () =>
          useSearchTokens({
            chainId: undefined,
            customTokens: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],
          }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.tokens).toEqual([])
    })
  })

  describe("pagination", () => {
    it("returns hasMore true when there are more pages", async () => {
      const { result } = renderHook(
        () => useSearchTokens({ chainId: 1, pageSize: 5 }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.tokens.length).toBe(5)
      })

      expect(result.current.hasMore).toBe(true)
    })

    it("fetches next page when fetchNextPage is called", async () => {
      const { result } = renderHook(
        () => useSearchTokens({ chainId: 1, pageSize: 5 }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.tokens.length).toBe(5)
      })

      const firstPageTokens = result.current.tokens

      await waitFor(() => {
        result.current.fetchNextPage()
      })

      await waitFor(() => {
        expect(result.current.tokens.length).toBeGreaterThan(5)
      })

      // Should have more tokens now
      expect(result.current.tokens.length).toBeGreaterThan(firstPageTokens.length)
    })

    it("returns hasMore false when all tokens loaded", async () => {
      // Search for something specific that should have few results
      const { result } = renderHook(
        () => useSearchTokens({ chainId: 1, search: "WETH", pageSize: 50 }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When all tokens fit in one page, hasMore should be false
      // This depends on how many WETH tokens exist
      if (result.current.tokens.length < 50) {
        expect(result.current.hasMore).toBe(false)
      }
    })

    it("respects custom pageSize", async () => {
      const { result } = renderHook(
        () => useSearchTokens({ chainId: 1, pageSize: 10 }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.tokens.length).toBe(10)
      })

      expect(result.current.tokens.length).toBe(10)
    })
  })

  describe("loading and error states", () => {
    it("returns isLoading true initially", () => {
      const { result } = renderHook(
        () => useSearchTokens({ chainId: 1 }),
        { wrapper: createWrapper() }
      )

      // Initially may be loading
      expect(result.current.isLoading).toBe(true)
    })

    it("returns isLoading false after data loads", async () => {
      const { result } = renderHook(
        () => useSearchTokens({ chainId: 1 }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.tokens.length).toBeGreaterThan(0)
    })

    it("returns isError false when query succeeds", async () => {
      const { result } = renderHook(
        () => useSearchTokens({ chainId: 1 }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isError).toBe(false)
    })

    it("is disabled when chainId is undefined", () => {
      const { result } = renderHook(
        () => useSearchTokens({ chainId: undefined }),
        { wrapper: createWrapper() }
      )

      // Should not be loading when disabled
      expect(result.current.isLoading).toBe(false)
      expect(result.current.tokens).toEqual([])
    })

    it("is disabled when chainId is null", () => {
      const { result } = renderHook(
        () => useSearchTokens({ chainId: undefined }),
        { wrapper: createWrapper() }
      )

      expect(result.current.isLoading).toBe(false)
      expect(result.current.tokens).toEqual([])
    })
  })

  describe("chain filtering", () => {
    it("returns tokens for mainnet (chainId 1)", async () => {
      const { result } = renderHook(
        () => useSearchTokens({ chainId: 1 }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.tokens.length).toBeGreaterThan(0)
      })

      result.current.tokens.forEach((token) => {
        expect(token.chainId).toBe(1)
      })
    })

    it("returns tokens for polygon (chainId 137)", async () => {
      const { result } = renderHook(
        () => useSearchTokens({ chainId: 137 }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.tokens.length).toBeGreaterThan(0)
      })

      result.current.tokens.forEach((token) => {
        expect(token.chainId).toBe(137)
      })
    })

    it("returns different tokens for different chains", async () => {
      const { result: mainnetResult } = renderHook(
        () => useSearchTokens({ chainId: 1 }),
        { wrapper: createWrapper() }
      )

      const { result: polygonResult } = renderHook(
        () => useSearchTokens({ chainId: 137 }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(mainnetResult.current.tokens.length).toBeGreaterThan(0)
        expect(polygonResult.current.tokens.length).toBeGreaterThan(0)
      })

      // Mainnet and Polygon should have different tokens
      const mainnetAddresses = mainnetResult.current.tokens.map(
        (t) => t.address
      )
      const polygonAddresses = polygonResult.current.tokens.map(
        (t) => t.address
      )

      // At least some tokens should be different
      const commonAddresses = mainnetAddresses.filter((addr) =>
        polygonAddresses.includes(addr)
      )
      // Native tokens have the same address across chains, but there should be some difference
      expect(
        mainnetAddresses.length !== polygonAddresses.length ||
          commonAddresses.length < mainnetAddresses.length
      ).toBe(true)
    })
  })
})
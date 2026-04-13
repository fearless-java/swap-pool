import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useTrendingTokens } from "./useTrendingTokens"
import { CHAIN_IDS } from "@/lib/constants"

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

describe("useTrendingTokens", () => {
  it("should return empty tokens when chainId is undefined", async () => {
    const { result } = renderHook(() => useTrendingTokens({ chainId: undefined }), {
      wrapper: createWrapper(),
    })

    expect(result.current.tokens).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it("should return trending tokens for mainnet (chainId 1)", async () => {
    const { result } = renderHook(() => useTrendingTokens({ chainId: CHAIN_IDS.mainnet }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isError).toBe(false)
    expect(result.current.tokens.length).toBeGreaterThan(0)
    expect(result.current.tokens.length).toBeLessThanOrEqual(20)
    // All tokens should be from mainnet
    result.current.tokens.forEach((token) => {
      expect(token.chainId).toBe(CHAIN_IDS.mainnet)
    })
  })

  it("should return trending tokens for polygon (chainId 137)", async () => {
    const { result } = renderHook(() => useTrendingTokens({ chainId: CHAIN_IDS.polygon }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isError).toBe(false)
    expect(result.current.tokens.length).toBeGreaterThan(0)
    result.current.tokens.forEach((token) => {
      expect(token.chainId).toBe(CHAIN_IDS.polygon)
    })
  })

  it("should return trending tokens for arbitrum (chainId 42161)", async () => {
    const { result } = renderHook(() => useTrendingTokens({ chainId: CHAIN_IDS.arbitrum }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isError).toBe(false)
    expect(result.current.tokens.length).toBeGreaterThan(0)
    result.current.tokens.forEach((token) => {
      expect(token.chainId).toBe(CHAIN_IDS.arbitrum)
    })
  })

  it("should return trending tokens for optimism (chainId 10)", async () => {
    const { result } = renderHook(() => useTrendingTokens({ chainId: CHAIN_IDS.optimism }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isError).toBe(false)
    expect(result.current.tokens.length).toBeGreaterThan(0)
    result.current.tokens.forEach((token) => {
      expect(token.chainId).toBe(CHAIN_IDS.optimism)
    })
  })

  it("should return trending tokens for base (chainId 8453)", async () => {
    const { result } = renderHook(() => useTrendingTokens({ chainId: CHAIN_IDS.base }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isError).toBe(false)
    expect(result.current.tokens.length).toBeGreaterThan(0)
    result.current.tokens.forEach((token) => {
      expect(token.chainId).toBe(CHAIN_IDS.base)
    })
  })

  it("should respect the limit parameter", async () => {
    const limit = 5
    const { result } = renderHook(
      () => useTrendingTokens({ chainId: CHAIN_IDS.mainnet, limit }),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.tokens.length).toBeLessThanOrEqual(limit)
  })

  it("should use default limit of 20", async () => {
    const { result } = renderHook(() => useTrendingTokens({ chainId: CHAIN_IDS.mainnet }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.tokens.length).toBeLessThanOrEqual(20)
  })

  it("should return tokens with required properties", async () => {
    const { result } = renderHook(() => useTrendingTokens({ chainId: CHAIN_IDS.mainnet }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    result.current.tokens.forEach((token) => {
      expect(token).toHaveProperty("address")
      expect(token).toHaveProperty("chainId")
      expect(token).toHaveProperty("decimals")
      expect(token).toHaveProperty("symbol")
      expect(token).toHaveProperty("name")
      expect(token).toHaveProperty("id")
      expect(typeof token.address).toBe("string")
      expect(typeof token.chainId).toBe("number")
      expect(typeof token.decimals).toBe("number")
      expect(typeof token.symbol).toBe("string")
      expect(typeof token.name).toBe("string")
      expect(typeof token.id).toBe("string")
    })
  })

  it("should return loading state initially", () => {
    const { result } = renderHook(() => useTrendingTokens({ chainId: CHAIN_IDS.mainnet }), {
      wrapper: createWrapper(),
    })

    // Initially should be loading
    expect(result.current.isLoading).toBe(true)
  })

  it("should have proper token id format (chainId:address)", async () => {
    const { result } = renderHook(() => useTrendingTokens({ chainId: CHAIN_IDS.mainnet }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    result.current.tokens.forEach((token) => {
      expect(token.id).toMatch(new RegExp(`^${CHAIN_IDS.mainnet}:0x[a-fA-F0-9]{40}$`))
    })
  })
})
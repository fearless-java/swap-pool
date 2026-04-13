import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useCustomTokens } from "./useCustomTokens"
import { CustomToken } from "@/lib/tokens/types"

describe("useCustomTokens", () => {
  const STORAGE_KEY = "sushiswap-custom-tokens"

  const mockToken: CustomToken = {
    chainId: 1,
    address: "0x1234567890123456789012345678901234567890",
    decimals: 18,
    name: "Mock Token",
    symbol: "MOCK",
    logoUrl: "https://example.com/logo.png",
  }

  const mockToken2: CustomToken = {
    chainId: 137,
    address: "0x2222222222222222222222222222222222222222",
    decimals: 6,
    name: "Polygon Token",
    symbol: "MATIC",
  }

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.removeItem(STORAGE_KEY)
  })

  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY)
  })

  describe("addCustomToken", () => {
    it("should add a custom token to localStorage", () => {
      const { result } = renderHook(() => useCustomTokens())

      act(() => {
        result.current.addCustomToken(mockToken)
      })

      // Check localStorage
      const stored = localStorage.getItem(STORAGE_KEY)
      expect(stored).toBeTruthy()
      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(1)
      expect(parsed[0]).toEqual(mockToken)
    })

    it("should not add duplicate tokens", () => {
      const { result } = renderHook(() => useCustomTokens())

      act(() => {
        result.current.addCustomToken(mockToken)
      })

      act(() => {
        result.current.addCustomToken(mockToken)
      })

      const stored = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(1)
    })

    it("should add tokens with same address but different chainId", () => {
      const tokenOnChain1: CustomToken = { ...mockToken, chainId: 1 }
      const tokenOnChain137: CustomToken = { ...mockToken, chainId: 137 }

      const { result } = renderHook(() => useCustomTokens())

      act(() => {
        result.current.addCustomToken(tokenOnChain1)
      })

      act(() => {
        result.current.addCustomToken(tokenOnChain137)
      })

      const stored = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(2)
    })
  })

  describe("removeCustomToken", () => {
    it("should remove a token from localStorage", () => {
      const { result } = renderHook(() => useCustomTokens())

      act(() => {
        result.current.addCustomToken(mockToken)
        result.current.addCustomToken(mockToken2)
      })

      act(() => {
        result.current.removeCustomToken(mockToken.chainId, mockToken.address)
      })

      const stored = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].address).toBe(mockToken2.address)
    })

    it("should handle removing non-existent token gracefully", () => {
      const { result } = renderHook(() => useCustomTokens())

      act(() => {
        result.current.addCustomToken(mockToken)
      })

      act(() => {
        result.current.removeCustomToken(999, "0x9999999999999999999999999999999999999999")
      })

      const stored = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(1)
    })
  })

  describe("hasToken", () => {
    it("should return true if token exists", () => {
      const { result } = renderHook(() => useCustomTokens())

      act(() => {
        result.current.addCustomToken(mockToken)
      })

      expect(result.current.hasToken(mockToken.chainId, mockToken.address)).toBe(true)
    })

    it("should return false if token does not exist", () => {
      const { result } = renderHook(() => useCustomTokens())

      expect(result.current.hasToken(999, "0x9999999999999999999999999999999999999999")).toBe(false)
    })

    it("should return false for same address but different chainId", () => {
      const { result } = renderHook(() => useCustomTokens())

      act(() => {
        result.current.addCustomToken(mockToken)
      })

      expect(result.current.hasToken(137, mockToken.address)).toBe(false)
      expect(result.current.hasToken(mockToken.chainId, mockToken.address)).toBe(true)
    })
  })

  describe("data and tokens", () => {
    it("should return custom tokens in data array", () => {
      const { result } = renderHook(() => useCustomTokens())

      act(() => {
        result.current.addCustomToken(mockToken)
        result.current.addCustomToken(mockToken2)
      })

      expect(result.current.data).toHaveLength(2)
      expect(result.current.data).toContainEqual(mockToken)
      expect(result.current.data).toContainEqual(mockToken2)
    })

    it("should convert custom tokens to Token type in tokens array", () => {
      const { result } = renderHook(() => useCustomTokens())

      act(() => {
        result.current.addCustomToken(mockToken)
      })

      expect(result.current.tokens).toHaveLength(1)
      expect(result.current.tokens[0].address).toBe(mockToken.address)
      expect(result.current.tokens[0].chainId).toBe(mockToken.chainId)
      expect(result.current.tokens[0].symbol).toBe(mockToken.symbol)
      expect(result.current.tokens[0].id).toBe("1:0x1234567890123456789012345678901234567890")
    })
  })

  describe("localStorage persistence", () => {
    it("should persist tokens across hook instances", () => {
      const { result: result1 } = renderHook(() => useCustomTokens())

      act(() => {
        result1.current.addCustomToken(mockToken)
      })

      // Create a new hook instance - should read from localStorage
      const { result: result2 } = renderHook(() => useCustomTokens())

      expect(result2.current.hasToken(mockToken.chainId, mockToken.address)).toBe(true)
    })

    it("should load existing tokens on mount", () => {
      // Pre-populate localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockToken, mockToken2]))

      const { result } = renderHook(() => useCustomTokens())

      expect(result.current.data).toHaveLength(2)
      expect(result.current.hasToken(mockToken.chainId, mockToken.address)).toBe(true)
    })
  })
})
"use client"

import { useCallback, useEffect, useState } from "react"
import { CustomToken, Token } from "@/lib/tokens/types"
import { getTokenId } from "@/lib/utils/format"

const STORAGE_KEY = "sushiswap-custom-tokens"

interface UseCustomTokensResult {
  data: CustomToken[]
  tokens: Token[]
  addCustomToken: (token: CustomToken) => void
  removeCustomToken: (chainId: number, address: string) => void
  hasToken: (chainId: number, address: string) => boolean
  mutate: () => void
}

function customTokenToToken(customToken: CustomToken): Token {
  return {
    address: customToken.address,
    chainId: customToken.chainId,
    decimals: customToken.decimals,
    name: customToken.name,
    symbol: customToken.symbol,
    id: getTokenId(customToken.chainId, customToken.address),
    logoURI: customToken.logoUrl,
  }
}

export function useCustomTokens(): UseCustomTokensResult {
  const [tokens, setTokens] = useState<CustomToken[]>([])

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setTokens(JSON.parse(stored))
      }
    } catch {
      setTokens([])
    }
  }, [])

  const addCustomToken = useCallback((token: CustomToken) => {
    setTokens((prev) => {
      const id = getTokenId(token.chainId, token.address)
      const exists = prev.some((t) => getTokenId(t.chainId, t.address) === id)
      if (exists) return prev

      const updated = [...prev, token]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeCustomToken = useCallback((chainId: number, address: string) => {
    setTokens((prev) => {
      const id = getTokenId(chainId, address)
      const updated = prev.filter((t) => getTokenId(t.chainId, t.address) !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const hasToken = useCallback(
    (chainId: number, address: string): boolean => {
      const id = getTokenId(chainId, address)
      return tokens.some((t) => getTokenId(t.chainId, t.address) === id)
    },
    [tokens]
  )

  const mutate = useCallback(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setTokens(JSON.parse(stored))
      }
    } catch {
      setTokens([])
    }
  }, [])

  return {
    data: tokens,
    tokens: tokens.map(customTokenToToken),
    addCustomToken,
    removeCustomToken,
    hasToken,
    mutate,
  }
}

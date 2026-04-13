"use client"

import { useChainId } from "wagmi"
import { useTrendingTokens } from "@/lib/hooks/useTrendingTokens"
import { EvmChainId, Token } from "@/lib/tokens/types"
import { TokenSelectorCurrencyList } from "./TokenSelectorCurrencyList"
import { TokenSelectorCurrencyListLoading } from "./TokenSelectorCurrencyListLoading"

const VALID_CHAIN_IDS: EvmChainId[] = [1, 137, 42161, 10, 8453]

function isValidChainId(chainId: number): chainId is EvmChainId {
  return VALID_CHAIN_IDS.includes(chainId as EvmChainId)
}

interface TokenSelectorTrendingTokensProps {
  onSelect: (token: Token) => void
  selectedToken?: Token
}

export function TokenSelectorTrendingTokens({ onSelect, selectedToken }: TokenSelectorTrendingTokensProps) {
  const rawChainId = useChainId()
  const chainId = isValidChainId(rawChainId) ? rawChainId : undefined

  const { tokens, isLoading, isError } = useTrendingTokens({
    chainId,
    limit: 20,
  })

  if (isLoading) {
    return <TokenSelectorCurrencyListLoading />
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-500">
        <p>Error loading trending tokens</p>
      </div>
    )
  }

  if (tokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
        <p>No trending tokens available</p>
      </div>
    )
  }

  return (
    <TokenSelectorCurrencyList
      tokens={tokens}
      onSelect={onSelect}
      selectedToken={selectedToken}
      hasMore={false}
      isLoading={false}
    />
  )
}

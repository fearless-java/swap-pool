"use client"

import { useAccount, useChainId } from "wagmi"
import { useMyTokens } from "@/lib/hooks/useMyTokens"
import { useCustomTokens } from "@/lib/hooks/useCustomTokens"
import { EvmChainId, Token } from "@/lib/tokens/types"
import { TokenSelectorCurrencyList } from "./TokenSelectorCurrencyList"
import { TokenSelectorCurrencyListLoading } from "./TokenSelectorCurrencyListLoading"

const VALID_CHAIN_IDS: EvmChainId[] = [1, 137, 42161, 10, 8453]

function isValidChainId(chainId: number): chainId is EvmChainId {
  return VALID_CHAIN_IDS.includes(chainId as EvmChainId)
}

interface TokenSelectorMyTokensProps {
  onSelect: (token: Token) => void
  selectedToken?: Token
}

export function TokenSelectorMyTokens({ onSelect, selectedToken }: TokenSelectorMyTokensProps) {
  const { address: account } = useAccount()
  const rawChainId = useChainId()
  const chainId = isValidChainId(rawChainId) ? rawChainId : undefined
  const { tokens: customTokenList = [] } = useCustomTokens()

  const { tokens, isLoading, isError } = useMyTokens({
    chainId,
    account,
    customTokens: customTokenList,
    includeNative: true,
  })

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
        <p>Please connect your wallet</p>
      </div>
    )
  }

  if (isLoading) {
    return <TokenSelectorCurrencyListLoading />
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-500">
        <p>Error loading tokens</p>
      </div>
    )
  }

  if (tokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
        <p>No tokens found in your wallet</p>
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

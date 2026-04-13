"use client"

import { useState } from "react"
import { useDebounce } from "@/lib/hooks/useDebounce"
import { useSearchTokens } from "@/lib/hooks/useSearchTokens"
import { useCustomTokens } from "@/lib/hooks/useCustomTokens"
import { useChainId } from "wagmi"
import { EvmChainId } from "@/lib/tokens/types"
import { TokenSelectorCurrencyList } from "./TokenSelectorCurrencyList"
import { TokenSelectorCurrencyListLoading } from "./TokenSelectorCurrencyListLoading"
import { Token } from "@/lib/tokens/types"

const VALID_CHAIN_IDS: EvmChainId[] = [1, 137, 42161, 10, 8453]

function isValidChainId(chainId: number): chainId is EvmChainId {
  return VALID_CHAIN_IDS.includes(chainId as EvmChainId)
}

interface TokenSelectorSearchProps {
  onSelect: (token: Token) => void
  selectedToken?: Token
}

export function TokenSelectorSearch({ onSelect, selectedToken }: TokenSelectorSearchProps) {
  const rawChainId = useChainId()
  const chainId = isValidChainId(rawChainId) ? rawChainId : undefined
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)
  const { tokens: customTokens = [] } = useCustomTokens()

  const customTokenIds = customTokens
    .filter((t) => t.chainId === chainId)
    .map((t) => t.address)

  const { tokens, hasMore, isLoading, isError, fetchNextPage } = useSearchTokens({
    chainId,
    search: debouncedSearch,
    customTokens: customTokenIds,
    pageSize: 20,
  })

  return (
    <div className="flex flex-col h-full">
      {/* Search Input */}
      <div className="p-4 border-b border-neutral-200">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, symbol, or address"
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search tokens"
          role="searchbox"
        />
      </div>

      {/* Token List */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <TokenSelectorCurrencyListLoading />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-500">
            <p>Error loading tokens</p>
          </div>
        ) : (
          <TokenSelectorCurrencyList
            tokens={tokens}
            onSelect={onSelect}
            selectedToken={selectedToken}
            hasMore={hasMore}
            onLoadMore={fetchNextPage}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}

"use client"

import { Token } from "@/lib/tokens/types"
import { TokenSelectorCurrencyRow } from "./TokenSelectorCurrencyRow"
import InfiniteScroll from "react-infinite-scroll-component"

interface TokenSelectorCurrencyListProps {
  tokens: Token[]
  onSelect: (token: Token) => void
  selectedToken?: Token
  hasMore?: boolean
  onLoadMore?: () => void
  isLoading?: boolean
}

export function TokenSelectorCurrencyList({
  tokens,
  onSelect,
  selectedToken,
  hasMore = false,
  onLoadMore,
  isLoading = false,
}: TokenSelectorCurrencyListProps) {
  if (tokens.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
        <p>No tokens found</p>
      </div>
    )
  }

  return (
    <div
      id="scrollableDiv"
      className="h-full overflow-y-auto max-h-[400px]"
      role="listbox"
      aria-label="Token list"
    >
      <InfiniteScroll
        dataLength={tokens.length}
        next={onLoadMore || (() => {})}
        hasMore={hasMore}
        loader={<div className="py-4 text-center text-neutral-500">Loading more...</div>}
        scrollThreshold={0.75}
        scrollableTarget="scrollableDiv"
        endMessage={
          <p className="py-4 text-center text-neutral-500">
            You have reached the end
          </p>
        }
      >
        {tokens.map((token) => (
          <TokenSelectorCurrencyRow
            key={`${token.chainId}:${token.address}`}
            token={token}
            onSelect={onSelect}
            isSelected={
              selectedToken?.address.toLowerCase() === token.address.toLowerCase() &&
              selectedToken?.chainId === token.chainId
            }
          />
        ))}
      </InfiniteScroll>
    </div>
  )
}

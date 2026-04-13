"use client"

import { memo } from "react"
import { Token, TokenWithBalance } from "@/lib/tokens/types"
import { shortenAddress } from "@/lib/utils/format"

interface TokenSelectorCurrencyRowProps {
  token: Token | TokenWithBalance
  onSelect: (token: Token) => void
  isSelected?: boolean
}

export const TokenSelectorCurrencyRow = memo(function TokenSelectorCurrencyRow({
  token,
  onSelect,
  isSelected = false,
}: TokenSelectorCurrencyRowProps) {
  // Check if token already has balance data
  const hasBalance = "balance" in token && "balanceFormatted" in token
  const tokenWithBalance = token as TokenWithBalance

  const displayBalance = hasBalance ? tokenWithBalance.balanceFormatted : "0"

  return (
    <button
      onClick={() => onSelect(token)}
      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 transition-colors ${
        isSelected ? "bg-neutral-50" : ""
      }`}
    >
      {/* Token Logo */}
      <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
        {token.logoURI ? (
          <img
            src={token.logoURI}
            alt={token.symbol}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden"
              e.currentTarget.nextElementSibling?.classList.remove("hidden")
            }}
          />
        ) : null}
        {/* Fallback - hidden by default, shown when image fails or no logo */}
        <span className={`text-xs font-medium text-neutral-500 ${token.logoURI ? "hidden" : ""}`}>
          {token.symbol.slice(0, 2).toUpperCase()}
        </span>
      </div>

      {/* Token Info */}
      <div className="flex-1 text-left">
        <div className="font-medium text-neutral-900">{token.symbol}</div>
        <div className="text-sm text-neutral-500 truncate">{token.name}</div>
      </div>

      {/* Balance */}
      <div className="text-right">
        <div className="font-medium text-neutral-900">{displayBalance}</div>
        <div className="text-sm text-neutral-500">
          {token.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
            ? "Native"
            : shortenAddress(token.address)}
        </div>
      </div>
    </button>
  )
})

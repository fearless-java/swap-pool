"use client"

import { useState, useEffect, useCallback } from "react"
import { Token } from "@/lib/tokens/types"
import { TokenSelectorSearch } from "./TokenSelectorSearch"
import { TokenSelectorMyTokens } from "./TokenSelectorMyTokens"
import { TokenSelectorTrendingTokens } from "./TokenSelectorTrendingTokens"
import { Shell, Header } from "./Shell"

type TabType = "search" | "myTokens" | "trending"

interface TokenSelectorProps {
  onClose: () => void
  onSelect: (token: Token) => void
  selectedToken?: Token
}

export function TokenSelector({ onClose, onSelect, selectedToken }: TokenSelectorProps) {
  const [activeTab, setActiveTab] = useState<TabType>("search")

  // Handle Escape key to close modal
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [handleKeyDown])

  const handleSelect = (token: Token) => {
    onSelect(token)
    onClose()
  }

  const tabs: { key: TabType; label: string }[] = [
    { key: "search", label: "Search" },
    { key: "myTokens", label: "My Tokens" },
    { key: "trending", label: "Trending" },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Select Token"
    >
      <Shell>
        <Header title="Select Token" onClose={onClose} />

        {/* Tabs */}
        <div className="flex border-b border-neutral-200" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`${tab.key}-panel`}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="overflow-hidden h-[400px]" role="tabpanel" id={`${activeTab}-panel`}>
          {activeTab === "search" && (
            <TokenSelectorSearch onSelect={handleSelect} selectedToken={selectedToken} />
          )}
          {activeTab === "myTokens" && (
            <TokenSelectorMyTokens onSelect={handleSelect} selectedToken={selectedToken} />
          )}
          {activeTab === "trending" && (
            <TokenSelectorTrendingTokens onSelect={handleSelect} selectedToken={selectedToken} />
          )}
        </div>
      </Shell>
    </div>
  )
}

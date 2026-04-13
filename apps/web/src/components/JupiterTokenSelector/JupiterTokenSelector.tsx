'use client'

import { useState, useMemo, useCallback } from 'react'

interface JupiterTokenSelectorProps {
  selectedMint: string
  onMintSelect: (mint: string) => void
}

interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

const SOLANA_TOKENS: Token[] = [
  {
    address: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  },
  {
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    symbol: 'BONK',
    name: 'Bonk',
    decimals: 5,
    logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
  },
  {
    address: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    symbol: 'mSOL',
    name: 'Marinade Staked SOL',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png',
  },
  {
    address: 'J1toso1uCk3RLmjorhTkmVwpy8GuEZ3ZWzAFg13NMkB',
    symbol: 'jitoSOL',
    name: 'Jito Staked SOL',
    decimals: 9,
    logoURI: 'https://storage.googleapis.com/token-metadata/JitoSOL-256.png',
  },
  {
    address: 'bSo13r4TkiE4KumL71LsHT9cITcW9eVEYYLZYjUtk1o',
    symbol: 'bSOL',
    name: 'Blaze Staked SOL',
    decimals: 9,
    logoURI: 'https://blz-stake-v2.nyc3.cdn.digitaloceanspaces.com/tokens/bSOL.png',
  },
]

export function JupiterTokenSelector({ selectedMint, onMintSelect }: JupiterTokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredTokens = useMemo(() => {
    if (!search) return SOLANA_TOKENS
    const lower = search.toLowerCase()
    return SOLANA_TOKENS.filter(
      (t) =>
        t.symbol.toLowerCase().includes(lower) ||
        t.name.toLowerCase().includes(lower) ||
        t.address.toLowerCase().includes(lower)
    )
  }, [search])

  const selectedToken = useMemo(
    () => SOLANA_TOKENS.find((t) => t.address === selectedMint),
    [selectedMint]
  )

  const handleSelect = useCallback(
    (mint: string) => {
      onMintSelect(mint)
      setIsOpen(false)
      setSearch('')
    },
    [onMintSelect]
  )

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 transition-colors hover:bg-muted/80"
      >
        {selectedToken ? (
          <>
            {selectedToken.logoURI && (
              <img
                src={selectedToken.logoURI}
                alt={selectedToken.symbol}
                className="h-6 w-6 rounded-full"
              />
            )}
            <span className="font-medium">{selectedToken.symbol}</span>
          </>
        ) : (
          <span className="text-muted">Select</span>
        )}
        <span className="text-muted">▼</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select Token</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 hover:bg-muted"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by symbol or address"
              className="mb-4 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:border-primary"
            />

            <div className="max-h-64 space-y-1 overflow-y-auto">
              {filteredTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => handleSelect(token.address)}
                  className={`flex w-full items-center gap-3 rounded-lg p-2 transition-colors ${
                    token.address === selectedMint ? 'bg-muted' : 'hover:bg-muted'
                  }`}
                >
                  {token.logoURI && (
                    <img
                      src={token.logoURI}
                      alt={token.symbol}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <div className="text-left">
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-muted">{token.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
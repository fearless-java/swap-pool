'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSvmTradeQuote } from '@/hooks/trade/useSvmTradeQuote'
import { JupiterTokenSelector } from '@/components/JupiterTokenSelector'
import { formatAmount } from '@/lib/utils/format'

export default function SolanaSwapPage() {
  const { connected, publicKey } = useWallet()
  const [inputMint, setInputMint] = useState('So11111111111111111111111111111111111111112') // SOL
  const [outputMint, setOutputMint] = useState('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') // USDC
  const [inputAmount, setInputAmount] = useState('')

  const { data: quote, isLoading, refetch } = useSvmTradeQuote({
    chainId: 'solana',
    inputMint,
    outputMint,
    amount: inputAmount,
    enabled: connected && !!publicKey && !!inputAmount,
  })

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-6 text-2xl font-bold">Solana Swap</h1>

      {/* Input Token */}
      <div className="mb-4 rounded-lg bg-card p-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted">You pay</span>
          <span className="text-sm text-muted">Balance: --</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="0.0"
            className="w-full bg-transparent text-2xl outline-none"
          />
          <JupiterTokenSelector
            selectedMint={inputMint}
            onMintSelect={setInputMint}
          />
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="my-2 flex justify-center">
        <button className="rounded-full bg-muted p-2">↓</button>
      </div>

      {/* Output Token */}
      <div className="mb-4 rounded-lg bg-card p-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted">You receive</span>
          <span className="text-sm text-muted">Balance: --</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-full bg-transparent text-2xl">
            {quote ? formatAmount(quote.outAmount, 6) : '0.0'}
          </div>
          <JupiterTokenSelector
            selectedMint={outputMint}
            onMintSelect={setOutputMint}
          />
        </div>
      </div>

      {/* Quote Details */}
      {quote && (
        <div className="mb-4 rounded-lg bg-card p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Price Impact</span>
            <span>{quote.priceImpactPct}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Minimum received</span>
            <span>{quote.otherAmountThreshold}</span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        disabled={!connected || !quote || isLoading}
        className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground disabled:opacity-50"
      >
        {!connected ? 'Connect Wallet' : isLoading ? 'Fetching Quote...' : 'Swap'}
      </button>
    </div>
  )
}

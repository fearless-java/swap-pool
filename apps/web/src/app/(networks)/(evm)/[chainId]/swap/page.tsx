'use client'

import { useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { useEvmTradeQuote } from '@/hooks/trade/useEvmTradeQuote'
import { TokenSelector } from '@/components/TokenSelector'
import { formatUnits } from 'viem'
import type { EvmChainId } from '@sushiswap/core/evm'

interface SwapPageProps {
  params: { chainId: string }
}

export default function EvmSwapPage({ params }: SwapPageProps) {
  const chainId = Number(params.chainId) as EvmChainId
  const { address } = useAccount()

  const [tokenIn, setTokenIn] = useState<`0x${string}`>('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
  const [tokenOut, setTokenOut] = useState<`0x${string}`>('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48') // USDC
  const [amountIn, setAmountIn] = useState('')

  const { data: quote, isLoading } = useEvmTradeQuote({
    chainId,
    tokenIn,
    tokenOut,
    amountIn,
    enabled: !!address && !!amountIn,
  })

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-6 text-2xl font-bold">Swap</h1>

      {/* Input */}
      <div className="mb-4 rounded-lg bg-card p-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted">You pay</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            placeholder="0.0"
            className="w-full bg-transparent text-2xl outline-none"
          />
          <TokenSelector
            chainId={chainId}
            selectedToken={tokenIn}
            onTokenSelect={setTokenIn}
          />
        </div>
      </div>

      {/* Output */}
      <div className="mb-4 rounded-lg bg-card p-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted">You receive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-full bg-transparent text-2xl">
            {quote ? formatUnits(quote.outAmount, 6) : '0.0'}
          </div>
          <TokenSelector
            chainId={chainId}
            selectedToken={tokenOut}
            onTokenSelect={setTokenOut}
          />
        </div>
      </div>

      <button
        disabled={!address || !quote || isLoading}
        className="w-full rounded-lg bg-primary py-3 font-medium"
      >
        {!address ? 'Connect Wallet' : isLoading ? 'Fetching Quote...' : 'Swap'}
      </button>
    </div>
  )
}

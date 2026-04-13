'use client'

import { useState } from 'react'

export default function StellarSwapPage() {
  const [amount, setAmount] = useState('')

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-6 text-2xl font-bold">Stellar Swap</h1>

      {/* Input Token */}
      <div className="mb-4 rounded-lg bg-card p-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted">You pay</span>
          <span className="text-sm text-muted">Balance: --</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full bg-transparent text-2xl outline-none"
          />
          <select className="rounded-lg bg-muted p-2">
            <option>XLM</option>
          </select>
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
          <div className="w-full bg-transparent text-2xl">0.0</div>
          <select className="rounded-lg bg-muted p-2">
            <option>USDC</option>
          </select>
        </div>
      </div>

      {/* Action Button */}
      <button
        disabled={!amount}
        className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground disabled:opacity-50"
      >
        Connect Wallet
      </button>
    </div>
  )
}

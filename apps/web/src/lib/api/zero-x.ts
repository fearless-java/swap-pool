import type { EvmChainId } from '@/types/chain'
import type { Address } from 'viem'

const ZERO_X_API_BASE = 'https://api.0x.org'

interface ZeroXQuoteParams {
  chainId: EvmChainId
  tokenIn: Address
  tokenOut: Address
  amountIn: string
  slippagePercentage: number
}

interface ZeroXQuote {
  price: string
  guaranteedPrice: string
  to: Address
  data: `0x${string}`
  value: string
  gas: string
  estimatedGas: string
  gasPrice: string
  protocolFee: string
  minimumProtocolFee: string
  buyTokenAddress: Address
  sellTokenAddress: Address
  buyAmount: string
  sellAmount: string
  sources: Array<{ name: string; proportion: string }>
  allowanceTarget: Address
  estimatedPriceImpact: string
}

export async function getEvmTradeQuote(params: ZeroXQuoteParams): Promise<ZeroXQuote | null> {
  const { chainId, tokenIn, tokenOut, amountIn, slippagePercentage } = params

  const queryParams = new URLSearchParams({
    sellToken: tokenIn,
    buyToken: tokenOut,
    sellAmount: amountIn,
    takerAddress: '0x0000000000000000000000000000000000000000', // Placeholder
    slippagePercentage: slippagePercentage.toString(),
    skipValidation: 'true',
  })

  const url = `${ZERO_X_API_BASE}/swap/v1/quote?${queryParams.toString()}`

  try {
    const response = await fetch(url, {
      headers: {
        '0x-api-key': process.env.NEXT_PUBLIC_ZEROX_API_KEY || '',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`0x API error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch 0x quote')
  }
}

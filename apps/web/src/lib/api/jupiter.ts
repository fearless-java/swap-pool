/**
 * Jupiter API integration for Solana trade quotes
 * Public API with rate limiting
 */

import type { SvmChainId } from "../../types/chain"

const JUPITER_BASE_URL = "https://quote-api.jup.ag"

/**
 * Jupiter quote request parameters
 */
export interface JupiterQuoteParams {
  chainId: SvmChainId
  inputMint: string // Solana token address (Base58)
  outputMint: string // Solana token address (Base58)
  amount: string // Amount in lamports (string for bigint compatibility)
  slippageBps?: number // Slippage in basis points (default: 50 = 0.5%)
  onlyDirectRoutes?: boolean
  maxAccounts?: number
}

/**
 * Jupiter quote response
 */
export interface JupiterQuote {
  inputMint: string
  inAmount: string // Input amount
  outputMint: string
  outAmount: string // Output amount
  otherAmountThreshold: string // Minimum output amount
  swapMode: string // "ExactIn" or "ExactOut"
  slippageBps: number // Slippage in basis points
  priceImpactPct: string // Price impact percentage
  routePlan: JupiterRoutePlan[]
  contextSlot?: number
  timeTaken?: number
}

/**
 * Jupiter route plan
 */
export interface JupiterRoutePlan {
  swapInfo: {
    ammKey: string
    label: string
    inputMint: string
    outputMint: string
    inAmount: string
    outAmount: string
    feeAmount: string
    feeMint: string
  }
  percent: number
}

/**
 * Get quote from Jupiter API
 */
export async function getSvmTradeQuote(params: JupiterQuoteParams): Promise<JupiterQuote | null> {
  const { chainId, inputMint, outputMint, amount, slippageBps = 50, onlyDirectRoutes, maxAccounts } =
    params

  const queryParams = new URLSearchParams({
    inputMint,
    outputMint,
    amount,
    slippageBps: slippageBps.toString(),
    onlyDirectRoutes: onlyDirectRoutes ? "true" : "false",
    wrapAndUnwrapSol: "true",
  })

  if (maxAccounts) {
    queryParams.set("maxAccounts", maxAccounts.toString())
  }

  const url = `${JUPITER_BASE_URL}/v6/quote?${queryParams.toString()}`

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) return null
      if (response.status === 429) {
        throw new Error("Jupiter API rate limited")
      }
      throw new Error(`Jupiter API error: ${response.status}`)
    }

    const data = await response.json()
    return data as JupiterQuote
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch Jupiter quote")
  }
}

/**
 * Jupiter swap request
 */
export interface JupiterSwapRequest {
  quoteResponse: JupiterQuote
  userPublicKey: string
  wrapAndUnwrapSol?: boolean
  computeUnitPriceMicroLamports?: number
  dynamicComputeUnitLimit?: boolean
}

/**
 * Jupiter swap response
 */
export interface JupiterSwapResponse {
  swapTransaction: string // Base64 encoded transaction
  lastValidBlockHeight: number
  prioritizationFeeLamports: number
}

/**
 * Get swap transaction from Jupiter
 */
export async function getJupiterSwapTransaction(
  request: JupiterSwapRequest
): Promise<JupiterSwapResponse | null> {
  const url = `${JUPITER_BASE_URL}/v6/swap`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Jupiter API error: ${response.status}`)
    }

    const data = await response.json()
    return data as JupiterSwapResponse
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch Jupiter swap transaction")
  }
}

/**
 * Get Jupiter price from API
 */
export interface JupiterPriceResponse {
  [mint: string]: {
    price: string
    id: string
    mintSymbol: string
    vsToken: string
    vsTokenSymbol: string
  }
}

export async function getJupiterPrices(mints: string[]): Promise<JupiterPriceResponse | null> {
  if (mints.length === 0) return null

  const queryParams = new URLSearchParams({
    mints: mints.join(","),
  })

  const url = `${JUPITER_BASE_URL}/v1/price?${queryParams.toString()}`

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch {
    return null
  }
}

/**
 * Common Solana token addresses
 */
export const SOLANA_TOKENS = {
  NATIVE_SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  wSOL: "So11111111111111111111111111111111111111112",
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
} as const

/**
 * Check if a token is native SOL
 */
export function isNativeSol(mint: string): boolean {
  return mint === SOLANA_TOKENS.NATIVE_SOL || mint === SOLANA_TOKENS.wSOL
}

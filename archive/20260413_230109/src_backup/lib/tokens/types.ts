// Chain ID type
export type EvmChainId = 1 | 137 | 42161 | 10 | 8453

// Token type (compatible with uniswap token-list)
export interface Token {
  address: string // checksummed address
  chainId: number // chain ID
  decimals: number // token decimals
  symbol: string // token symbol
  name: string // token full name
  id: string // format: "${chainId}:${address}"
  logoURI?: string
  metadata?: {
    approved?: boolean
    logoUrl?: string
  }
}

// TokenWithBalance - token with balance
export interface TokenWithBalance extends Token {
  balance: bigint
  balanceFormatted: string
}

// CustomToken - user custom token
export interface CustomToken {
  chainId: number
  address: string
  decimals: number
  name: string
  symbol: string
  logoUrl?: string
}

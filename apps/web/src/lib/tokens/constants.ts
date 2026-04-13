import { CHAIN_IDS } from "@/lib/constants"
import { Token } from "./types"
import { getTokenId } from "@/lib/utils/format"

// Raw tokens from default token list
import { tokens as rawTokens } from "@uniswap/default-token-list"

// Transform raw tokens to our Token type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tokens: Token[] = (rawTokens as any[]).map((token) => ({
  ...token,
  id: getTokenId(token.chainId, token.address),
}))

// Native tokens for each chain
export const NATIVE_TOKENS: Record<number, Token> = {
  [CHAIN_IDS.mainnet]: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    chainId: CHAIN_IDS.mainnet,
    decimals: 18,
    symbol: "ETH",
    name: "Ether",
    id: `${CHAIN_IDS.mainnet}:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`,
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  },
  [CHAIN_IDS.polygon]: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    chainId: CHAIN_IDS.polygon,
    decimals: 18,
    symbol: "MATIC",
    name: "Polygon",
    id: `${CHAIN_IDS.polygon}:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`,
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
  },
  [CHAIN_IDS.arbitrum]: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    chainId: CHAIN_IDS.arbitrum,
    decimals: 18,
    symbol: "ETH",
    name: "Ether",
    id: `${CHAIN_IDS.arbitrum}:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`,
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  },
  [CHAIN_IDS.optimism]: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    chainId: CHAIN_IDS.optimism,
    decimals: 18,
    symbol: "ETH",
    name: "Ether",
    id: `${CHAIN_IDS.optimism}:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`,
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  },
  [CHAIN_IDS.base]: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    chainId: CHAIN_IDS.base,
    decimals: 18,
    symbol: "ETH",
    name: "Ether",
    id: `${CHAIN_IDS.base}:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`,
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  },
}

// Chain configuration
export const CHAIN_CONFIG = {
  [CHAIN_IDS.mainnet]: {
    name: "Ethereum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  [CHAIN_IDS.polygon]: {
    name: "Polygon",
    nativeCurrency: { name: "Polygon", symbol: "MATIC", decimals: 18 },
  },
  [CHAIN_IDS.arbitrum]: {
    name: "Arbitrum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  [CHAIN_IDS.optimism]: {
    name: "Optimism",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  [CHAIN_IDS.base]: {
    name: "Base",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
} as const

// Multicall3 address
export const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11"

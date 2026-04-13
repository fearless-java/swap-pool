/**
 * Multicall3 contract addresses across multiple chains
 */

/**
 * Multicall3 deployment addresses by chain ID
 * Multicall3 is a contract that allows multiple calls in a single transaction
 * See: https://www.multicall3.com/
 */
export const MULTICALL3_ADDRESS: Record<number, string> = {
  // Ethereum
  1: '0xca11bde05977b3631167028862be2a173976ca11',

  // Goerli (deprecated but kept for backwards compatibility)
  5: '0xca11bde05977b3631167028862be2a173976ca11',

  // Sepolia
  11155111: '0xca11bde05977b3631167028862be2a173976ca11',

  // Polygon
  137: '0xca11bde05977b3631167028862be2a173976ca11',
  80001: '0xca11bde05977b3631167028862be2a173976ca11',

  // Arbitrum
  42161: '0xca11bde05977b3631167028862be2a173976ca11',
  42170: '0xca11bde05977b3631167028862be2a173976ca11',
  421614: '0xca11bde05977b3631167028862be2a173976ca11',

  // Optimism
  10: '0xca11bde05977b3631167028862be2a173976ca11',
  11155420: '0xca11bde05977b3631167028862be2a173976ca11',

  // Base
  8453: '0xca11bde05977b3631167028862be2a173976ca11',
  84532: '0xca11bde05977b3631167028862be2a173976ca11',

  // zkSync Era
  324: '0xF9b1dD6c6c5F3a8C5b7eF1C5e5F3a8C5b7eF1C5e',
  280: '0xF9b1dD6c6c5F3a8C5b7eF1C5e5F3a8C5b7eF1C5e',

  // Linea
  59144: '0xca11bde05977b3631167028862be2a173976ca11',
  59140: '0xca11bde05977b3631167028862be2a173976ca11',

  // Scroll
  534352: '0xca11bde05977b3631167028862be2a173976ca11',
  534351: '0xca11bde05977b3631167028862be2a173976ca11',

  // Avalanche
  43114: '0xca11bde05977b3631167028862be2a173976ca11',
  43113: '0xca11bde05977b3631167028862be2a173976ca11',

  // BSC
  56: '0xca11bde05977b3631167028862be2a173976ca11',
  97: '0xca11bde05977b3631167028862be2a173976ca11',

  // Fantom
  250: '0xca11bde05977b3631167028862be2a173976ca11',
  4002: '0xca11bde05977b3631167028862be2a173976ca11',

  // Gnosis
  100: '0xca11bde05977b3631167028862be2a173976ca11',

  // Berachain
  80084: '0xca11bde05977b3631167028862be2a173976ca11',

  // Sonic (Flare)
  14: '0xca11bde05977b3631167028862be2a173976ca11',
  18332: '0xca11bde05977b3631167028862be2a173976ca11',

  // XLayer
  196: '0xca11bde05977b3631167028862be2a173976ca11',

  // opBNB
  204: '0xca11bde05977b3631167028862be2a173976ca11',
  5611: '0xca11bde05977b3631167028862be2a173976ca11',

  // Mantle
  5000: '0xca11bde05977b3631167028862be2a173976ca11',
  5001: '0xca11bde05977b3631167028862be2a173976ca11',

  // Celo
  42220: '0xca11bde05977b3631167028862be2a173976ca11',

  // Moonbeam
  1284: '0xca11bde05977b3631167028862be2a173976ca11',

  // Moonriver
  1285: '0xca11bde05977b3631167028862be2a173976ca11',

  // Kava
  2222: '0xca11bde05977b3631167028862be2a173976ca11',
}

/**
 * Get Multicall3 address for a given chain ID
 * @param chainId - The chain ID
 * @returns The Multicall3 address or undefined if not supported
 */
export function getMulticall3Address(chainId: number): string | undefined {
  return MULTICALL3_ADDRESS[chainId]
}

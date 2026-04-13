/**
 * dRPC configuration
 * Distributed RPC provider for enterprise-grade blockchain access
 */

const DRPC_BASE_URL = "https://lb.drpc.org/ogrpc"

interface DrpcChainConfig {
  network: string
  pollingInterval?: number // in seconds
}

export const DRPC_CHAIN_CONFIGS: Record<number, DrpcChainConfig> = {
  // Ethereum
  1: { network: "ethereum", pollingInterval: 8 },
  // 5: { network: "ethereum-goerli", pollingInterval: 8 }, // Goerli deprecated
  11155111: { network: "ethereum-sepolia", pollingInterval: 8 },
  // Polygon
  137: { network: "polygon", pollingInterval: 8 },
  80001: { network: "polygon-mumbai", pollingInterval: 8 },
  // Arbitrum
  42161: { network: "arbitrum", pollingInterval: 8 },
  42170: { network: "arbitrum-nova", pollingInterval: 8 },
  // Optimism
  10: { network: "optimism", pollingInterval: 8 },
  11155420: { network: "optimism-sepolia", pollingInterval: 8 },
  // Base
  8453: { network: "base", pollingInterval: 8 },
  84532: { network: "base-sepolia", pollingInterval: 8 },
  // zkSync Era
  324: { network: "zksync-era", pollingInterval: 12 },
  // Linea
  59144: { network: "linea", pollingInterval: 12 },
  // Scroll
  534352: { network: "scroll", pollingInterval: 12 },
  // Avalanche
  43114: { network: "avalanche", pollingInterval: 10 },
  // BSC
  56: { network: "bsc", pollingInterval: 10 },
  // Other chains...
}

export function getDrpcUrl(chainId: number, apiKey?: string): string {
  const config = DRPC_CHAIN_CONFIGS[chainId]
  if (!config) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  const baseUrl = `${DRPC_BASE_URL}?network=${config.network}`
  return apiKey ? `${baseUrl}&dkey=${apiKey}` : baseUrl
}

export function getDrpcPollingInterval(chainId: number): number {
  return DRPC_CHAIN_CONFIGS[chainId]?.pollingInterval ?? 12
}

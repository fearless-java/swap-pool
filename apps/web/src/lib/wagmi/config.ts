import { createConfig, http } from "wagmi"
import { mainnet, polygon, arbitrum, optimism, base, sepolia } from "wagmi/chains"
import { injected, walletConnect, coinbaseWallet, safe } from "wagmi/connectors"
import { getDrpcUrl, getDrpcPollingInterval } from "../rpc/drpc"
import { WALLET_CONNECT_PROJECT_ID, APP_NAME, CHAIN_IDS } from "../constants"

const chains = [mainnet, polygon, arbitrum, optimism, base, sepolia] as const

// Custom transport with dRPC
const createDrpcTransport = (chainId: number) => {
  return http(getDrpcUrl(chainId, process.env.NEXT_PUBLIC_DRPC_ID), {
    timeout: 30_000,
    pollingInterval: getDrpcPollingInterval(chainId) * 1000,
  })
}

export const config = createConfig({
  chains,
  connectors: [
    injected(),
    walletConnect({
      projectId: WALLET_CONNECT_PROJECT_ID,
      metadata: {
        name: APP_NAME,
        description: "Swap and Pool interface powered by SushiSwap",
        url: typeof window !== "undefined" ? window.location.origin : "https://sushi.com",
        icons: ["https://sushi.com/icon.png"],
      },
    }),
    coinbaseWallet({
      appName: APP_NAME,
    }),
    safe(),
  ],
  transports: {
    [CHAIN_IDS.mainnet]: createDrpcTransport(CHAIN_IDS.mainnet),
    [CHAIN_IDS.polygon]: createDrpcTransport(CHAIN_IDS.polygon),
    [CHAIN_IDS.arbitrum]: createDrpcTransport(CHAIN_IDS.arbitrum),
    [CHAIN_IDS.optimism]: createDrpcTransport(CHAIN_IDS.optimism),
    [CHAIN_IDS.base]: createDrpcTransport(CHAIN_IDS.base),
    [sepolia.id]: createDrpcTransport(sepolia.id),
  },
})

export type Config = typeof config

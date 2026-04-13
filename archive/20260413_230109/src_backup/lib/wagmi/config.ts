import { createConfig, http } from "wagmi"
import { mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains"
import { injected, walletConnect, coinbaseWallet, safe } from "wagmi/connectors"
import { RPC_URLS, WALLET_CONNECT_PROJECT_ID, APP_NAME, CHAIN_IDS } from "../constants"

const chains = [mainnet, polygon, arbitrum, optimism, base] as const

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
    [CHAIN_IDS.mainnet]: http(RPC_URLS.mainnet),
    [CHAIN_IDS.polygon]: http(RPC_URLS.polygon),
    [CHAIN_IDS.arbitrum]: http(RPC_URLS.arbitrum),
    [CHAIN_IDS.optimism]: http(RPC_URLS.optimism),
    [CHAIN_IDS.base]: http(RPC_URLS.base),
  },
})

export type Config = typeof config

"use client"

import { WagmiProvider } from "wagmi"
import { config } from "@/lib/wagmi/config"

export function WagmiProviderComponent({ children }: { children: React.ReactNode }) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>
}

"use client"

import { WagmiProviderComponent } from "./wagmi-provider"
import { QueryProvider } from "./query-provider"
import { PriceProvider } from "../context/PriceProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <WagmiProviderComponent>
        <PriceProvider>{children}</PriceProvider>
      </WagmiProviderComponent>
    </QueryProvider>
  )
}

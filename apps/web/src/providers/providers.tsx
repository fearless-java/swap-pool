"use client"

import { WagmiProviderComponent } from "./wagmi-provider"
import { QueryProvider } from "./query-provider"
import { PriceProvider } from "../context/PriceProvider"
import { SvmConnectorProvider } from "./SvmConnectorProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <WagmiProviderComponent>
        <SvmConnectorProvider>
          <PriceProvider>{children}</PriceProvider>
        </SvmConnectorProvider>
      </WagmiProviderComponent>
    </QueryProvider>
  )
}

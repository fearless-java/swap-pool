"use client"

import { WagmiProviderComponent } from "./wagmi-provider"
import { QueryProvider } from "./query-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <WagmiProviderComponent>{children}</WagmiProviderComponent>
    </QueryProvider>
  )
}

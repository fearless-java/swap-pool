'use client'

import SolanaProviders from './providers'

export default function SolanaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SolanaProviders>{children}</SolanaProviders>
}

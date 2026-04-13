'use client'

import { useMemo, type ReactNode } from 'react'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareAdapter } from '@solana/wallet-adapter-solflare'
import { TorusAdapter } from '@solana/wallet-adapter-torus'
import { BackpackAdapter } from '@solana/wallet-adapter-backpack'
import { clusterApiUrl } from '@solana/web3.js'

import '@solana/wallet-adapter-react-ui/styles.css'

interface SvmConnectorProviderProps {
  children: ReactNode
  /**
   * Solana cluster name - uses Solana's native cluster naming (mainnet, devnet, testnet)
   * Note: This differs from SvmChainId which uses 'solana', 'solana-devnet', 'solana-testnet'.
   * This is intentional as wallet adapters expect Solana cluster names.
   */
  network?: 'mainnet' | 'devnet' | 'testnet'
}

export function SvmConnectorProvider({
  children,
  network = 'mainnet'
}: SvmConnectorProviderProps) {
  const endpoint = useMemo(() => {
    if (network === 'mainnet') {
      return 'https://api.mainnet-beta.solana.com'
    }
    return clusterApiUrl(network)
  }, [network])

  const wallets = useMemo(() => [
    new PhantomAdapter(),
    new SolflareAdapter(),
    new TorusAdapter({ params: { network } }),
    new BackpackAdapter(),
  ], [network])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

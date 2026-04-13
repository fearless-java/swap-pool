import { useAccount } from 'wagmi'

/**
 * Get the chain ID of the currently connected wallet
 */
export function useConnectedChain() {
  const { chain, connector } = useAccount()

  return {
    chain,
    connector,
    chainId: chain?.id,
  }
}

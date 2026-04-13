import { useChainId } from 'wagmi'

/**
 * Get the current network chainId from the wagmi config
 */
export function useNetworkChainId() {
  const chainId = useChainId()
  return chainId
}

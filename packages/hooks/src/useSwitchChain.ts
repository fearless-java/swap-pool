import { useSwitchChain as useWagmiSwitchChain } from 'wagmi'
import type { Chain } from 'viem'

interface UseSwitchChainParams {
  onSuccess?: (chain: Chain) => void
  onError?: (error: Error) => void
}

/**
 * useSwitchChain hook wrapper for wagmi v2
 * Note: In wagmi v2, useSwitchChain is a mutation hook.
 * Callbacks (onSuccess, onError) should be passed when calling switchChain,
 * but for backwards compatibility, we extract them from the mutation result.
 */
export function useSwitchChain({ onSuccess, onError }: UseSwitchChainParams = {}) {
  const { mutate: switchChain, isPending, error } = useWagmiSwitchChain()

  // Wrapper that injects the callbacks
  const wrappedSwitchChain = (chainId: bigint | number, callbacks?: { onSuccess?: (chain: Chain) => void; onError?: (error: Error) => void }) => {
    switchChain(chainId, {
      onSuccess: callbacks?.onSuccess ?? onSuccess,
      onError: callbacks?.onError ?? onError,
    })
  }

  return {
    switchChain: wrappedSwitchChain,
    isPending,
    error,
  }
}

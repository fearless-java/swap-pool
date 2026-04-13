import { useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'
import type { Address } from 'viem'
import type { EvmChainId } from '@sushiswap/core/evm'
import { isEvmChainId } from '@sushiswap/core/evm'

interface UseTokenBalanceParams {
  token?: { address: Address; chainId: EvmChainId } | null
  owner?: Address
  watch?: boolean
}

export function useTokenBalance({ token, owner, watch }: UseTokenBalanceParams) {
  return useReadContract({
    address: token?.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: owner ? [owner] : undefined,
    chainId: isEvmChainId(token?.chainId) ? token.chainId : undefined,
    query: { watch },
  })
}

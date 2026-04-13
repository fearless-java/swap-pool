import { useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'
import type { Address } from 'viem'
import type { EvmChainId } from '@sushiswap/core/evm'
import { isEvmChainId } from '@sushiswap/core/evm'

interface UseAllowanceParams {
  token?: { address: Address; chainId: EvmChainId } | null
  owner?: Address
  spender?: Address
}

export function useAllowance({ token, owner, spender }: UseAllowanceParams) {
  return useReadContract({
    address: token?.address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    chainId: isEvmChainId(token?.chainId) ? token.chainId : undefined,
  })
}

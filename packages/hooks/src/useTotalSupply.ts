import { useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'
import type { Address } from 'viem'
import type { EvmChainId } from '@sushiswap/core/evm'
import { isEvmChainId } from '@sushiswap/core/evm'

interface UseTotalSupplyParams {
  token?: { address: Address; chainId: EvmChainId } | null
}

export function useTotalSupply({ token }: UseTotalSupplyParams) {
  return useReadContract({
    address: token?.address,
    abi: erc20Abi,
    functionName: 'totalSupply',
    chainId: isEvmChainId(token?.chainId) ? token.chainId : undefined,
  })
}

import { useReadContracts } from 'wagmi'
import { erc20Abi } from 'viem'
import type { Address } from 'viem'
import type { EvmChainId } from '@sushiswap/core/evm'
import { isEvmChainId } from '@sushiswap/core/evm'

interface TokenInfo {
  address: Address
  chainId: EvmChainId
  decimals: number
  symbol: string
  name: string
}

interface UseTokensParams {
  tokens: Array<{ address: Address; chainId: EvmChainId }>
  owner?: Address
}

const tokenAbi = [
  ...erc20Abi,
  {
    name: 'name',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
] as const

export function useTokens({ tokens, owner }: UseTokensParams) {
  const contracts = tokens.flatMap((token) => {
    if (!isEvmChainId(token.chainId)) return []

    const baseContract = {
      address: token.address,
      abi: erc20Abi,
      chainId: token.chainId,
    }

    return [
      {
        ...baseContract,
        functionName: 'balanceOf',
        args: owner ? [owner] : undefined,
      },
      {
        ...baseContract,
        functionName: 'decimals',
      },
      {
        ...baseContract,
        functionName: 'symbol',
      },
      {
        ...baseContract,
        functionName: 'name',
      },
    ]
  })

  const { data, isLoading, error } = useReadContracts({
    contracts: contracts.length > 0 ? contracts : undefined,
  })

  const tokensWithInfo: (TokenInfo & { balance?: bigint })[] = []

  for (let i = 0; i < tokens.length; i++) {
    const baseIndex = i * 4
    tokensWithInfo.push({
      address: tokens[i].address,
      chainId: tokens[i].chainId,
      decimals: Number(data?.[baseIndex + 1] ?? 18),
      symbol: (data?.[baseIndex + 2] as string) ?? '',
      name: (data?.[baseIndex + 3] as string) ?? '',
      balance: data?.[baseIndex] as bigint | undefined,
    })
  }

  return {
    tokens: tokensWithInfo,
    isLoading,
    error,
  }
}

import { useReadContracts } from 'wagmi'
import { erc20Abi } from 'viem'
import type { Address } from 'viem'
import type { EvmChainId } from '@sushiswap/core/evm'
import { isEvmChainId } from '@sushiswap/core/evm'

// Token list interface - would typically come from a token list registry
interface TokenListToken {
  address: Address
  chainId: EvmChainId
  decimals: number
  symbol: string
  name: string
  logoURI?: string
}

interface UseAllTokensParams {
  addresses: Array<{ address: Address; chainId: EvmChainId }>
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

export function useAllTokens({ addresses }: UseAllTokensParams) {
  const contracts = addresses.flatMap((token) => {
    if (!isEvmChainId(token.chainId)) return []

    return [
      {
        address: token.address,
        abi: erc20Abi,
        functionName: 'decimals',
        chainId: token.chainId,
      },
      {
        address: token.address,
        abi: erc20Abi,
        functionName: 'symbol',
        chainId: token.chainId,
      },
      {
        address: token.address,
        abi: erc20Abi,
        functionName: 'name',
        chainId: token.chainId,
      },
    ]
  })

  const { data, isLoading, error } = useReadContracts({
    contracts: contracts.length > 0 ? contracts : undefined,
  })

  const tokens: TokenListToken[] = []

  for (let i = 0; i < addresses.length; i++) {
    const baseIndex = i * 3
    tokens.push({
      address: addresses[i].address,
      chainId: addresses[i].chainId,
      decimals: Number(data?.[baseIndex] ?? 18),
      symbol: (data?.[baseIndex + 1] as string) ?? '',
      name: (data?.[baseIndex + 2] as string) ?? '',
    })
  }

  return {
    tokens,
    isLoading,
    error,
  }
}

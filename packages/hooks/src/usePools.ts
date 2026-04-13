import { useReadContracts } from 'wagmi'
import { erc20Abi } from 'viem'
import type { Address } from 'viem'
import type { EvmChainId } from '@sushiswap/core/evm'
import { isEvmChainId } from '@sushiswap/core/evm'

// Minimal ABI for pair contract (UniswapV2 style)
const pairAbi = [
  {
    name: 'getReserves',
    type: 'function',
    inputs: [],
    outputs: [
      { name: 'reserve0', type: 'uint112' },
      { name: 'reserve1', type: 'uint112' },
      { name: 'blockTimestampLast', type: 'uint32' },
    ],
    stateMutability: 'view',
  },
  {
    name: 'token0',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    name: 'token1',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    name: 'totalSupply',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

interface PoolInfo {
  address: Address
  chainId: EvmChainId
  token0: Address
  token1: Address
  reserve0: bigint
  reserve1: bigint
  totalSupply: bigint
}

interface UsePoolsParams {
  pools: Array<{ address: Address; chainId: EvmChainId }>
}

export function usePools({ pools }: UsePoolsParams) {
  const contracts = pools.flatMap((pool) => {
    if (!isEvmChainId(pool.chainId)) return []

    return [
      {
        address: pool.address,
        abi: pairAbi,
        functionName: 'getReserves',
        chainId: pool.chainId,
      },
      {
        address: pool.address,
        abi: pairAbi,
        functionName: 'token0',
        chainId: pool.chainId,
      },
      {
        address: pool.address,
        abi: pairAbi,
        functionName: 'token1',
        chainId: pool.chainId,
      },
      {
        address: pool.address,
        abi: pairAbi,
        functionName: 'totalSupply',
        chainId: pool.chainId,
      },
    ]
  })

  const { data, isLoading, error } = useReadContracts({
    contracts: contracts.length > 0 ? contracts : undefined,
  })

  const poolsInfo: PoolInfo[] = []

  for (let i = 0; i < pools.length; i++) {
    const baseIndex = i * 4
    const reserves = data?.[baseIndex] as
      | [bigint, bigint, number]
      | undefined
    const token0 = data?.[baseIndex + 1] as Address | undefined
    const token1 = data?.[baseIndex + 2] as Address | undefined
    const totalSupply = data?.[baseIndex + 3] as bigint | undefined

    poolsInfo.push({
      address: pools[i].address,
      chainId: pools[i].chainId,
      token0: token0 ?? ('0x' as Address),
      token1: token1 ?? ('0x' as Address),
      reserve0: reserves?.[0] ?? 0n,
      reserve1: reserves?.[1] ?? 0n,
      totalSupply: totalSupply ?? 0n,
    })
  }

  return {
    pools: poolsInfo,
    isLoading,
    error,
  }
}

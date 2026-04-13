import { useReadContract } from 'wagmi'
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
] as const

interface UsePoolPriceParams {
  pool?: { address: Address; chainId: EvmChainId } | null
  token0Decimals?: number
  token1Decimals?: number
}

interface PoolPrice {
  price0To1: number
  price1To0: number
  token0: Address
  token1: Address
}

export function usePoolPrice({
  pool,
  token0Decimals = 18,
  token1Decimals = 18,
}: UsePoolPriceParams) {
  const { data: reserves, isLoading: isLoadingReserves } = useReadContract({
    address: pool?.address,
    abi: pairAbi,
    functionName: 'getReserves',
    chainId: isEvmChainId(pool?.chainId) ? pool.chainId : undefined,
  })

  const { data: token0, isLoading: isLoadingToken0 } = useReadContract({
    address: pool?.address,
    abi: pairAbi,
    functionName: 'token0',
    chainId: isEvmChainId(pool?.chainId) ? pool.chainId : undefined,
  })

  const { data: token1, isLoading: isLoadingToken1 } = useReadContract({
    address: pool?.address,
    abi: pairAbi,
    functionName: 'token1',
    chainId: isEvmChainId(pool?.chainId) ? pool.chainId : undefined,
  })

  const price: PoolPrice | null = reserves && token0 && token1
    ? {
        token0,
        token1,
        // Price of token0 in terms of token1
        price0To1:
          Number(reserves[1]) / Math.pow(10, token1Decimals) /
          (Number(reserves[0]) / Math.pow(10, token0Decimals)),
        // Price of token1 in terms of token0
        price1To0:
          Number(reserves[0]) / Math.pow(10, token0Decimals) /
          (Number(reserves[1]) / Math.pow(10, token1Decimals)),
      }
    : null

  return {
    price,
    isLoading: isLoadingReserves || isLoadingToken0 || isLoadingToken1,
  }
}

import { useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'
import type { Address } from 'viem'
import type { EvmChainId } from '@sushiswap/core/evm'
import { isEvmChainId } from '@sushiswap/core/evm'

interface UseCurrencyParams {
  currency?: { address: Address; chainId: EvmChainId } | null
}

interface CurrencyInfo {
  address: Address
  chainId: EvmChainId
  decimals: number
  symbol: string
  name: string
}

export function useCurrency({ currency }: UseCurrencyParams) {
  const { data: decimals, isLoading: isLoadingDecimals } = useReadContract({
    address: currency?.address,
    abi: erc20Abi,
    functionName: 'decimals',
    chainId: isEvmChainId(currency?.chainId) ? currency.chainId : undefined,
  })

  const { data: symbol, isLoading: isLoadingSymbol } = useReadContract({
    address: currency?.address,
    abi: erc20Abi,
    functionName: 'symbol',
    chainId: isEvmChainId(currency?.chainId) ? currency.chainId : undefined,
  })

  const { data: name, isLoading: isLoadingName } = useReadContract({
    address: currency?.address,
    abi: erc20Abi,
    functionName: 'name',
    chainId: isEvmChainId(currency?.chainId) ? currency.chainId : undefined,
  })

  const currencyInfo: CurrencyInfo | null = currency
    ? {
        address: currency.address,
        chainId: currency.chainId,
        decimals: Number(decimals ?? 18),
        symbol: (symbol as string) ?? '',
        name: (name as string) ?? '',
      }
    : null

  return {
    currency: currencyInfo,
    isLoading: isLoadingDecimals || isLoadingSymbol || isLoadingName,
  }
}

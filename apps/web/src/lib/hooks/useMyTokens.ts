"use client"

import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"
import { useAccount, useChainId, usePublicClient } from "wagmi"
import { ERC20_ABI } from "@/lib/tokens/erc20"
import { NATIVE_TOKENS, tokens } from "@/lib/tokens/constants"
import { EvmChainId, Token, TokenWithBalance } from "@/lib/tokens/types"
import { formatBalance } from "@/lib/utils/format"

interface UseMyTokensParams {
  chainId?: EvmChainId
  account?: Address
  customTokens?: Token[]
  includeNative?: boolean
}

interface UseMyTokensResult {
  tokens: TokenWithBalance[]
  balanceMap: Map<Address, bigint>
  isLoading: boolean
  isError: boolean
}

export function useMyTokens({
  chainId,
  account,
  customTokens = [],
  includeNative = true,
}: UseMyTokensParams): UseMyTokensResult {
  const publicClient = usePublicClient()

  // Get native token balance
  const nativeToken = chainId ? NATIVE_TOKENS[chainId] : undefined

  // Query for native balance
  const { data: nativeBalance, isLoading: isLoadingNative, isError: isErrorNative } = useQuery({
    queryKey: ["nativeBalance", chainId, account],
    queryFn: async () => {
      if (!chainId || !account || !publicClient) return 0n

      try {
        const balance = await publicClient.getBalance({ address: account })
        return balance
      } catch {
        return 0n
      }
    },
    enabled: Boolean(chainId && account && publicClient && includeNative),
    staleTime: 30 * 1000,
    refetchInterval: 10 * 1000,
  })

  // Get ERC20 tokens for the chain
  const erc20Tokens = tokens.filter((t) => t.chainId === chainId)

  // Combine with custom tokens
  const allTokens: Token[] = [
    ...(includeNative && nativeToken ? [nativeToken] : []),
    ...erc20Tokens,
    ...customTokens,
  ]

  // Deduplicate by address
  const uniqueTokens = allTokens.reduce((acc, token) => {
    const key = token.address.toLowerCase() as Address
    if (!acc.has(key)) {
      acc.set(key, token)
    }
    return acc
  }, new Map<Address, Token>())

  // Query for ERC20 balances using multicall
  // Use sorted token addresses as key to ensure stability across renders
  const erc20TokenAddresses = Array.from(uniqueTokens.keys()).sort().join(",")
  const { data: erc20Balances, isLoading: isLoadingErc20, isError: isErrorErc20 } = useQuery({
    queryKey: ["erc20Balances", chainId, account, erc20TokenAddresses],
    queryFn: async () => {
      if (!chainId || !account || !publicClient) return new Map<Address, bigint>()

      const balanceMap = new Map<Address, bigint>()

      try {
        // Batch balance queries
        const erc20TokenEntries = Array.from(uniqueTokens.values()).filter(
          (t) => t.address !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        )

        if (erc20TokenEntries.length === 0) return balanceMap

        const calls = erc20TokenEntries.map((token) => ({
          address: token.address as Address,
          functionName: "balanceOf",
          args: [account] as const,
        }))

        const results = await publicClient.multicall({
          contracts: calls.map((call) => ({
            address: call.address,
            abi: ERC20_ABI,
            functionName: call.functionName,
            args: call.args,
          })),
        })

        erc20TokenEntries.forEach((token, index) => {
          const result = results[index]
          if (result && result.status === "success") {
            // Use lowercase key for consistency with uniqueTokens map
            balanceMap.set(token.address.toLowerCase() as Address, result.result as bigint)
          }
        })
      } catch {
        // Return empty map on error
      }

      return balanceMap
    },
    enabled: Boolean(chainId && account && publicClient && uniqueTokens.size > 0),
    staleTime: 30 * 1000,
    refetchInterval: 10 * 1000,
  })

  // Combine results
  const balanceMap = new Map<Address, bigint>(erc20Balances || [])
  if (nativeBalance !== undefined && nativeToken) {
    // Use lowercase key for consistency
    balanceMap.set(nativeToken.address.toLowerCase() as Address, nativeBalance)
  }

  const tokensWithBalance: TokenWithBalance[] = Array.from(uniqueTokens.values())
    .map((token) => {
      const balance = balanceMap.get(token.address as Address) ?? 0n
      return {
        ...token,
        balance,
        balanceFormatted: formatBalance(balance, token.decimals),
      }
    })
    .filter((t) => t.balance > 0n)
    .sort((a, b) => {
      // Sort by balance descending
      return a.balance > b.balance ? -1 : a.balance < b.balance ? 1 : 0
    })

  return {
    tokens: tokensWithBalance,
    balanceMap,
    isLoading: isLoadingNative || isLoadingErc20,
    isError: isErrorNative || isErrorErc20,
  }
}

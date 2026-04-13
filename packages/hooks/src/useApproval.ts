import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { erc20Abi } from 'viem'
import type { Address } from 'viem'
import { parseUnits } from 'viem/utils'
import { isEvmChainId } from '@sushiswap/core/evm'

interface UseApprovalParams {
  token: { address: Address; chainId: number; decimals: number }
  spender: Address
  amount: string
  enabled?: boolean
}

export function useApproval({
  token,
  spender,
  amount,
  enabled = true,
}: UseApprovalParams) {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const {
    isLoading: isApproving,
    isSuccess: isApproved,
  } = useWaitForTransactionReceipt({ hash })

  const approve = () => {
    if (!enabled || !isEvmChainId(token.chainId)) return
    const value = parseUnits(amount || '0', token.decimals)
    writeContract({
      address: token.address,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender, value],
      chainId: token.chainId,
    })
  }

  return {
    approve,
    isApproving,
    isApproved,
    isPending,
    hash,
    error,
  }
}

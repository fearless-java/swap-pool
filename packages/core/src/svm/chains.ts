/**
 * SVM Chain IDs - Solana, Devnet, and Testnet
 */
export const SVM_CHAIN_IDS = ['solana', 'solana-devnet', 'solana-testnet'] as const

export type SvmChainId = typeof SVM_CHAIN_IDS[number]

/**
 * SVM chain configuration
 */
export const SVM_CHAIN_CONFIG: Record<SvmChainId, { name: string; rpcUrl: string; chainId: number }> = {
  'solana': {
    name: 'Solana',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    chainId: 101,
  },
  'solana-devnet': {
    name: 'Solana Devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    chainId: 102,
  },
  'solana-testnet': {
    name: 'Solana Testnet',
    rpcUrl: 'https://api.testnet.solana.com',
    chainId: 103,
  },
}

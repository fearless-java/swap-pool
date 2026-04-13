/**
 * SVM (Solana Virtual Machine) Chain type definitions
 */

/**
 * SVM Chain ID type
 */
export type SvmChainId = 'solana' | 'solana-devnet' | 'solana-testnet'

/**
 * SVM Chain configuration
 */
export interface SvmChainConfig {
  id: SvmChainId
  name: string
  rpcUrl: string
  chainId: number
}

/**
 * SVM Chain ID to configuration mapping
 */
export type SvmChainConfigMap = Record<SvmChainId, SvmChainConfig>

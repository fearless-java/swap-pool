/**
 * Stellar Chain type definitions
 */

/**
 * Stellar Chain ID type
 */
export type StellarChainId = 'stellar' | 'stellar-testnet' | 'stellar-pubnet'

/**
 * Stellar Chain configuration
 */
export interface StellarChainConfig {
  id: StellarChainId
  name: string
  networkPassphrase: string
  horizonUrl: string
}

/**
 * Stellar Chain ID to configuration mapping
 */
export type StellarChainConfigMap = Record<StellarChainId, StellarChainConfig>

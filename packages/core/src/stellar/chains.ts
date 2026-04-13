/**
 * Stellar Chain IDs - Stellar mainnet, testnet, and pubnet
 */
export const STELLAR_CHAIN_IDS = ['stellar', 'stellar-testnet', 'stellar-pubnet'] as const

export type StellarChainId = typeof STELLAR_CHAIN_IDS[number]

/**
 * Stellar chain configuration
 */
export const STELLAR_CHAIN_CONFIG: Record<StellarChainId, { name: string; networkPassphrase: string; horizonUrl: string }> = {
  'stellar': {
    name: 'Stellar',
    networkPassphrase: 'Public Global Stellar Network ; June 2021',
    horizonUrl: 'https://horizon.stellar.org',
  },
  'stellar-testnet': {
    name: 'Stellar Testnet',
    networkPassphrase: 'Test SDF Network ; September 2015',
    horizonUrl: 'https://horizon-testnet.stellar.org',
  },
  'stellar-pubnet': {
    name: 'Stellar Public Net',
    networkPassphrase: 'Public Global Stellar Network ; June 2021',
    horizonUrl: 'https://horizon.stellar.org',
  },
}

/**
 * EVM Chain IDs - 50+ supported EVM chains
 */
export const EVM_CHAIN_IDS = [
  // Ethereum
  1,           // Ethereum Mainnet
  5,           // Goerli
  11155111,    // Sepolia
  // Polygon
  137,         // Polygon Mainnet
  80001,       // Mumbai
  // Arbitrum
  42161,       // Arbitrum One
  42170,       // Arbitrum Nova
  421614,      // Arbitrum Sepolia
  // Optimism
  10,          // Optimism Mainnet
  11155420,    // Optimism Sepolia
  // Base
  8453,        // Base Mainnet
  84532,       // Base Sepolia
  // zkSync Era
  324,         // zkSync Era Mainnet
  280,         // zkSync Era Sepolia
  // Linea
  59144,       // Linea Mainnet
  59140,       // Linea Sepolia
  // Scroll
  534352,      // Scroll Mainnet
  534351,      // Scroll Sepolia
  // Avalanche
  43114,       // Avalanche C-Chain
  43113,       // Avalanche Fuji
  // BSC
  56,          // BNB Smart Chain
  97,          // BSC Testnet
  // Fantom
  250,         // Fantom Opera
  4002,        // Fantom Testnet
  // Gnosis
  100,         // Gnosis Chain
  // Berachain
  80084,       // Berachain Artio (Testnet)
  // Monad
  9700,        // Monad Testnet
  // Sonic
  14,          // Sonic Mainnet (Flare)
  18332,       // Sonic Testnet
  // HyperEVM
  6969,        // HyperEVM
  // MegaETH
  634,         // MegaETH Mainnet
  // XLayer
  196,         // XLayer Mainnet
  // Ape
  33133,       // Ape Mainnet
  // Katana
  8111,        // Katana Mainnet
  // Hemi
  7439,        // Hemi Testnet
  // Other EVM chains
  128,         // Heco
  4689,        // IoTeX
  66,          // OKC
  8217,        // Klaytn
  42220,       // Celo
  1088,        // Metis
  5165,        // BitTorrent Chain (BTT)
  122,         // Fuse
  40,          // Telos
  1284,        // Moonbeam
  1285,        // Moonriver
  2222,        // Kava
  106,         // Vela
  57,          // Syscoin
  820,         // Callisto
  336,         // Shiden
  592,         // Astar
  81,          // Oasis (Emerald)
  23294,       // Oasis Sapphire
  23295,       // Oasis Sapphire Testnet
  204,         // opBNB
  5611,        // opBNB Testnet
  5000,        // Mantle
  5001,        // Mantle Testnet
  2001,        // Milkomeda C1
  335,         // DFK
  590,         // New EVM chains
] as const

export type EvmChainId = typeof EVM_CHAIN_IDS[number]

/**
 * EVM chain ID to metadata mapping
 */
export const EVM_CHAIN_META: Record<EvmChainId, { name: string; chainTag: string }> = {
  // Ethereum
  1: { name: 'Ethereum', chainTag: 'eth' },
  5: { name: 'Goerli', chainTag: 'gor' },
  11155111: { name: 'Sepolia', chainTag: 'sep' },
  // Polygon
  137: { name: 'Polygon', chainTag: 'matic' },
  80001: { name: 'Mumbai', chainTag: 'maticmum' },
  // Arbitrum
  42161: { name: 'Arbitrum One', chainTag: 'arb1' },
  42170: { name: 'Arbitrum Nova', chainTag: 'arb-nova' },
  421614: { name: 'Arbitrum Sepolia', chainTag: 'arb-sep' },
  // Optimism
  10: { name: 'Optimism', chainTag: 'op' },
  11155420: { name: 'Optimism Sepolia', chainTag: 'op-sep' },
  // Base
  8453: { name: 'Base', chainTag: 'base' },
  84532: { name: 'Base Sepolia', chainTag: 'base-sep' },
  // zkSync Era
  324: { name: 'zkSync Era', chainTag: 'zksync' },
  280: { name: 'zkSync Era Sepolia', chainTag: 'zksync-sep' },
  // Linea
  59144: { name: 'Linea', chainTag: 'linea' },
  59140: { name: 'Linea Sepolia', chainTag: 'linea-sep' },
  // Scroll
  534352: { name: 'Scroll', chainTag: 'scroll' },
  534351: { name: 'Scroll Sepolia', chainTag: 'scroll-sep' },
  // Avalanche
  43114: { name: 'Avalanche C-Chain', chainTag: 'avax' },
  43113: { name: 'Avalanche Fuji', chainTag: 'avax Fuji' },
  // BSC
  56: { name: 'BNB Smart Chain', chainTag: 'bsc' },
  97: { name: 'BNB Smart Chain Testnet', chainTag: 'bnbt' },
  // Fantom
  250: { name: 'Fantom Opera', chainTag: 'ftm' },
  4002: { name: 'Fantom Testnet', chainTag: 'ftm-testnet' },
  // Gnosis
  100: { name: 'Gnosis Chain', chainTag: 'gno' },
  // Berachain
  80084: { name: 'Berachain Artio', chainTag: 'berachain-artio' },
  // Monad
  9700: { name: 'Monad Testnet', chainTag: 'monad' },
  // Sonic
  14: { name: 'Sonic Mainnet (Flare)', chainTag: 'flare' },
  18332: { name: 'Sonic Testnet', chainTag: 'sonic-testnet' },
  // HyperEVM
  6969: { name: 'HyperEVM', chainTag: 'hyperevm' },
  // MegaETH
  634: { name: 'MegaETH Mainnet', chainTag: 'megaeth' },
  // XLayer
  196: { name: 'XLayer Mainnet', chainTag: 'xlayer' },
  // Ape
  33133: { name: 'Ape Mainnet', chainTag: 'ape' },
  // Katana
  8111: { name: 'Katana Mainnet', chainTag: 'katana' },
  // Hemi
  7439: { name: 'Hemi Testnet', chainTag: 'hemi' },
  // Other EVM chains
  128: { name: 'Heco', chainTag: 'heco' },
  4689: { name: 'IoTeX', chainTag: 'iotex' },
  66: { name: 'OKC', chainTag: 'okc' },
  8217: { name: 'Klaytn', chainTag: 'klaytn' },
  42220: { name: 'Celo', chainTag: 'celo' },
  1088: { name: 'Metis', chainTag: 'metis' },
  5165: { name: 'BitTorrent Chain (BTT)', chainTag: 'btt' },
  122: { name: 'Fuse', chainTag: 'fuse' },
  40: { name: 'Telos', chainTag: 'telos' },
  1284: { name: 'Moonbeam', chainTag: 'moonbeam' },
  1285: { name: 'Moonriver', chainTag: 'moonriver' },
  2222: { name: 'Kava', chainTag: 'kava' },
  106: { name: 'Vela', chainTag: 'vela' },
  57: { name: 'Syscoin', chainTag: 'syscoin' },
  820: { name: 'Callisto', chainTag: 'callisto' },
  336: { name: 'Shiden', chainTag: 'shiden' },
  592: { name: 'Astar', chainTag: 'astar' },
  81: { name: 'Oasis (Emerald)', chainTag: 'oasis' },
  23294: { name: 'Oasis Sapphire', chainTag: 'sapphire' },
  23295: { name: 'Oasis Sapphire Testnet', chainTag: 'sapphire-testnet' },
  204: { name: 'opBNB', chainTag: 'opbnb' },
  5611: { name: 'opBNB Testnet', chainTag: 'opbnb-testnet' },
  5000: { name: 'Mantle', chainTag: 'mantle' },
  5001: { name: 'Mantle Testnet', chainTag: 'mantle-testnet' },
  2001: { name: 'Milkomeda C1', chainTag: 'milkomeda-c1' },
  335: { name: 'DFK', chainTag: 'dfk' },
  590: { name: 'New EVM Chain', chainTag: 'new-evm' },
}

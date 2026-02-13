/**
 * Common constants shared across the application
 */

/**
 * Network types enum
 */
export enum NetworkType {
  PREVIEW = "preview",
  TESTNET = "testnet",
  PREPROD = "preprod",
  MAINNET = "mainnet",
}

/**
 * Network domain mappings
 */
export const NETWORK_DOMAINS = {
  [NetworkType.PREVIEW]: 'preview.midnightexplorer.com',
  [NetworkType.TESTNET]: 'testnet.midnightexplorer.com',
  [NetworkType.PREPROD]: 'preprod.midnightexplorer.com',
  [NetworkType.MAINNET]: 'midnightexplorer.com'
} as const

/**
 * Network display configurations
 */
export const NETWORK_DISPLAY = {
  [NetworkType.PREVIEW]: {
    label: 'Preview',
    color: 'text-blue-400',
    iconColor: 'text-blue-400'
  },
  [NetworkType.TESTNET]: {
    label: 'Testnet',
    color: 'text-amber-400',
    iconColor: 'text-amber-400'
  },
  [NetworkType.PREPROD]: {
    label: 'Preprod',
    color: 'text-purple-400',
    iconColor: 'text-purple-400'
  },
  [NetworkType.MAINNET]: {
    label: 'Mainnet',
    color: 'text-green-400',
    iconColor: 'text-green-400'
  }
} as const

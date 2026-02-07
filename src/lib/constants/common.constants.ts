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
 * Unified network configuration - add new networks here only
 */
export const NETWORKS = {
  [NetworkType.PREVIEW]: {
    label: "Preview",
    domain: "preview.midnightexplorer.com",
    color: "text-blue-400",
    iconColor: "text-blue-400",
    enabled: true,
    message: undefined,
  },
  [NetworkType.TESTNET]: {
    label: "Testnet",
    domain: "testnet.midnightexplorer.com",
    color: "text-amber-400",
    iconColor: "text-amber-400",
    enabled: true,
    message: undefined,
  },
  [NetworkType.PREPROD]: {
    label: "Preprod",
    domain: "preprod.midnightexplorer.com",
    color: "text-purple-400",
    iconColor: "text-purple-400",
    enabled: true,
    message: undefined,
  },
  [NetworkType.MAINNET]: {
    label: "Mainnet",
    domain: "midnightexplorer.com",
    color: "text-green-400",
    iconColor: "text-green-400",
    enabled: false,
    message: "Upcoming",
  },
} as const;

export const TOKEN_DECIMALS = {
  NIGHT: 6,
} as const;

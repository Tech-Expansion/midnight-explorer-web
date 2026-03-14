/**
 * Network types enum
 */
export enum NetworkType {
  PREVIEW = "preview",
  // TESTNET = "testnet", // sunset
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
    domains: [
      "preview.midnightexplorer.com",
      "preview.dev.midnightexplorer.com",
      "preview.test.midnightexplorer.com",
    ],
    color: "text-blue-400",
    iconColor: "text-blue-400",
    enabled: true,
    message: undefined,
  },
  // [NetworkType.TESTNET]: {
  //   label: "Testnet",
  //   domain: "testnet.midnightexplorer.com",
  //   domains: [
  //     "testnet.midnightexplorer.com",
  //     "testnet.dev.midnightexplorer.com",
  //     "testnet.test.midnightexplorer.com",
  //   ],
  //   color: "text-amber-400",
  //   iconColor: "text-amber-400",
  //   enabled: true,
  //   message: undefined,
  // },
  [NetworkType.PREPROD]: {
    label: "Preprod",
    domain: "preprod.midnightexplorer.com",
    domains: [
      "midnightexplorer.com",
      "preprod.midnightexplorer.com",
      "preprod.dev.midnightexplorer.com",
      "preprod.test.midnightexplorer.com",
    ],
    color: "text-purple-400",
    iconColor: "text-purple-400",
    enabled: true,
    message: undefined,
  },
  [NetworkType.MAINNET]: {
    label: "Mainnet",
    domain: "midnightexplorer.com",
    domains: [
      // "midnightexplorer.com",
      "mainnet.dev.midnightexplorer.com",
      "mainnet.test.midnightexplorer.com",
    ],
    color: "text-green-400",
    iconColor: "text-green-400",
    enabled: false,
    message: "Upcoming",
  },
} as const;

export const TOKEN_DECIMALS = {
  NIGHT: 6,
} as const;

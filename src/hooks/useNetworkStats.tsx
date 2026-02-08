import { useQuery } from '@tanstack/react-query'
import { fetchWithTokenRetry } from '@/lib/token-client'
import {networkAPI} from '@/lib/api'
interface SideChainStatus {
  sidechainCurrentEpoch: number
  sidechainSlot: number
  nextEpochTimestamp: number
}

interface Block {
  height: number
  hash: string
  timestamp: number
  transactionCount: number
}

interface NetworkData {
  sidechainStatus: SideChainStatus | null
  latestBlock: Block | null
  totalTransactions: number | null
}

/**
 * Fetch network stats (sidechain status, latest block, tx count)
 * Token is automatically handled by TokenProvider
 */
export function useNetworkStats() {
  return useQuery<NetworkData>({
    queryKey: ['networkStats'],
    queryFn: async () => {
      // Fetch 3 APIs in parallel
      const [blocksRes, txCountRes] = await Promise.all([
        fetchWithTokenRetry('/api/blocks/recent'),
        fetchWithTokenRetry('/api/transactions/count')
      ])

      if(!blocksRes.ok || !txCountRes.ok) {
        throw new Error('Failed to fetch network stats')
      }

      const statusData: SideChainStatus = await networkAPI.getSidechainStatus()
      const blocksData = await blocksRes.json()
      const txCountData = await txCountRes.json()

      return {
        sidechainStatus: statusData,
        latestBlock: blocksData.blocks?.[0] || null,
        totalTransactions: txCountData.count || null,
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000,
  })
} 
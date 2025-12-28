import { useState, useEffect } from 'react'

interface SideChainStatus {
  epoch: number
  slot: number
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
  loading: boolean
  error: string | null
}

export function useNetworkStats() {
  const [data, setData] = useState<NetworkData>({
    sidechainStatus: null,
    latestBlock: null,
    totalTransactions: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    async function fetchData() {
      try {
        // ✅ Fetch 3 APIs in parallel
        const [statusRes, blocksRes, txCountRes] = await Promise.all([
          fetch('/api/sidechainstatus'),
          fetch('/api/blocks/recent'),
          fetch('/api/transactions/count')
        ])

        if (!statusRes.ok || !blocksRes.ok || !txCountRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const statusData = await statusRes.json()
        const blocksData = await blocksRes.json()
        const txCountData = await txCountRes.json()

        setData({
          sidechainStatus: statusData.sidechain,
          latestBlock: blocksData.blocks?.[0] || null,
          totalTransactions: txCountData.count || null,
          loading: false,
          error: null
        })
      } catch (err) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load network data'
        }))
        console.error('Error fetching network stats:', err)
      }
    }

    fetchData()

  }, [])

  return data
} 
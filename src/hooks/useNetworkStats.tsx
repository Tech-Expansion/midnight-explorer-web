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
  loading: boolean
  error: string | null
}

export function useNetworkStats() {
  const [data, setData] = useState<NetworkData>({
    sidechainStatus: null,
    latestBlock: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch cả 2 API song song
        const [statusRes, blocksRes] = await Promise.all([
          fetch('/api/sidechainstatus'),
          fetch('/api/blocks/recent')
        ])

        if (!statusRes.ok || !blocksRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const statusData = await statusRes.json()
        const blocksData = await blocksRes.json()

        setData({
          sidechainStatus: statusData.sidechain,
          latestBlock: blocksData.blocks?.[0] || null,
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

    // Fetch ngay lập tức
    fetchData()

    // Fetch mỗi 10 giây
    const interval = setInterval(fetchData, 10000)

    return () => clearInterval(interval)
  }, [])

  return data
}
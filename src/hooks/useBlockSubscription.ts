'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient, Client } from 'graphql-ws'
import { Block } from '@/lib/types'
import { blockAPI } from '@/lib/api'

interface SubscriptionBlock {
  hash: string
  height: number
  protocolVersion?: number
  timestamp: string
  author: string
  transactions: { id: string; hash: string }[]
}

function toBlock(sb: SubscriptionBlock): Block {
  return {
    hash: sb.hash,
    height: sb.height,
    author: sb.author,
    timestamp: sb.timestamp,
    txCount: sb.transactions?.length || 0,
  }
}

const MAX_BLOCKS = 20

const BLOCK_SUBSCRIPTION_QUERY = `
  subscription BlockSubscription {
    blocks {
      hash
      height
      protocolVersion
      timestamp
      author
      transactions {
        id
        hash
      }
    }
  }
`

const WS_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_WS_URL ||
  'wss://indexer.preprod.midnight.network/api/v4/graphql/ws'

export function useBlockSubscription() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [isLive, setIsLive] = useState(false)
  const clientRef = useRef<Client | null>(null)
  const queryClient = useQueryClient()
  const initialFetchDone = useRef(false)

  // Fetch initial blocks via REST as fallback / initial data
  const fetchInitialBlocks = useCallback(async () => {
    try {
      const data = await blockAPI.getRecentBlocks<{ blocks: Block[] }>()
      const apiBlocks = data.blocks || []
      setBlocks((prev) => {
        if (prev.length === 0) return apiBlocks
        const wsMaxHeight = prev[0]?.height || 0
        const olderFromApi = apiBlocks.filter((b) => b.height < wsMaxHeight)
        return [...prev, ...olderFromApi].slice(0, MAX_BLOCKS)
      })
      initialFetchDone.current = true
    } catch (err) {
      console.error('Failed to fetch initial blocks:', err)
    }
  }, [])

  useEffect(() => {
    // Fetch initial data via REST
    fetchInitialBlocks()

    // Connect directly to GraphQL WebSocket subscription
    const client = createClient({
      url: WS_URL,
      retryAttempts: Infinity,
      shouldRetry: () => true,
      retryWait: async (retries) => {
        const delay = Math.min(1000 * 2 ** retries, 30000)
        console.log(`[BlockSubscription] Reconnecting in ${delay}ms (attempt ${retries + 1})...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      },
      on: {
        connected: () => {
          console.log('[BlockSubscription] Connected to GraphQL WebSocket')
          setIsLive(true)
        },
        closed: () => {
          console.log('[BlockSubscription] GraphQL WebSocket closed')
          setIsLive(false)
        },
        error: (err) => {
          console.warn('[BlockSubscription] WebSocket error:', err)
        },
      },
    })

    clientRef.current = client

    // Start the subscription
    let cancelled = false

    ;(async () => {
      try {
        const subscription = client.iterate<{ blocks: SubscriptionBlock }>({
          query: BLOCK_SUBSCRIPTION_QUERY,
        })

        for await (const result of subscription) {
          if (cancelled) break

          if (result.data?.blocks) {
            const rawBlock = result.data.blocks
            const newBlock = toBlock(rawBlock)

            setBlocks((prev) => {
              if (prev.some((b) => b.hash === newBlock.hash)) return prev
              return [newBlock, ...prev].slice(0, MAX_BLOCKS)
            })

            // Also update react-query cache so other components stay in sync
            queryClient.setQueryData(['recent-blocks'], (old: Block[] | undefined) => {
              if (!old) return [newBlock]
              if (old.some((b) => b.hash === newBlock.hash)) return old
              return [newBlock, ...old].slice(0, MAX_BLOCKS)
            })
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error('[BlockSubscription] Subscription error:', error)
        }
      }
    })()

    return () => {
      cancelled = true
      client.dispose()
      clientRef.current = null
    }
  }, [fetchInitialBlocks, queryClient])

  return { blocks, isLive }
}

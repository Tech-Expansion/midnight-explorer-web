'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io, Socket } from 'socket.io-client'
import { Block } from '@/lib/types'
import { blockAPI } from '@/lib/api'

interface SubscriptionBlock {
  hash: string
  height: number
  protocolVersion?: number
  timestamp: string
  author: string
  transactions: { id: string; hash: string }[]
  transactionsCount: number
}

function toBlock(sb: SubscriptionBlock): Block {
  return {
    hash: sb.hash,
    height: sb.height,
    author: sb.author,
    timestamp: sb.timestamp,
    txCount: sb.transactionsCount,
  }
}

const MAX_BLOCKS = 20
const SERVICE_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3002'

export function useBlockSubscription() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [isLive, setIsLive] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const queryClient = useQueryClient()
  const initialFetchDone = useRef(false)

  // Fetch initial blocks via REST as fallback / initial data
  const fetchInitialBlocks = useCallback(async () => {
    try {
      const data = await blockAPI.getRecentBlocks<{ blocks: Block[] }>()
      const apiBlocks = data.blocks || []
      setBlocks((prev) => {
        // Merge: keep WS blocks that are newer, fill with REST blocks
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

    // Connect to Socket.IO
    const socket = io(`${SERVICE_URL}/ws`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('[BlockSubscription] Connected to WebSocket')
      setIsLive(true)
    })

    socket.on('disconnect', () => {
      console.log('[BlockSubscription] Disconnected from WebSocket')
      setIsLive(false)
    })

    socket.on('connect_error', (err) => {
      console.warn('[BlockSubscription] Connection error:', err.message)
      setIsLive(false)
    })

    // Receive cached recent blocks on first connect
    socket.on('recentBlocks', (recentBlocks: SubscriptionBlock[]) => {
      const converted = recentBlocks.map(toBlock)
      setBlocks((prev) => {
        if (prev.length === 0) return converted
        // Merge WS cache with existing data
        const existingHashes = new Set(prev.map((b) => b.hash))
        const newFromWs = converted.filter((b) => !existingHashes.has(b.hash))
        const merged = [...newFromWs, ...prev]
          .sort((a, b) => b.height - a.height)
          .slice(0, MAX_BLOCKS)
        return merged
      })
    })

    // Receive new blocks in real-time
    socket.on('newBlock', (block: SubscriptionBlock) => {
      const newBlock = toBlock(block)
      setBlocks((prev) => {
        // Check for duplicates
        if (prev.some((b) => b.hash === newBlock.hash)) return prev
        const updated = [newBlock, ...prev].slice(0, MAX_BLOCKS)
        return updated
      })

      // Also update react-query cache so other components stay in sync
      queryClient.setQueryData(['recent-blocks'], (old: Block[] | undefined) => {
        if (!old) return [newBlock]
        if (old.some((b) => b.hash === newBlock.hash)) return old
        return [newBlock, ...old].slice(0, MAX_BLOCKS)
      })
    })

    // Subscription status from the server
    socket.on('subscriptionStatus', (status: { connected: boolean }) => {
      if (status.connected) {
        setIsLive(true)
      }
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [fetchInitialBlocks, queryClient])

  return { blocks, isLive }
}

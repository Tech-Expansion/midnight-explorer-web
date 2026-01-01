"use client"

import { useEffect, useState } from "react"
import { tokenAPI } from "@/lib/api"

interface TokenQuote {
  price: number
  volume_24h: number
  volume_change_24h: number
  percent_change_1h: number
  percent_change_24h: number
  percent_change_7d: number
  percent_change_30d: number
  market_cap: number
  market_cap_dominance: number
  fully_diluted_market_cap: number
  last_updated: string
}

interface TokenData {
  id: number
  name: string
  symbol: string
  slug: string
  cmc_rank: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  quote: {
    USD: TokenQuote
  }
}

interface TokenResponse {
  data: {
    NIGHT: TokenData
  }
}

// Global state - singleton pattern
let sharedData: TokenData | null = null
let sharedLoading = true
let fetchInterval: NodeJS.Timeout | null = null
let hasFetched = false
const subscribers: Set<(data: TokenData | null, loading: boolean) => void> = new Set()

async function fetchTokenData() {
  try {
    const response = await tokenAPI.getNightToken<TokenResponse>()
    sharedData = response.data.NIGHT
    sharedLoading = false
    
    // Notify all subscribers
    subscribers.forEach(callback => callback(sharedData, false))
  } catch (error) {
    console.error('Failed to fetch NIGHT token data:', error)
    sharedLoading = false
    subscribers.forEach(callback => callback(sharedData, false))
  }
}

function initializeFetching() {
  if (hasFetched) return
  hasFetched = true
  
  // Fetch immediately
  fetchTokenData()
  
  // Then fetch every 60 seconds
  fetchInterval = setInterval(fetchTokenData, 60000)
}

function cleanupFetching() {
  if (subscribers.size === 0 && fetchInterval) {
    clearInterval(fetchInterval)
    fetchInterval = null
    hasFetched = false
  }
}

export function useNightToken() {
  const [data, setData] = useState<TokenData | null>(sharedData)
  const [loading, setLoading] = useState(sharedLoading)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const subscriber = (newData: TokenData | null, newLoading: boolean) => {
      setData(newData)
      setLoading(newLoading)
    }

    subscribers.add(subscriber)
    initializeFetching()

    return () => {
      subscribers.delete(subscriber)
      cleanupFetching()
    }
  }, [mounted])

  return { data, loading, mounted }
}

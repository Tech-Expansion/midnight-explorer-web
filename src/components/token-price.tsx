"use client"

import { useEffect, useState, useRef } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import Image from "next/image"

interface TokenPriceData {
  data: {
    NIGHT: {
      quote: {
        USD: {
          price: number
          percent_change_24h: number
        }
      }
    }
  }
}

// Singleton to manage price fetching across all instances
let sharedData: TokenPriceData | null = null
let sharedLoading = true
let fetchInterval: NodeJS.Timeout | null = null
const subscribers: Set<(data: TokenPriceData | null, loading: boolean) => void> = new Set()

async function fetchPrice() {
  try {
    const response = await fetch('/api/token-night')
    const json = await response.json()
    sharedData = json
    sharedLoading = false
    
    // Notify all subscribers
    subscribers.forEach(callback => callback(sharedData, false))
  } catch (error) {
    console.error('Failed to fetch token price:', error)
    sharedLoading = false
    subscribers.forEach(callback => callback(sharedData, false))
  }
}

function initializeFetching() {
  if (fetchInterval) return
  
  // Fetch immediately
  fetchPrice()
  
  // Then fetch every minute
  fetchInterval = setInterval(fetchPrice, 60000)
}

function cleanupFetching() {
  if (subscribers.size === 0 && fetchInterval) {
    clearInterval(fetchInterval)
    fetchInterval = null
  }
}

export function TokenPrice() {
  const [data, setData] = useState<TokenPriceData | null>(sharedData)
  const [loading, setLoading] = useState(sharedLoading)
  const [isFlipping, setIsFlipping] = useState(false)
  const previousDataRef = useRef<TokenPriceData | null>(sharedData)

  useEffect(() => {
    const subscriber = (newData: TokenPriceData | null, newLoading: boolean) => {
      // Always trigger flip animation on update (except first load)
      if (previousDataRef.current && newData) {
        setIsFlipping(true)
        setTimeout(() => {
          setData(newData)
          setLoading(newLoading)
          previousDataRef.current = newData
          setTimeout(() => setIsFlipping(false), 600)
        }, 300)
      } else {
        setData(newData)
        setLoading(newLoading)
        previousDataRef.current = newData
      }
    }

    subscribers.add(subscriber)
    initializeFetching()

    return () => {
      subscribers.delete(subscriber)
      cleanupFetching()
    }
  }, [])

  if (loading || !data || !data.data?.NIGHT) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border animate-pulse">
        <div className="w-6 h-6 bg-muted rounded-full" />
        <div className="w-20 h-4 bg-muted rounded" />
      </div>
    )
  }

  const tokenData = data.data.NIGHT
  const price = tokenData.quote.USD.price
  const percentChange = tokenData.quote.USD.percent_change_24h
  const isPositive = percentChange >= 0

  return (
    <div className="flex items-center gap-2">
      <Image 
        src="/images/token-night.png" 
        alt="NIGHT Token" 
        width={20} 
        height={20}
        className="rounded-full"
      />
      <div className={`flex flex-col gap-0.5 transition-all duration-300 ${
        isFlipping ? 'animate-flip' : ''
      }`}>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold font-mono">NIGHT:</span>
          <span className="text-sm font-semibold font-mono">
            ${price.toFixed(4)}
          </span>
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-medium ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          {isPositive ? (
            <TrendingUp className="h-2.5 w-2.5" />
          ) : (
            <TrendingDown className="h-2.5 w-2.5" />
          )}
          <span>{isPositive ? '+' : ''}{percentChange.toFixed(2)}% (24h)</span>
        </div>
      </div>
    </div>
  )
}

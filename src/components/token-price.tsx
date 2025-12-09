"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import Image from "next/image"

interface TokenPriceData {
  price: number
  percentChange: string
}

export function TokenPrice() {
  const [data, setData] = useState<TokenPriceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPrice() {
      try {
        const response = await fetch('/api/token-night')
        const json = await response.json()
        setData(json)
      } catch (error) {
        console.error('Failed to fetch token price:', error)
      } finally {
        setLoading(false)
      }
    }

    // Only fetch once when component mounts
    fetchPrice()
  }, [])

  if (loading || !data) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border animate-pulse">
        <div className="w-6 h-6 bg-muted rounded-full" />
        <div className="w-20 h-4 bg-muted rounded" />
      </div>
    )
  }

  const percentValue = parseFloat(data.percentChange.replace('%', ''))
  const isPositive = percentValue >= 0

  return (
    <div className="flex items-center gap-2">
      <Image 
        src="/images/token-night.png" 
        alt="NIGHT Token" 
        width={20} 
        height={20}
        className="rounded-full"
      />
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold font-mono">Night:</span>
        <span className="text-sm font-semibold font-mono">${data.price.toFixed(4)}</span>
        <div className={`flex items-center gap-0.5 text-xs font-semibold ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{Math.abs(percentValue).toFixed(2)}%</span>
        </div>
      </div>
    </div>
  )
}

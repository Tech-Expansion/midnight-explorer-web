"use client"

import { useEffect, useState, useRef } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import Image from "next/image"
import { useNightToken } from "@/hooks/useNightToken"

export function TokenPrice() {
  const { data: tokenData, isLoading } = useNightToken()
  const [isFlipping, setIsFlipping] = useState(false)
  const previousDataRef = useRef<typeof tokenData | null>(null)

  useEffect(() => {
    if (previousDataRef.current && tokenData && tokenData !== previousDataRef.current) {
      setIsFlipping(true)
      setTimeout(() => setIsFlipping(false), 600)
    }
    previousDataRef.current = tokenData
  }, [tokenData])

  if (isLoading || !tokenData) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border animate-pulse">
        <div className="w-6 h-6 bg-muted rounded-full" />
        <div className="w-20 h-4 bg-muted rounded" />
      </div>
    )
  }

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

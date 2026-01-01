"use client"

import { Card } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import Image from "next/image"
import { useNightToken } from "@/hooks/useNightToken"

export function MidnightTokenInfo() {
  const { data: tokenData, loading, mounted } = useNightToken()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 2,
    }).format(num)
  }

  const PriceChange = ({ value }: { value: number }) => {
    const isPositive = value > 0
    return (
      <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
        {Math.abs(value).toFixed(2)}%
      </span>
    )
  }

  if (!mounted || loading) {
    return (
      <div className="h-full flex flex-col w-full overflow-hidden">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Midnight Token (NIGHT)</h2>
        <Card className="p-6 bg-card border-border flex-1">
          <div className="animate-pulse h-full flex flex-col justify-between">
            <div>
              <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (!tokenData) {
    return null
  }

  const quote = tokenData.quote.USD

  return (
    <div className="h-full flex flex-col w-full overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Token (NIGHT)</h2>
      
      {/* Single card containing all token info */}
      <Card className="p-6 bg-card border-border flex-1">
        <div className="flex flex-col h-full gap-6">
          {/* Logo & Basic Info */}
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden">
              <Image 
                src="/images/token-night.png" 
                alt="Midnight Token" 
                width={64} 
                height={64} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">{tokenData.name}</h3>
                <span className="text-sm text-muted-foreground">({tokenData.symbol})</span>
              </div>
              <p className="text-sm text-muted-foreground">Rank #{tokenData.cmc_rank}</p>
            </div>
          </div>

          {/* Price Section */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Price</p>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-bold">{formatPrice(quote.price)}</p>
              <PriceChange value={quote.percent_change_24h} />
            </div>
          </div>

          {/* Market Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
              <p className="text-lg font-semibold">${formatNumber(quote.market_cap)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Volume 24h</p>
              <p className="text-lg font-semibold">${formatNumber(quote.volume_24h)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Circulating Supply</p>
              <p className="text-lg font-semibold">{formatNumber(tokenData.circulating_supply)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Max Supply</p>
              <p className="text-lg font-semibold">{formatNumber(tokenData.max_supply)}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t border-border mt-auto">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">Market Cap Dominance</span>
              <span className="font-semibold">{quote.market_cap_dominance.toFixed(4)}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Fully Diluted Market Cap</span>
              <span className="font-semibold">${formatNumber(quote.fully_diluted_market_cap)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

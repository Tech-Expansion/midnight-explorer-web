"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Activity, Blocks, Clock, Zap, Calendar } from "lucide-react"
import { useNetworkStats } from "@/hooks/useNetworkStats"
import { useEffect, useState } from "react"

export function NetworkStats() {
  const { sidechainStatus, latestBlock, loading, error } = useNetworkStats()
  const [timeUntilEpoch, setTimeUntilEpoch] = useState<string>('')

  // Calculate time until next epoch
  useEffect(() => {
    if (!sidechainStatus?.nextEpochTimestamp) return

    const updateTimer = () => {
      const now = Date.now()
      const diff = sidechainStatus.nextEpochTimestamp - now
      
      if (diff <= 0) {
        setTimeUntilEpoch('Transitioning...')
        return
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      if (days > 0) {
        setTimeUntilEpoch(`${days}d ${hours}h ${minutes}m`)
      } else {
        setTimeUntilEpoch(`${hours}h ${minutes}m ${seconds}s`)
      }
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    
    return () => clearInterval(interval)
  }, [sidechainStatus?.nextEpochTimestamp])

  // Format numbers with commas
  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return 'N/A'
    return num.toLocaleString('en-US')
  }

  // Format date
  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate average block time (assuming each slot is ~6 seconds)
  const calculateAvgBlockTime = () => {
    if (!latestBlock || !sidechainStatus) return 'N/A'
    // Midnight has ~6 second block time
    return '6s'
  }

  const stats = [
    {
      label: "Current Epoch",
      value: loading ? '...' : formatNumber(sidechainStatus?.epoch),
      trend: "neutral",
      icon: Calendar,
    },
    {
      label: "Current Slot",
      value: loading ? '...' : formatNumber(sidechainStatus?.slot),
      trend: "neutral",
      icon: Zap,
    },
    {
      label: "Total Blocks",
      value: loading ? '...' : formatNumber(latestBlock?.height),
      change: latestBlock ? `#${latestBlock.height}` : 'Latest block',
      trend: "up",
      icon: Blocks,
    },
    {
      label: "Total Transactions",
      value: loading ? '...' : formatNumber(latestBlock?.transactionCount),
      trend: "neutral",
      icon: Activity,
    },
    {
      label: "Next Epoch In",
      value: loading ? '...' : timeUntilEpoch || 'N/A',
      trend: "neutral",
      icon: Clock,
    },
    {
      label: "Avg Block Time",
      value: loading ? '...' : calculateAvgBlockTime(),
      trend: "neutral",
      icon: TrendingUp,
    },
  ]

  if (error) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-4">Network Overview</h2>
        <Card className="p-8 text-center">
          <p className="text-destructive">{error}</p>
        </Card>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Network Overview</h2>
        <div className="flex items-center gap-2">
          {loading && (
            <span className="text-xs text-muted-foreground">Updating...</span>
          )}
          <span className="text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isPositive = stat.trend === "up"
          const isNeutral = stat.trend === "neutral"

          return (
            <Card key={stat.label} className="p-4 bg-card hover:bg-card/80 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                {/* {!isNeutral && (
                  <span className={`text-xs font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
                    {stat.change}
                  </span>
                )} */}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold font-mono">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                {isNeutral && (
                  <p className="text-xs text-muted-foreground/70">{stat.change}</p>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

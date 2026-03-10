"use client"

import { Card } from "@/components/ui/card"
import { Blocks, Activity, Clock, Zap } from "lucide-react"
import { useNetworkStats } from "@/hooks/useNetworkStats"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function NetworkStats() {
  const { data, isLoading, error } = useNetworkStats()
  const [timeUntilEpoch, setTimeUntilEpoch] = useState<string>('')

  const sidechainStatus = data?.sidechainStatus
  const latestBlock = data?.latestBlock
  const totalTransactions = data?.totalTransactions

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

  const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null) return 'N/A'
    return num.toLocaleString('en-US')
  }

  const calculateAvgBlockTime = () => {
    if (!latestBlock || !sidechainStatus) return 'N/A'
    return '6.00s'
  }

  const stats = [
    {
      label: "Latest Block",
      value: isLoading ? '...' : formatNumber(latestBlock?.height),
      icon: Blocks,
    },
    {
      label: "Total Transactions",
      value: isLoading ? '...' : formatNumber(totalTransactions),
      icon: Activity,
    },
    {
      label: "Avg Block Time",
      value: isLoading ? '...' : calculateAvgBlockTime(),
      icon: Clock,
    },
    {
      label: "Network Status",
      value: error ? "Offline" : "Live",
      isLive: !error && !isLoading,
      icon: Zap,
    },
  ]

  return (
    <Card className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-border/60 bg-card rounded-[4px] shadow-sm mb-6 mt-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="p-4 flex items-center gap-4 hover:bg-muted/10 transition-colors">
            <div className="p-3 bg-muted/30 rounded-[4px] border border-border/50 hidden sm:block">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{stat.label}</p>
              <div className="flex items-center gap-2">
                {stat.label === "Network Status" && stat.isLive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
                <p className={cn("text-base font-mono font-medium", stat.label === "Network Status" && stat.isLive ? 'text-green-600' : 'text-foreground')}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </Card>
  )
}
"use client"

import { Card } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"
import { networkAPI } from "@/lib/api"

interface StatsResponse {
  totalTransactions: number
  recent24h: number
  chartData24h: Array<{
    period: string
    timestamp: number
    count: number
  }>
  avgTransactionSize: number
  successRate: number
  failedCount: number
  latestTxId: string
  latestTimestamp: number
}

// 🔹 Giao diện chính
export function NetworkCharts() {
  const [data, setData] = useState<Array<{ time: string; count: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const stats = await networkAPI.getStats<StatsResponse>()
        
        // Map chartData24h từ API response
        const chartData = stats.chartData24h.map((item) => ({
          time: item.period,
          count: item.count,
        }))

        setData(chartData)
      } catch (error) {
        console.error("Error fetching transaction data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactionData()
    const interval = setInterval(fetchTransactionData, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Transaction Activity</h2>
        <span className="text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live
          </span>
      </div>

      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Transaction Volume</h3>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading..." : "Last 24 hours"}
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#404040"
                opacity={0.5}
              />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #404040",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#60a5fa"
                fillOpacity={1}
                fill="url(#colorTx)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </section>
  )
}

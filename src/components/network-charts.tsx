"use client"

import { Card } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"
import { networkAPI } from "@/lib/api"
import Image from "next/image"

interface ChartDataItem {
  period: string
  timestamp: number
  count: number
}

interface Stats1DayResponse {
  totalTransactions: number
  recent24h: number
  chartData24h: ChartDataItem[]
  chartData24hSuccess: ChartDataItem[]
  chartData24hFailed: ChartDataItem[]
  avgTransactionSize: number
  successRate: number
  failedCount: number
  latestTxId: string
  latestTimestamp: number
}

interface Chart7DayResponse {
  chartData7Days: ChartDataItem[]
  chartData7DaysSuccess: ChartDataItem[]
  chartData7DaysFailed: ChartDataItem[]
}

interface Chart1MonthResponse {
  chartData1Month: ChartDataItem[]
  chartData1MonthSuccess: ChartDataItem[]
  chartData1MonthFailed: ChartDataItem[]
}

type TimeRange = '1D' | '7D' | '1M'
type DataType = 'success' | 'unsigned-extrinsics' | 'transactions'

// 🔹 Giao diện chính
export function NetworkCharts() {
  const [data, setData] = useState<Array<{ time: string; count: number; timestamp: number; fullDate: string }>>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('1D')
  const [dataType, setDataType] = useState<DataType>('transactions')

  // Format timestamp thành ngày giờ dễ đọc
  const formatDate = (timestamp: number, range: TimeRange) => {
    const date = new Date(timestamp * 1000)
    
    if (range === '1D') {
      // 24h format: "14:00" (giờ:phút)
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    } else if (range === '7D') {
      // 7 days format: "Dec 20" (tháng ngày)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    } else {
      // 1 month format: "12/20" (tháng/ngày)
      return date.toLocaleDateString('en-US', { 
        month: 'numeric', 
        day: 'numeric' 
      })
    }
  }

  // Format đầy đủ cho tooltip
  const formatFullDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    })
  }

  useEffect(() => {
    const fetchTransactionData = async () => {
      setLoading(true)
      try {
        let chartData: Array<{ time: string; count: number; timestamp: number; fullDate: string }> = []

        if (timeRange === '1D') {
          const stats = await networkAPI.getStats1Day<Stats1DayResponse>()
          let sourceData: ChartDataItem[]
          
          if (dataType === 'success') {
            sourceData = stats.chartData24hSuccess
          } else if (dataType === 'transactions') {
            sourceData = stats.chartData24h
          } else {
            sourceData = stats.chartData24hFailed
          }
          
          chartData = sourceData.map((item) => ({
            time: formatDate(item.timestamp, '1D'),
            count: item.count,
            timestamp: item.timestamp,
            fullDate: formatFullDate(item.timestamp)
          }))
        } else if (timeRange === '7D') {
          const stats = await networkAPI.getChart7Day<Chart7DayResponse>()
          let sourceData: ChartDataItem[]
          
          if (dataType === 'success') {
            sourceData = stats.chartData7DaysSuccess
          } else if (dataType === 'transactions') {
            sourceData = stats.chartData7Days
          } else {
            sourceData = stats.chartData7DaysFailed
          }
          
          chartData = sourceData.map((item) => ({
            time: formatDate(item.timestamp, '7D'),
            count: item.count,
            timestamp: item.timestamp,
            fullDate: formatFullDate(item.timestamp)
          }))
        } else if (timeRange === '1M') {
          const stats = await networkAPI.getChart1Month<Chart1MonthResponse>()
          let sourceData: ChartDataItem[]
          
          if (dataType === 'success') {
            sourceData = stats.chartData1MonthSuccess
          } else if (dataType === 'transactions') {
            sourceData = stats.chartData1Month
          } else {
            sourceData = stats.chartData1MonthFailed
          }
          
          chartData = sourceData.map((item) => ({
            time: formatDate(item.timestamp, '1M'),
            count: item.count,
            timestamp: item.timestamp,
            fullDate: formatFullDate(item.timestamp)
          }))
        }

        setData(chartData)
      } catch (error) {
        console.error("Error fetching transaction data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactionData()
  }, [timeRange, dataType])

  const getChartTitle = () => {
    const timeLabel = timeRange === '1D' ? '24 hours' : timeRange === '7D' ? '7 days' : '30 days'
    return `Last ${timeLabel}`
  }

  const getChartColor = () => {
    if (dataType === 'success') return '#10b981' // green for success
    if (dataType === 'transactions') return '#3b82f6' // blue for transactions
    return '#ef4444' // red for unsigned extrinsics (failed)
  }

  // Custom tooltip để hiện thông tin chi tiết
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { fullDate: string } }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1f1f1f] border border-[#404040] rounded-lg p-3">
          <p className="text-sm font-medium text-white mb-1">{payload[0].payload.fullDate}</p>
          <p className="text-sm text-muted-foreground">
            Count: <span className="font-semibold text-white">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      )
    }
    return null
  }

  // Quyết định có nên hiển thị tất cả labels hay không
  const getXAxisInterval = () => {
    if (timeRange === '1M') {
      return 2 // Hiển thị mỗi 3 ngày cho 30 ngày
    } else if (timeRange === '7D') {
      return 0 // Hiển thị tất cả cho 7 ngày
    }
    return 1 // Hiển thị mỗi 2 giờ cho 24h
  }

  return (
    <div className="h-full flex flex-col">
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

      <Card className="p-6 bg-card border-border flex-1">
        <div className="space-y-4">
          {/* Header with title and controls */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Chain Status</h3>
              <p className="text-sm text-muted-foreground">
                {loading ? "Loading..." : getChartTitle()}
              </p>
            </div>
            
            {/* Toggle Controls */}
            <div className="flex gap-3">
              {/* Data Type Toggle */}
              <div className="flex gap-1 bg-muted p-1 rounded-lg">
                <button
                  onClick={() => setDataType('transactions')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    dataType === 'transactions'
                      ? 'bg-blue-600 text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  suppressHydrationWarning
                >
                  Transactions
                </button>
                <button
                  onClick={() => setDataType('success')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    dataType === 'success'
                      ? 'bg-green-600 text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  suppressHydrationWarning
                >
                  Success
                </button>
                <button
                  onClick={() => setDataType('unsigned-extrinsics')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                    dataType === 'unsigned-extrinsics'
                      ? 'bg-red-600 text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  suppressHydrationWarning
                >
                  Unsigned Extrinsics
                </button>
              </div>

              {/* Time Range Toggle */}
              <div className="flex gap-1 bg-muted p-1 rounded-lg">
                <button
                  onClick={() => setTimeRange('1D')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    timeRange === '1D'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  suppressHydrationWarning
                >
                  1D
                </button>
                <button
                  onClick={() => setTimeRange('7D')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    timeRange === '7D'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  suppressHydrationWarning
                >
                  7D
                </button>
                <button
                  onClick={() => setTimeRange('1M')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    timeRange === '1M'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  suppressHydrationWarning
                >
                  1M
                </button>
              </div>
            </div>
          </div>

          <div className="relative w-full">
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-end pr-40 top-[-28px] pointer-events-none z-0 opacity-10">
              <Image
                src="/images/midnightexplorer-logo.png"
                alt="Midnight Explorer"
                width={200}
                height={200}
                className="w-170 h-170 object-contain"
              />
            </div>
            
            {/* Chart */}
            <div className="relative z-10">
              <ResponsiveContainer width="100%" height={timeRange === '1M' ? 360 : 300}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getChartColor()} stopOpacity={0.6} />
                      <stop offset="95%" stopColor={getChartColor()} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#404040"
                    opacity={0.5}
                  />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9ca3af" 
                    fontSize={11}
                    interval={getXAxisInterval()}
                    angle={timeRange === '1M' ? -45 : 0}
                    textAnchor={timeRange === '1M' ? 'end' : 'middle'}
                    height={30}
                  />
                  <YAxis stroke="#9ca3af" fontSize={12} width={50} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={getChartColor()}
                    fillOpacity={1}
                    fill="url(#colorTx)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

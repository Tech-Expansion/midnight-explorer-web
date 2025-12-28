"use client"

import { Card } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"
import { networkAPI } from "@/lib/api"
import Image from "next/image"
import {
  TIME_RANGE_1D,
  TIME_RANGE_7D,
  TIME_RANGE_1M,
  DATA_TYPE_SUCCESS,
  DATA_TYPE_UNSIGNED_EXTRINSICS,
  DATA_TYPE_TRANSACTIONS,
  COLOR_SUCCESS,
  COLOR_TRANSACTIONS,
  COLOR_FAILED,
  TIME_LABELS,
  X_AXIS_INTERVALS,
  CHART_HEIGHTS,
  type TimeRange,
  type DataType,
} from "@/lib/constants/network.constants"

export interface ChartDataPoint {
  period: string
  timestamp: number
  count: number
}

export interface NetworkStatsResponse {
  chartData: ChartDataPoint[]
  chartDataSuccess: ChartDataPoint[]
  chartDataFailed: ChartDataPoint[]
}

// 🔹 Giao diện chính
export function NetworkCharts() {
  const [data, setData] = useState<Array<{ time: string; count: number; timestamp: number; fullDate: string }>>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>(TIME_RANGE_1D)
  const [dataType, setDataType] = useState<DataType>(DATA_TYPE_TRANSACTIONS)

  // Format timestamp thành ngày giờ dễ đọc
  const formatDate = (timestamp: number, range: TimeRange) => {
    const date = new Date(timestamp * 1000)
    
    if (range === TIME_RANGE_1D) {
      // 24h format: "14:00" (giờ:phút)
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    } else if (range === TIME_RANGE_7D) {
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
        // API call now returns consistent structure regardless of timeRange
        const stats = await networkAPI.getChart<NetworkStatsResponse>(timeRange as '1D' | '7D' | '1M')
        
        let sourceData: ChartDataPoint[] = []
        
        // Determine which data field to use based on dataType
        if (dataType === DATA_TYPE_SUCCESS) {
          sourceData = stats.chartDataSuccess || []
        } else if (dataType === DATA_TYPE_UNSIGNED_EXTRINSICS) {
          sourceData = stats.chartDataFailed || []
        } else {
          sourceData = stats.chartData || []
        }
        
        const chartData = sourceData.map((item) => ({
          time: formatDate(item.timestamp, timeRange),
          count: item.count,
          timestamp: item.timestamp,
          fullDate: formatFullDate(item.timestamp)
        }))
        
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
    const timeLabel = TIME_LABELS[timeRange]
    return `Last ${timeLabel}`
  }

  const getChartColor = () => {
    if (dataType === DATA_TYPE_SUCCESS) return COLOR_SUCCESS
    if (dataType === DATA_TYPE_TRANSACTIONS) return COLOR_TRANSACTIONS
    return COLOR_FAILED
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
    return X_AXIS_INTERVALS[timeRange]
  }

  return (
    <div className="h-full flex flex-col w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Transaction Activity</h2>
        <span className="text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1 w-fit">
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
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Chain Status</h3>
              <p className="text-sm text-muted-foreground">
                {loading ? "Loading..." : getChartTitle()}
              </p>
            </div>
            
            {/* Toggle Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Data Type Toggle */}
              <div className="flex flex-wrap gap-1 bg-muted p-1 rounded-lg">
                <button
                  onClick={() => setDataType(DATA_TYPE_TRANSACTIONS)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    dataType === DATA_TYPE_TRANSACTIONS
                      ? 'bg-blue-500 text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  suppressHydrationWarning
                >
                  Transactions
                </button>
                <button
                  onClick={() => setDataType(DATA_TYPE_SUCCESS)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    dataType === DATA_TYPE_SUCCESS
                      ? 'bg-green-600 text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  suppressHydrationWarning
                >
                  Success
                </button>
                <button
                  onClick={() => setDataType(DATA_TYPE_UNSIGNED_EXTRINSICS)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                    dataType === DATA_TYPE_UNSIGNED_EXTRINSICS
                      ? 'bg-red-500 text-white'
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
                  onClick={() => setTimeRange(TIME_RANGE_1D)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    timeRange === TIME_RANGE_1D
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  suppressHydrationWarning
                >
                  1D
                </button>
                <button
                  onClick={() => setTimeRange(TIME_RANGE_7D)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    timeRange === TIME_RANGE_7D
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  suppressHydrationWarning
                >
                  7D
                </button>
                <button
                  onClick={() => setTimeRange(TIME_RANGE_1M)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    timeRange === TIME_RANGE_1M
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
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
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
              <ResponsiveContainer width="100%" height={CHART_HEIGHTS[timeRange]}>
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
                    angle={timeRange === TIME_RANGE_1M ? -45 : 0}
                    textAnchor={timeRange === TIME_RANGE_1M ? 'end' : 'middle'}
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

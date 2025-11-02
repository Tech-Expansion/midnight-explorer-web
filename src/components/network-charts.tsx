"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const transactionData = [
  { time: "00:00", count: 2400 },
  { time: "04:00", count: 1398 },
  { time: "08:00", count: 3800 },
  { time: "12:00", count: 3908 },
  { time: "16:00", count: 4800 },
  { time: "20:00", count: 3800 },
  { time: "24:00", count: 4300 },
]

const blockData = [
  { time: "00:00", blocks: 120 },
  { time: "04:00", blocks: 98 },
  { time: "08:00", blocks: 145 },
  { time: "12:00", blocks: 132 },
  { time: "16:00", blocks: 156 },
  { time: "20:00", blocks: 142 },
  { time: "24:00", blocks: 138 },
]

const addressData = [
  { time: "00:00", active: 12400 },
  { time: "04:00", active: 11398 },
  { time: "08:00", active: 13800 },
  { time: "12:00", active: 15908 },
  { time: "16:00", active: 14800 },
  { time: "20:00", active: 13800 },
  { time: "24:00", active: 14300 },
]

export function NetworkCharts() {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Network Activity</h2>
        <span className="text-sm font-medium text-blue-500 bg-blue-100 px-3 py-1 rounded-full">
          Upcoming
        </span>
      </div>
      <Card className="p-6 bg-card border-border">
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="blocks">Blocks</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Transaction Volume</h3>
              <p className="text-sm text-muted-foreground">Last 24 hours</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={transactionData}>
                <defs>
                  <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" opacity={0.5} />
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
          </TabsContent>

          <TabsContent value="blocks" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Block Production</h3>
              <p className="text-sm text-muted-foreground">Last 24 hours</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={blockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" opacity={0.5} />
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
                <Line
                  type="monotone"
                  dataKey="blocks"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ fill: "#22d3ee", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Active Addresses</h3>
              <p className="text-sm text-muted-foreground">Last 24 hours</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={addressData}>
                <defs>
                  <linearGradient id="colorAddr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" opacity={0.5} />
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
                  dataKey="active"
                  stroke="#a78bfa"
                  fillOpacity={1}
                  fill="url(#colorAddr)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </Card>
    </section>
  )
}
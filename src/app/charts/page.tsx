"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Activity, Zap, Users, DollarSign, Database } from "lucide-react"

// Define type cho dữ liệu PieChart để fix lỗi type của percent
interface NetworkDistribution {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export default function ChartsPage() {
  // Mock data for various charts
  const transactionData = [
    { date: "Jan 1", transactions: 45000, volume: 2500000 },
    { date: "Jan 2", transactions: 52000, volume: 2800000 },
    { date: "Jan 3", transactions: 48000, volume: 2600000 },
    { date: "Jan 4", transactions: 61000, volume: 3200000 },
    { date: "Jan 5", transactions: 55000, volume: 2900000 },
    { date: "Jan 6", transactions: 67000, volume: 3500000 },
    { date: "Jan 7", transactions: 58000, volume: 3100000 },
  ]

  const gasPriceData = [
    { time: "00:00", price: 25, avgWait: 12 },
    { time: "04:00", price: 18, avgWait: 8 },
    { time: "08:00", price: 35, avgWait: 18 },
    { time: "12:00", price: 42, avgWait: 22 },
    { time: "16:00", price: 38, avgWait: 20 },
    { time: "20:00", price: 28, avgWait: 14 },
    { time: "23:59", price: 22, avgWait: 10 },
  ]

  const blockSizeData = [
    { block: "1.23M", size: 45, txCount: 156 },
    { block: "1.24M", size: 52, txCount: 203 },
    { block: "1.25M", size: 48, txCount: 178 },
    { block: "1.26M", size: 61, txCount: 245 },
    { block: "1.27M", size: 55, txCount: 198 },
    { block: "1.28M", size: 67, txCount: 267 },
    { block: "1.29M", size: 58, txCount: 221 },
  ]

  const networkDistribution: NetworkDistribution[] = [
    { name: "Validators", value: 150, color: "#60a5fa" },
    { name: "Full Nodes", value: 450, color: "#22d3ee" },
    { name: "Light Clients", value: 1200, color: "#a78bfa" },
    { name: "Archive Nodes", value: 80, color: "#f59e0b" },
  ]

  const addressGrowth = [
    { month: "Jul", total: 1800000, active: 120000 },
    { month: "Aug", total: 1950000, active: 135000 },
    { month: "Sep", total: 2100000, active: 148000 },
    { month: "Oct", total: 2250000, active: 156000 },
    { month: "Nov", total: 2380000, active: 162000 },
    { month: "Dec", total: 2456789, active: 156789 },
  ]

  const validatorPerformance = [
    { validator: "Alpha", blocks: 1234, uptime: 99.9 },
    { validator: "Beta", blocks: 1189, uptime: 99.7 },
    { validator: "Gamma", blocks: 1156, uptime: 99.5 },
    { validator: "Delta", blocks: 1098, uptime: 99.2 },
    { validator: "Epsilon", blocks: 1045, uptime: 98.9 },
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Network Charts
            </h1>
            <p className="text-muted-foreground text-lg">Visualize network metrics and trends on Midnight Cardano</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Activity className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Avg TPS</div>
                    <div className="text-lg font-bold text-blue-400">1,247</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <Zap className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Avg Gas</div>
                    <div className="text-lg font-bold text-cyan-400">32 Gwei</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Users className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Active Users</div>
                    <div className="text-lg font-bold text-purple-400">156K</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">24h Volume</div>
                    <div className="text-lg font-bold text-green-400">$45M</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Database className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Avg Block</div>
                    <div className="text-lg font-bold text-amber-400">52 KB</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <TrendingUp className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Network Load</div>
                    <div className="text-lg font-bold text-red-400">67%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Charts */}
          <Tabs defaultValue="transactions" className="space-y-4">
            <TabsList className="bg-card/50 border-border">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="gas">Gas Prices</TabsTrigger>
              <TabsTrigger value="blocks">Blocks</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="validators">Validators</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Daily Transactions</CardTitle>
                    <CardDescription>Number of transactions per day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={transactionData}>
                        <defs>
                          <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="date" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                          labelStyle={{ color: "#fff" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="transactions"
                          stroke="#60a5fa"
                          fill="url(#colorTx)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-green-400">Transaction Volume</CardTitle>
                    <CardDescription>Total value transferred per day (MIDNIGHT)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={transactionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="date" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                          labelStyle={{ color: "#fff" }}
                        />
                        <Bar dataKey="volume" fill="#22c55e" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="gas" className="space-y-4">
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Gas Price Trends</CardTitle>
                  <CardDescription>Average gas price and wait time over 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={gasPriceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="time" stroke="#888" />
                      <YAxis yAxisId="left" stroke="#888" />
                      <YAxis yAxisId="right" orientation="right" stroke="#888" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="price"
                        stroke="#22d3ee"
                        strokeWidth={3}
                        name="Gas Price (Gwei)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgWait"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        name="Avg Wait (sec)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blocks" className="space-y-4">
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="text-purple-400">Block Size & Transaction Count</CardTitle>
                  <CardDescription>Recent block sizes and transaction counts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={blockSizeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="block" stroke="#888" />
                      <YAxis yAxisId="left" stroke="#888" />
                      <YAxis yAxisId="right" orientation="right" stroke="#888" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="size" fill="#a78bfa" radius={[8, 8, 0, 0]} name="Size (KB)" />
                      <Bar yAxisId="right" dataKey="txCount" fill="#22d3ee" radius={[8, 8, 0, 0]} name="Transactions" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="network" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Node Distribution</CardTitle>
                    <CardDescription>Distribution of node types on the network</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={networkDistribution}
                          cx="50%"
                          cy="50%"
                          label={(props) => {
                            const { name, value } = props;
                            const total = networkDistribution.reduce((sum, entry) => sum + entry.value, 0);
                            return `${name} (${((value as number) / total * 100).toFixed(0)}%)`;
                          }}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {networkDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                          labelStyle={{ color: "#fff" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-purple-400">Network Statistics</CardTitle>
                    <CardDescription>Key network metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">Total Nodes</span>
                        <span className="text-xl font-bold text-blue-400">1,880</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">Network Uptime</span>
                        <span className="text-xl font-bold text-green-400">99.97%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">Avg Block Time</span>
                        <span className="text-xl font-bold text-cyan-400">12.3s</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">Network Hashrate</span>
                        <span className="text-xl font-bold text-purple-400">2.5 TH/s</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="addresses" className="space-y-4">
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="text-green-400">Address Growth</CardTitle>
                  <CardDescription>Total and active addresses over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={addressGrowth}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="month" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#22d3ee"
                        fill="url(#colorTotal)"
                        strokeWidth={2}
                        name="Total Addresses"
                      />
                      <Area
                        type="monotone"
                        dataKey="active"
                        stroke="#22c55e"
                        fill="url(#colorActive)"
                        strokeWidth={2}
                        name="Active Addresses"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="validators" className="space-y-4">
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="text-amber-400">Validator Performance</CardTitle>
                  <CardDescription>Top validators by blocks produced and uptime</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={validatorPerformance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis type="number" stroke="#888" />
                      <YAxis dataKey="validator" type="category" stroke="#888" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Bar dataKey="blocks" fill="#f59e0b" radius={[0, 8, 8, 0]} name="Blocks Produced" />
                      <Bar dataKey="uptime" fill="#22c55e" radius={[0, 8, 8, 0]} name="Uptime %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
    </div>
  )
}
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Users,
  DollarSign,
  Database,
  Clock,
  Shield,
  Cpu,
  HardDrive,
  Network,
} from "lucide-react"

export default function StatisticsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Network Statistics
        </h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive statistics and metrics for the Midnight Cardano network
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-cyan-500/10">
                <Activity className="h-6 w-6 text-cyan-400" />
              </div>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-3xl font-bold text-cyan-400">45,678,901</p>
              <p className="text-xs text-muted-foreground">+5,234 in last 24h</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Database className="h-6 w-6 text-purple-400" />
              </div>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Blocks</p>
              <p className="text-3xl font-bold text-purple-400">1,234,567</p>
              <p className="text-xs text-muted-foreground">+7,200 in last 24h</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-cyan-500/10">
                <Users className="h-6 w-6 text-cyan-400" />
              </div>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3.7%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Addresses</p>
              <p className="text-3xl font-bold text-cyan-400">2,456,789</p>
              <p className="text-xs text-muted-foreground">+1,234 in last 24h</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.1%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Market Cap</p>
              <p className="text-3xl font-bold text-green-400">$1.2B</p>
              <p className="text-xs text-muted-foreground">24h volume: $45M</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Performance */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-cyan-400">Network Performance</CardTitle>
          <CardDescription>Real-time network performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm text-muted-foreground">Transactions Per Second</span>
                </div>
                <span className="text-xl font-bold text-cyan-400">1,247</span>
              </div>
              <Progress value={62} className="h-2" />
              <p className="text-xs text-muted-foreground">62% of max capacity (2,000 TPS)</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <span className="text-sm text-muted-foreground">Avg Block Time</span>
                </div>
                <span className="text-xl font-bold text-purple-400">12.3s</span>
              </div>
              <Progress value={82} className="h-2" />
              <p className="text-xs text-muted-foreground">Target: 15s (18% faster)</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">Network Uptime</span>
                </div>
                <span className="text-xl font-bold text-green-400">99.97%</span>
              </div>
              <Progress value={99.97} className="h-2" />
              <p className="text-xs text-muted-foreground">Last downtime: 45 days ago</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-amber-400" />
                  <span className="text-sm text-muted-foreground">Avg Gas Price</span>
                </div>
                <span className="text-xl font-bold text-amber-400">32 Gwei</span>
              </div>
              <Progress value={45} className="h-2" />
              <p className="text-xs text-muted-foreground">45% below peak (58 Gwei)</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm text-muted-foreground">Avg Block Size</span>
                </div>
                <span className="text-xl font-bold text-cyan-400">52 KB</span>
              </div>
              <Progress value={52} className="h-2" />
              <p className="text-xs text-muted-foreground">52% of max size (100 KB)</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-purple-400" />
                  <span className="text-sm text-muted-foreground">Network Load</span>
                </div>
                <span className="text-xl font-bold text-purple-400">67%</span>
              </div>
              <Progress value={67} className="h-2" />
              <p className="text-xs text-muted-foreground">Moderate load, optimal performance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Statistics */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-cyan-400">Transaction Statistics</CardTitle>
            <CardDescription>Detailed transaction metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Total Transactions</span>
                <span className="text-lg font-bold text-cyan-400 font-mono">45,678,901</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">24h Transactions</span>
                <span className="text-lg font-bold text-green-400 font-mono">5,234</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Avg Tx Per Block</span>
                <span className="text-lg font-bold text-purple-400 font-mono">187</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="text-lg font-bold text-green-400 font-mono">98.7%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Avg Tx Fee</span>
                <span className="text-lg font-bold text-amber-400 font-mono">0.0021 MIDNIGHT</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Total Fees (24h)</span>
                <span className="text-lg font-bold text-amber-400 font-mono">10.99 MIDNIGHT</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Block Statistics */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-purple-400">Block Statistics</CardTitle>
            <CardDescription>Detailed block metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Total Blocks</span>
                <span className="text-lg font-bold text-purple-400 font-mono">1,234,567</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">24h Blocks</span>
                <span className="text-lg font-bold text-green-400 font-mono">7,200</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Avg Block Time</span>
                <span className="text-lg font-bold text-cyan-400 font-mono">12.3s</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Avg Block Size</span>
                <span className="text-lg font-bold text-purple-400 font-mono">52 KB</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Block Reward</span>
                <span className="text-lg font-bold text-green-400 font-mono">2.5 MIDNIGHT</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Total Rewards (24h)</span>
                <span className="text-lg font-bold text-green-400 font-mono">18,000 MIDNIGHT</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Statistics */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-cyan-400">Address Statistics</CardTitle>
            <CardDescription>Address and wallet metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Total Addresses</span>
                <span className="text-lg font-bold text-cyan-400 font-mono">2,456,789</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Active Addresses (24h)</span>
                <span className="text-lg font-bold text-purple-400 font-mono">156,789</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">New Addresses (24h)</span>
                <span className="text-lg font-bold text-cyan-400 font-mono">1,234</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Contract Addresses</span>
                <span className="text-lg font-bold text-amber-400 font-mono">45,678</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Avg Balance</span>
                <span className="text-lg font-bold text-green-400 font-mono">1,234 MIDNIGHT</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Median Balance</span>
                <span className="text-lg font-bold text-green-400 font-mono">45.7 MIDNIGHT</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validator Statistics */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-purple-400">Validator Statistics</CardTitle>
            <CardDescription>Validator and staking metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Total Validators</span>
                <span className="text-lg font-bold text-purple-400 font-mono">150</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Active Validators</span>
                <span className="text-lg font-bold text-purple-400 font-mono">148</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Total Staked</span>
                <span className="text-lg font-bold text-cyan-400 font-mono">25.5M MIDNIGHT</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Staking Ratio</span>
                <span className="text-lg font-bold text-cyan-400 font-mono">51%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Avg Validator Stake</span>
                <span className="text-lg font-bold text-amber-400 font-mono">170K MIDNIGHT</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <span className="text-muted-foreground">Avg APY</span>
                <span className="text-lg font-bold text-purple-400 font-mono">8.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

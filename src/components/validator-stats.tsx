"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Shield, TrendingUp, Users } from "lucide-react"

const validators = [
  { name: "Midnight Pool Alpha", stake: "45.2M DUST", commission: "2%", blocks: 1234, status: "active" },
  { name: "Cardano Midnight Stake", stake: "38.7M DUST", commission: "3%", blocks: 1089, status: "active" },
  { name: "Night Validator", stake: "32.1M DUST", commission: "2.5%", blocks: 987, status: "active" },
  { name: "Dark Matter Pool", stake: "28.9M DUST", commission: "3%", blocks: 876, status: "active" },
  { name: "Midnight Staking Co", stake: "25.4M DUST", commission: "2%", blocks: 765, status: "active" },
]

export function ValidatorStats() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Top Validators</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-500 bg-blue-100 px-3 py-1 rounded-full">
            Upcoming
          </span>
          
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Validators</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <Users className="w-5 h-5 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Validators</p>
              <p className="text-2xl font-bold">1,189</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-3/10">
              <TrendingUp className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Staked</p>
              <p className="text-2xl font-bold">2.4B</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-4/10">
              <Activity className="w-5 h-5 text-chart-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Commission</p>
              <p className="text-2xl font-bold">2.5%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Rank</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Validator</th>
                <th className="text-left p-4 text-sm font-semibold text-cyan-400">Total Stake</th>
                <th className="text-left p-4 text-sm font-semibold text-amber-400">Commission</th>
                <th className="text-left p-4 text-sm font-semibold text-purple-400">Blocks</th>
                <th className="text-left p-4 text-sm font-semibold text-green-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {validators.map((validator, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors group">
                  <td className="p-4">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600">
                      <span className="font-mono text-sm font-bold text-slate-300">#{index + 1}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {validator.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm font-semibold text-cyan-400">{validator.stake}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-amber-400">{validator.commission}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-purple-400">
                        {validator.blocks.toLocaleString()}
                      </span>
                      <TrendingUp className="w-3 h-3 text-purple-400 opacity-60" />
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-400 border-green-500/30 font-semibold relative"
                    >
                      <span className="absolute inset-0 rounded-full bg-green-400/20 animate-pulse"></span>
                      <Activity className="w-3 h-3 mr-1 relative z-10" />
                      <span className="relative z-10">{validator.status}</span>
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  )
}

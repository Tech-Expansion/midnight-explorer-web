"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Zap, Database, Globe } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const nodeDistribution = [
  { name: "North America", value: 342, color: "hsl(var(--chart-1))" },
  { name: "Europe", value: 289, color: "hsl(var(--chart-2))" },
  { name: "Asia", value: 234, color: "hsl(var(--chart-3))" },
  { name: "South America", value: 156, color: "hsl(var(--chart-4))" },
  { name: "Others", value: 89, color: "hsl(var(--chart-5))" },
]

export function NetworkHealth() {
  
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Network Health</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-500 bg-blue-100 px-3 py-1 rounded-full">
            Upcoming
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold mb-4">Network Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Network Speed</p>
                  <p className="font-semibold">2.3s avg block time</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                Optimal
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-2/10">
                  <Database className="w-4 h-4 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Storage Usage</p>
                  <p className="font-semibold">234.5 GB</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                Normal
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-4/10">
                  <Globe className="w-4 h-4 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Network Nodes</p>
                  <p className="font-semibold">1,110 active</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                Strong
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-5/10">
                  <Activity className="w-4 h-4 text-chart-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Network Uptime</p>
                  <p className="font-semibold">99.98%</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                Excellent
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold mb-4">Node Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={nodeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent as number * 100).toFixed(0)}%`}
              >
                {nodeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </section>
  )
}
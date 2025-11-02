"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, TrendingUp, TrendingDown } from "lucide-react"

const tokens = [
  {
    name: "DUST",
    symbol: "DUST",
    price: "N/A",
    change: "N/A",
    volume: "N/A",
    marketCap: "N/A",
    trend: "neutral",
  },
  {
    name: "Midnight Token",
    symbol: "MNGHT",
    price: "N/A",
    change: "N/A",
    volume: "N/A",
    marketCap: "N/A",
    trend: "neutral",
  },
  {
    name: "Dark Coin",
    symbol: "DARK",
    price: "N/A",
    change: "N/A",
    volume: "N/A",
    marketCap: "N/A",
    trend: "neutral",
  },
  {
    name: "Shadow Token",
    symbol: "SHDW",
    price: "N/A",
    change: "N/A",
    volume: "N/A",
    marketCap: "N/A",
    trend: "neutral",
  },
  {
    name: "Night Coin",
    symbol: "NGHT",
    price: "N/A",
    change: "N/A",
    volume: "N/A",
    marketCap: "N/A",
    trend: "neutral",
  },
]

export function TokenStats() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Token Statistics</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-500 bg-blue-100 px-3 py-1 rounded-full">
            Upcoming
          </span>

        </div>
      </div>

      <Card className="bg-card border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Rank</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Token</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Price</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">24h Change</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Volume (24h)</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-sm">#{index + 1}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Coins className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{token.name}</p>
                        <p className="text-xs text-muted-foreground">{token.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm">{token.price}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {token.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-chart-3" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      )}
                      <span
                        className={`text-sm font-medium ${token.trend === "up" ? "text-chart-3" : "text-destructive"}`}
                      >
                        {token.change}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm">{token.volume}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm">{token.marketCap}</span>
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
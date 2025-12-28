"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight, Wallet, TrendingUp, TrendingDown, Activity } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"

export default function AddressesPage() {
  // Mock data for top addresses
  const addresses = [
    {
      rank: 1,
      address: "0x742d35cc6634c0532925a3b844bc9e7fe3d2a8f9",
      balance: "1,250,000 MIDNIGHT",
      percentage: "2.5%",
      txCount: 15234,
      lastSeen: "2 minutes ago",
      type: "Contract",
      change24h: "+5.2%",
      trend: "up",
    },
    {
      rank: 2,
      address: "0x631c24a3c6634c0532925a3b844bc9e7fe3d2a8f",
      balance: "980,500 MIDNIGHT",
      percentage: "1.96%",
      txCount: 12456,
      lastSeen: "5 minutes ago",
      type: "Wallet",
      change24h: "+2.8%",
      trend: "up",
    },
    {
      rank: 3,
      address: "0x520b13f2c6634c0532925a3b844bc9e7fe3d2a8f",
      balance: "875,250 MIDNIGHT",
      percentage: "1.75%",
      txCount: 9876,
      lastSeen: "8 minutes ago",
      type: "Contract",
      change24h: "-1.3%",
      trend: "down",
    },
    {
      rank: 4,
      address: "0x419a02e1c6634c0532925a3b844bc9e7fe3d2a8f",
      balance: "750,000 MIDNIGHT",
      percentage: "1.5%",
      txCount: 8234,
      lastSeen: "12 minutes ago",
      type: "Wallet",
      change24h: "+3.5%",
      trend: "up",
    },
    {
      rank: 5,
      address: "0x308f91d0c6634c0532925a3b844bc9e7fe3d2a8f",
      balance: "625,750 MIDNIGHT",
      percentage: "1.25%",
      txCount: 7123,
      lastSeen: "15 minutes ago",
      type: "Contract",
      change24h: "+1.9%",
      trend: "up",
    },
    {
      rank: 6,
      address: "0x217e80cfc6634c0532925a3b844bc9e7fe3d2a8f",
      balance: "550,000 MIDNIGHT",
      percentage: "1.1%",
      txCount: 6543,
      lastSeen: "18 minutes ago",
      type: "Wallet",
      change24h: "-0.5%",
      trend: "down",
    },
    {
      rank: 7,
      address: "0x106d7fbec6634c0532925a3b844bc9e7fe3d2a8f",
      balance: "475,250 MIDNIGHT",
      percentage: "0.95%",
      txCount: 5876,
      lastSeen: "22 minutes ago",
      type: "Contract",
      change24h: "+4.2%",
      trend: "up",
    },
    {
      rank: 8,
      address: "0x095c6eadc6634c0532925a3b844bc9e7fe3d2a8f",
      balance: "425,000 MIDNIGHT",
      percentage: "0.85%",
      txCount: 5234,
      lastSeen: "25 minutes ago",
      type: "Wallet",
      change24h: "+2.1%",
      trend: "up",
    },
  ]

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 z-0">
        <Starfield />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Top Addresses
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore the richest addresses on the Midnight Cardano network
            </p>
          </div>

          {/* Search */}
          <Card className="bg-card/50 border-border p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by address..." className="pl-10 bg-background/50 border-border" />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Search
              </Button>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card/50 border-border p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Addresses</span>
                  <Wallet className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-blue-400">2,456,789</div>
                <div className="text-xs text-green-400">+1,234 today</div>
              </div>
            </Card>
            <Card className="bg-card/50 border-border p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Addresses</span>
                  <Activity className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-cyan-400">156,789</div>
                <div className="text-xs text-green-400">+567 today</div>
              </div>
            </Card>
            <Card className="bg-card/50 border-border p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Contract Addresses</span>
                  <Wallet className="h-4 w-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-purple-400">45,678</div>
                <div className="text-xs text-green-400">+89 today</div>
              </div>
            </Card>
            <Card className="bg-card/50 border-border p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Balance</span>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-green-400">1,234</div>
                <div className="text-xs text-muted-foreground">MIDNIGHT</div>
              </div>
            </Card>
          </div>

          {/* Addresses Table */}
          <Card className="bg-card/50 border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Rank</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Address</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Balance</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Percentage</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">24h Change</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Txn Count</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Type</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {addresses.map((addr) => (
                    <tr key={addr.address} className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-sm">
                          {addr.rank}
                        </div>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/address/${addr.address}`}
                          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-sm"
                        >
                          <Wallet className="h-4 w-4" />
                          {addr.address.slice(0, 10)}...{addr.address.slice(-8)}
                        </Link>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-mono text-green-400">{addr.balance}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {addr.percentage}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div
                          className={`flex items-center gap-1 text-sm font-mono ${addr.trend === "up" ? "text-green-400" : "text-red-400"}`}
                        >
                          {addr.trend === "up" ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {addr.change24h}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-purple-400 font-mono">{addr.txCount.toLocaleString()}</div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={
                            addr.type === "Contract"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                          }
                        >
                          {addr.type}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">{addr.lastSeen}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <div className="text-sm text-muted-foreground">Showing top 100 addresses by balance</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-border bg-transparent">
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="border-border bg-transparent">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </main>

        <Footer />
      </div>
    </div>
  )
}

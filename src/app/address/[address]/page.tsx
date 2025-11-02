import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import Link from "next/link"

export default async function AddressPage({ params }: { params: Promise<{ address: string }> }) {
  // Await params để resolve giá trị
  const resolvedParams = await params;
  const addressParam = resolvedParams.address; // Sử dụng giá trị đã resolve

  // Mock address data (thay params.address bằng addressParam)
  const address = {
    address: addressParam,
    balance: "1,234.5678 MIDNIGHT",
    balanceUSD: "$558.23",
    transactions: 1456,
    firstSeen: "2023-06-15",
    lastSeen: "2024-01-15",
  }

  const transactions = Array.from({ length: 15 }, (_, i) => ({
    hash: `0x${i}a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f`,
    type: i % 3 === 0 ? "in" : "out",
    from: i % 3 === 0 ? "0x8ba1f109551bD432803012645Ac136ddd64DBA72" : addressParam,
    to: i % 3 === 0 ? addressParam : "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    value: `${(Math.random() * 100).toFixed(4)} MIDNIGHT`,
    timestamp: `${i + 1} ${i === 0 ? "min" : "mins"} ago`,
    block: 2453678 - i,
  }))

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Address Details</h1>
            </div>
            <p className="text-muted-foreground">View balance, transactions, and activity for this address</p>
          </div>

          {/* Address Card */}
          <Card className="p-6 bg-card">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-2">Address</p>
                  <p className="text-lg font-mono break-all">{address.address}</p>
                </div>
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Balance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-card">
              <p className="text-sm text-muted-foreground mb-2">Balance</p>
              <p className="text-2xl font-bold text-primary mb-1">{address.balance}</p>
              <p className="text-sm text-muted-foreground">{address.balanceUSD}</p>
            </Card>

            <Card className="p-6 bg-card">
              <p className="text-sm text-muted-foreground mb-2">Total Transactions</p>
              <p className="text-2xl font-bold mb-1">{address.transactions}</p>
              <p className="text-sm text-muted-foreground">All time</p>
            </Card>

            <Card className="p-6 bg-card">
              <p className="text-sm text-muted-foreground mb-2">Account Age</p>
              <p className="text-2xl font-bold mb-1">7 months</p>
              <p className="text-sm text-muted-foreground">Since {address.firstSeen}</p>
            </Card>
          </div>

          {/* Activity Tabs */}
          <Card className="p-6 bg-card">
            <Tabs defaultValue="transactions" className="space-y-4">
              <TabsList>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="tokens">Tokens</TabsTrigger>
                <TabsTrigger value="nfts">NFTs</TabsTrigger>
              </TabsList>

              <TabsContent value="transactions" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Transaction History</h3>
                  <p className="text-sm text-muted-foreground">Showing latest {transactions.length} transactions</p>
                </div>

                <div className="space-y-3">
                  {transactions.map((tx, i) => (
                    <Link
                      key={i}
                      href={`/tx/${tx.hash}`}
                      className="block p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg ${tx.type === "in" ? "bg-success/10" : "bg-primary/10"}`}>
                            {tx.type === "in" ? (
                              <ArrowDownLeft className="h-4 w-4 text-success" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-primary" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                Block #{tx.block}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{tx.timestamp}</span>
                            </div>

                            <p className="text-sm font-mono text-muted-foreground truncate">{tx.hash}</p>

                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-muted-foreground">{tx.type === "in" ? "From:" : "To:"}</span>
                              <span className="font-mono truncate">
                                {tx.type === "in"
                                  ? `${tx.from.slice(0, 12)}...${tx.from.slice(-10)}`
                                  : `${tx.to.slice(0, 12)}...${tx.to.slice(-10)}`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p
                            className={`text-sm font-semibold ${tx.type === "in" ? "text-success" : "text-foreground"}`}
                          >
                            {tx.type === "in" ? "+" : "-"}
                            {tx.value}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tokens" className="space-y-4">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No tokens found for this address</p>
                </div>
              </TabsContent>

              <TabsContent value="nfts" className="space-y-4">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No NFTs found for this address</p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  )
}
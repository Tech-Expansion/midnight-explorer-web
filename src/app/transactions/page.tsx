import Link from "next/link"
import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import { getProvider } from "@/lib/data"
import { formatDistanceToNow } from "@/lib/utils"

// Disable prerendering so network calls are executed at request time
export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{ cursor?: string }>
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const provider = getProvider()
  const cursor = (await searchParams)?.cursor

  // Fetch transactions with pagination
  const { items: transactions, nextCursor } = await provider.getTransactionsPage(cursor)

  // Pagination helpers
  const pageSize = 20
  const current = cursor ? parseInt(cursor, 10) : 0
  const prevCursor = current - pageSize
  const prevHref = prevCursor > 0 ? `/transactions?cursor=${prevCursor}` : "/transactions"

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Success
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20">
            <Clock className="h-3 w-3 mr-1 animate-pulse" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return null
    }
  }

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
              Transactions
            </h1>
            <p className="text-muted-foreground text-lg">Track all transactions on the Midnight Cardano network</p>
          </div>

          {/* Search */}
          <Card className="bg-card/50 border-border p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by transaction hash or address..."
                  className="pl-10 bg-background/50 border-border"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Search
              </Button>
            </div>
          </Card>

          {/* Transactions Table */}
          <Card className="bg-card/50 border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Txn Hash</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Block</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Age</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={`${tx.hash}-${index}`} className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">
                        <Link
                          href={`/tx/${tx.hash}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors font-mono text-sm"
                        >
                          {tx.hash}
                        </Link>
                      </td>
                      <td className="p-4">{getStatusBadge(tx.status)}</td>
                      <td className="p-4">
                        {tx.blockHeight ? (
                          <Link
                            href={`/block/${tx.blockHeight}`}
                            className="text-purple-400 hover:text-purple-300 transition-colors font-mono text-sm"
                          >
                            #{tx.blockHeight}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground text-sm">Pending</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">
                          {tx.timestamp ? `${formatDistanceToNow(new Date(tx.timestamp))} ago` : "N/A"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">
                          {tx.size ? `${tx.size} B` : "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 pb-8">
            <div>
              {current > 0 && (
                <Link
                  href={prevHref}
                  className="px-4 py-2 bg-card/50 hover:bg-card/70 border border-border text-foreground rounded-md transition-colors inline-flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Link>
              )}
            </div>
            <div>
              {nextCursor && (
                <Link
                  href={`/transactions?cursor=${nextCursor}`}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600/50 to-purple-600/50 hover:from-blue-600/70 hover:to-purple-600/70 border border-blue-500/30 text-foreground rounded-md transition-colors inline-flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
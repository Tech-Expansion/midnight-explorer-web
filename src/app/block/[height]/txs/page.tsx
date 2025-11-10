import Link from "next/link"
import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { formatDistanceToNow } from "@/lib/utils"
import { notFound } from "next/navigation"

// Disable prerendering so network calls are executed at request time
export const dynamic = "force-dynamic"

// ✅ Define Transaction interface
interface Transaction {
  hash: string
  status: 'success' | 'pending' | 'failed'
  timestamp?: string | number
  size?: number
}

interface Block {
  height: number
  hash: string
  timestamp: number
}

interface PageProps {
  params: Promise<{
    height: string
  }>
  searchParams: Promise<{
    cursor?: string
  }>
}


export default async function BlockTransactionsPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const cursor = resolvedSearchParams.cursor || '0'

  // Fetch block
  const blockResponse = await fetch(`https://preview-service.midnightexplorer.com/blocks/${resolvedParams.height}`, { cache: 'no-store', headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '' } })
  if (!blockResponse.ok) {
    notFound()
  }
  const { block }: { block: Block } = await blockResponse.json()

  // Fetch transactions
  let transactions: Transaction[] = []
  let nextCursor: string | null = null
  const txResponse = await fetch(`https://preview-service.midnightexplorer.com/blocks/${resolvedParams.height}/transactions?limit=20&offset=${cursor}`, { cache: 'no-store', headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '' } })
  if (txResponse.ok) {
    const txData: { transactions: Transaction[], nextCursor?: string } = await txResponse.json()
    transactions = txData.transactions
    nextCursor = txData.nextCursor || null
  }

  // Pagination helpers
  const pageSize = 20
  const current = parseInt(cursor, 10)
  const prevCursorCalc = current - pageSize
  const prevHref =
    prevCursorCalc > 0
      ? `/block/${block.height}/txs?cursor=${prevCursorCalc}`
      : `/block/${block.height}/txs`

  const getStatusBadge = (status: Transaction['status']) => {
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
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Block #{block.height} Transactions
              </h1>
              <p className="text-muted-foreground text-lg">
                Showing {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
                {cursor !== '0' ? ` (page after ${cursor})` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/block/${block.height}`}
                className="px-4 py-2 bg-card/50 hover:bg-card/70 border border-border text-foreground rounded-md transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Block
              </Link>
            </div>
          </div>

          {/* Transactions Table */}
          {transactions.length > 0 ? (
            <Card className="bg-card/50 border-border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Txn Hash</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Age</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx: Transaction, index: number) => (
                      <tr
                        key={`${tx.hash}-${index}`}
                        className="border-b border-border/50 hover:bg-accent/5 transition-colors"
                      >
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
                          <span className="text-sm text-muted-foreground">
                            {tx.timestamp ? `${formatDistanceToNow(new Date(Number(tx.timestamp)))} ago` : "N/A"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">{tx.size ? `${tx.size} B` : "N/A"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card className="bg-card/50 border-border p-8">
              <div className="text-center text-muted-foreground">
                <p>No transactions found in this block.</p>
              </div>
            </Card>
          )}

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
                  href={`/block/${block.height}/txs?cursor=${nextCursor}`}
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
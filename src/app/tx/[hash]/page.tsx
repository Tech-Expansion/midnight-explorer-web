import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/ui/copy-button"
import { CheckCircle2, Clock, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getProvider } from "@/lib/data"
import { formatDistanceToNow } from "@/lib/utils"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ hash: string }>
}

// Disable prerendering so network calls are done at request time
export const dynamic = "force-dynamic"

export default async function TransactionPage({ params }: PageProps) {
  // Await params để resolve giá trị
  const resolvedParams = await params
  const provider = getProvider()

  // Fetch transaction details
  const transaction = await provider.getTransactionByHash(resolvedParams.hash)

  // Handle not found
  if (!transaction) {
    notFound()
  }

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

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Transaction Details
                </h1>
                <p className="text-muted-foreground text-lg">View detailed information about this transaction</p>
              </div>
              <Link
                href="/transactions"
                className="px-4 py-2 bg-card/50 hover:bg-card/70 border border-border text-foreground rounded-md transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </div>

            {/* Transaction Hash Card */}
            <Card className="p-6 bg-card/50 border-border">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-2">Transaction Hash</p>
                    <p className="text-lg font-mono break-all text-blue-400">{transaction.hash}</p>
                  </div>
                  <CopyButton text={transaction.hash} className="border-border" />
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            </Card>

            {/* Transaction Details */}
            <Card className="p-6 bg-card/50 border-border">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Overview</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Block</p>
                    {transaction.blockHeight ? (
                      <Link
                        href={`/block/${transaction.blockHeight}`}
                        className="text-purple-400 hover:text-purple-300 transition-colors font-mono text-lg"
                      >
                        #{transaction.blockHeight}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground text-lg">Pending</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Timestamp</p>
                    {transaction.timestamp ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{new Date(transaction.timestamp).toLocaleString()}</p>
                        </div>
                        <p className="text-xs text-muted-foreground ml-6">
                          ({formatDistanceToNow(new Date(transaction.timestamp))} ago)
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Pending</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Size</p>
                  <p className="text-lg font-mono">{transaction.size ? `${transaction.size} bytes` : "N/A"}</p>
                </div>
              </div>
            </Card>

            {/* Additional Info */}
            <Card className="p-6 bg-card/50 border-border">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Additional Information</h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">{getStatusBadge(transaction.status)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Block Height</span>
                  <span className="font-mono">
                    {transaction.blockHeight ? `#${transaction.blockHeight}` : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Transaction Size</span>
                  <span className="font-mono">{transaction.size ? `${transaction.size} B` : "N/A"}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Transaction Hash</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-blue-400 break-all max-w-md text-right">
                      {transaction.hash}
                    </span>
                    <CopyButton text={transaction.hash} className="border-border flex-shrink-0" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
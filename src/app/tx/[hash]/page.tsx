import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/ui/copy-button"
import { CheckCircle2, Clock, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "@/lib/utils"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ hash: string }>
}

export const dynamic = "force-dynamic"

function getBaseUrl() {
  return `http://localhost:3002`;
}

export default async function TransactionPage({ params }: PageProps) {
  const resolvedParams = await params
  const baseUrl = getBaseUrl()
  const res = await fetch(`https://preview-service.midnightexplorer.com/transactions/${resolvedParams.hash}`, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
        }
      })
  if (!res.ok) {
    if (res.status === 404) {
      notFound()
    }
    throw new Error('Failed to fetch transaction')
  }

  const transaction = await res.json()
  console.log('Fetched transaction:', transaction)

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Protocol Version</p>
                    <p className="text-lg font-mono">v{transaction.protocolVersion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Size</p>
                    <p className="text-lg font-mono">{transaction.size ? `${transaction.size} bytes` : "N/A"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Start Index</p>
                    <p className="text-lg font-mono">{transaction.startIndex}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">End Index</p>
                    <p className="text-lg font-mono">{transaction.endIndex}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Raw Transaction Data - ✅ CẬP NHẬT */}
            {transaction.raw && (
              <Card className="p-6 bg-card/50 border-border">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Raw Transaction Data</h2>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 bg-background/50 rounded-lg p-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                      <p className="text-xs font-mono break-all text-muted-foreground leading-relaxed">
                        {transaction.raw}
                      </p>
                    </div>
                    <CopyButton text={transaction.raw} className="border-border flex-shrink-0" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Size: {transaction.raw.length} characters ({Math.ceil((transaction.raw.length - 2) / 2)} bytes)</span>
                    <span className="text-muted-foreground/70">Scroll to view full data →</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Merkle Tree Root */}
            {transaction.merkleTreeRoot && (
              <Card className="p-6 bg-card/50 border-border">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Merkle Tree Root</h2>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-mono break-all text-muted-foreground flex-1">
                    {transaction.merkleTreeRoot}
                  </p>
                  <CopyButton text={transaction.merkleTreeRoot} className="border-border flex-shrink-0" />
                </div>
              </Card>
            )}

            {/* Identifiers */}
            {transaction.identifiers && transaction.identifiers.length > 0 && (
              <Card className="p-6 bg-card/50 border-border">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Identifiers</h2>
                <div className="space-y-3">
                  {transaction.identifiers.map((identifier: string, index: number) => (
                    <div key={index} className="flex items-start justify-between gap-4 p-3 bg-background/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">Identifier #{index + 1}</p>
                        <p className="text-sm font-mono break-all text-foreground">
                          {identifier}
                        </p>
                      </div>
                      <CopyButton text={identifier} className="border-border flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

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
                  <span className="text-muted-foreground">Block ID</span>
                  <span className="font-mono text-xs">{transaction.blockId || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Protocol Version</span>
                  <span className="font-mono">v{transaction.protocolVersion}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Transaction Size</span>
                  <span className="font-mono">{transaction.size ? `${transaction.size} B` : "N/A"}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-xs">{transaction.id}</span>
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
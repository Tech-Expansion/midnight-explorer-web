import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowLeft, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "@/lib/utils"
import { notFound, redirect } from "next/navigation"
import { CopyButton } from "@/components/ui/copy-button"
import { Transaction } from "@/lib/types"

interface PageProps {
  params: Promise<{ height: string }>
}

// Disable prerendering so network calls are executed at request time
export const dynamic = "force-dynamic"

// Helper function to get base URL
function getBaseUrl() {
  if (typeof window !== 'undefined') return '' // Browser should use relative path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // Vercel deployment
  return `http://localhost:${process.env.PORT ?? 3000}` // Local development
}

export default async function BlockPage({ params }: PageProps) {
  // AWAIT params first
  const { height } = await params;
  console.log('Fetching block with height/hash:', height);

  const baseUrl = getBaseUrl();

  try {
    // Fetch block details from API
    const blockResponse = await fetch(`${baseUrl}/api/blocks/${height}`, {
      cache: 'no-store'
    })
    console.log('Block API response status:', blockResponse.status, blockResponse.ok);

    if (!blockResponse.ok) {
      if (blockResponse.status === 404) {
        // Try transaction fallback 
        try {
          const txResponse = await fetch(`${baseUrl}/api/transactions/${height}`, {
            cache: 'no-store'
          })
          if (txResponse.ok) {
            redirect(`/tx/${height}`)
          }
        } catch (error) {
          notFound()
        }
        notFound()
      }
      throw new Error('Failed to fetch block')
    }

    const data = await blockResponse.json()
    console.log('Block data received:', data);
    
    if (!data.block) {
      console.error('No block data in response');
      notFound()
    }

    const { block } = data
    const blockHeight = block.height

    // Fetch transactions for preview
    let transactions: Transaction[] = []
    let hasMoreTransactions = false
    
    if (block.txCount > 0) {
      try {
        const txResponse = await fetch(`${baseUrl}/api/blocks/${height}/transactions?limit=20`, {
          cache: 'no-store'
        })
        if (txResponse.ok) {
          const txData = await txResponse.json()
          transactions = txData.transactions || []
          hasMoreTransactions = block.txCount > 20
        }
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }

    const getStatusBadge = (status: string) => {
      switch (status) {
        case "success":
          return (
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Success
            </Badge>
          )
        case "pending":
          return (
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
              <Clock className="h-3 w-3 mr-1 animate-pulse" />
              Pending
            </Badge>
          )
        case "failed":
          return (
            <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
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
              {/* Header with Navigation */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Block #{block.height}
                  </h1>
                  <p className="text-muted-foreground text-lg">View detailed information about this block</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/blocks">
                    <Button variant="outline" size="sm" className="border-border">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  </Link>
                  {blockHeight > 0 && (
                    <Link href={`/block/${blockHeight - 1}`}>
                      <Button variant="outline" size="icon" className="border-border">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Link href={`/block/${blockHeight + 1}`}>
                    <Button variant="outline" size="icon" className="border-border">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Block Overview */}
              <Card className="p-6 bg-card/50 border-border">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Overview</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Block Height</p>
                      <p className="text-lg font-semibold font-mono text-blue-400">#{block.height}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{new Date(block.timestamp).toLocaleString()}</p>
                        </div>
                        <p className="text-xs text-muted-foreground ml-6">
                          ({formatDistanceToNow(new Date(block.timestamp))} ago)
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                      <Badge className="text-base px-3 py-1 bg-green-500/10 text-green-400 border-green-500/20">
                        {block.txCount} txns
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Block Hash</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono break-all flex-1 text-blue-400">{block.hash}</p>
                      <CopyButton text={block.hash} />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Block Information */}
              <Card className="p-6 bg-card/50 border-border">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Block Information</h2>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Height</span>
                    <span className="font-mono text-blue-400">#{block.height}</span>
                  </div>
                  <div className="flex items-start justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Hash</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-blue-400 break-all max-w-md text-right">
                        {block.hash}
                      </span>
                      <CopyButton text={block.hash} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Timestamp</span>
                    <span className="font-medium">{new Date(block.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">Transaction Count</span>
                    <span className="font-medium text-green-400">{block.txCount}</span>
                  </div>
                </div>
              </Card>

              {/* Transactions Preview */}
              {block.txCount > 0 && (
                <Card className="p-6 bg-card/50 border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-purple-400">
                      Transactions ({transactions.length}{hasMoreTransactions ? ` of ${block.txCount}` : ''})
                    </h2>
                    
                    <Link
                      href={`/block/${block.height}/txs`}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View All →
                    </Link>
                  </div>
                  
                  {transactions.length > 0 ? (
                    <div className="space-y-3">
                      {transactions.map((tx, index) => (
                        <Link
                          key={`${tx.hash}-${index}`}
                          href={`/tx/${tx.hash}`}
                          className="block p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/50"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-mono text-blue-400 truncate">
                                  {tx.hash}
                                </span>
                                {getStatusBadge(tx.status)}
                              </div>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                {tx.timestamp && (
                                  <span>
                                    {formatDistanceToNow(new Date(tx.timestamp))} ago
                                  </span>
                                )}
                                {tx.size && (
                                  <span>{tx.size} bytes</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Loading transactions...</p>
                    </div>
                  )}
                </Card>
              )}

              {block.txCount === 0 && (
                <Card className="p-6 bg-card/50 border-border">
                  <h2 className="text-xl font-semibold mb-4 text-purple-400">Transactions</h2>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No transactions in this block</p>
                  </div>
                </Card>
              )}
            </div>
          </main>

          <Footer />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching block:', error)
    
    // Try transaction fallback
    try {
      const txResponse = await fetch(`${baseUrl}/api/transactions/${height}`, {
        cache: 'no-store'
      })
      if (txResponse.ok) {
        redirect(`/tx/${height}`)
      }
    } catch (txError) {
      notFound()
    }
    
    notFound()
  }
}
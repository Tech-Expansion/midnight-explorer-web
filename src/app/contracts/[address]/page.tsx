import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileCode, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CopyButton } from "@/components/ui/copy-button"

interface PageProps {
  params: Promise<{ address: string }>
}

export const dynamic = "force-dynamic"

function getBaseUrl() {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export default async function ContractPage({ params }: PageProps) {
  const { address } = await params
  const baseUrl = getBaseUrl()

  try {
    const res = await fetch(`${baseUrl}/api/contracts/${address}`, {
      cache: 'no-store'
    })

    if (!res.ok) {
      if (res.status === 404) notFound()
      throw new Error('Failed to fetch contract')
    }

    const { contract } = await res.json()

    // ✅ NEW: Fetch transaction hash from ID
    let transactionHash = null
    if (contract.transactionId) {
      try {
        const txRes = await fetch(
          `${baseUrl}/api/transactions/id/${contract.transactionId}`,
          { cache: 'no-store' }
        )
        if (txRes.ok) {
          const txData = await txRes.json()
          transactionHash = txData.hash
        }
      } catch (error) {
        console.error('Failed to fetch transaction hash:', error)
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
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Contract Details
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    View contract state and information
                  </p>
                </div>
                <Link href="/contracts">
                  <Button variant="outline" size="sm" className="border-border">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
              </div>

              {/* Overview */}
              <Card className="p-6 bg-card/50 border-border">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Overview</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Contract Type</p>
                      <Badge
                        variant="outline"
                        className={
                          contract.variant === 'Deploy'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20 text-base px-3 py-1'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20 text-base px-3 py-1'
                        }
                      >
                        <FileCode className="h-4 w-4 mr-1" />
                        {contract.variant}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Transaction</p>
                      {/* ✅ UPDATED: Use transaction hash if available */}
                      {transactionHash ? (
                        <Link
                          href={`/tx/${transactionHash}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors font-mono text-sm flex items-center gap-2"
                        >
                          {transactionHash.slice(0, 32)}...{transactionHash.slice(-16)}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground font-mono">
                          TX #{contract.transactionId}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Contract Address</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono break-all flex-1 text-blue-400">
                        {contract.address}
                      </p>
                      <CopyButton text={contract.address} />
                    </div>
                  </div>
                </div>
              </Card>

              {/* State */}
              <Card className="p-6 bg-card/50 border-border">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Contract State</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">State</p>
                      <CopyButton text={contract.state || ''} />
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-4 max-h-64 overflow-y-auto">
                      <pre className="text-xs font-mono break-all whitespace-pre-wrap">
                        {contract.state || 'No state data'}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">ZSwap State</p>
                      <CopyButton text={contract.zswapState || ''} />
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-4 max-h-64 overflow-y-auto">
                      <pre className="text-xs font-mono break-all whitespace-pre-wrap">
                        {contract.zswapState || 'No zswap state data'}
                      </pre>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Attributes */}
              {contract.attributes && (
                <Card className="p-6 bg-card/50 border-border">
                  <h2 className="text-xl font-semibold mb-4 text-purple-400">Attributes</h2>
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <pre className="text-sm font-mono break-all whitespace-pre-wrap">
                      {JSON.stringify(contract.attributes, null, 2)}
                    </pre>
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
    console.error('Error fetching contract:', error)
    notFound()
  }
}
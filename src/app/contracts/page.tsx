import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, FileCode, ExternalLink } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

// ✅ Define Contract interface
interface Contract {
  id: string
  address: string
  transactionId: string
  transactionHash?: string
  variant: 'Deploy' | 'Call'
}

interface ApiResponse {
  items: Contract[]
  nextCursor?: string
}

interface PageProps {
  searchParams: Promise<{
    cursor?: string
  }>
}


export default async function ContractsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const cursor = resolvedSearchParams?.cursor
  // Fetch contracts from API
  const url = cursor
    ? `https://preview-service.midnightexplorer.com/contract/?cursor=${cursor}`
    : `https://preview-service.midnightexplorer.com/contract/`

  const res = await fetch(url, {
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
    }
  })
  if (!res.ok) throw new Error('Failed to fetch contracts')

  const { items: contracts, nextCursor }: ApiResponse = await res.json()

  // ✅ NEW: Fetch transaction hashes for all contracts
  const contractsWithHashes = await Promise.all(
    contracts.map(async (contract: Contract): Promise<Contract> => {
      try {
        const txRes = await fetch(
          `https://preview-service.midnightexplorer.com/transactions/id/${contract.transactionId}`,
          {
            headers: {
              'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
            }
          }
        )
        if (txRes.ok) {
          const txData = await txRes.json()
          return { ...contract, transactionHash: txData.hash }
        }
      } catch (error) {
        // ✅ FIXED: Use error parameter or prefix with underscore
        console.error(`Failed to fetch hash for TX ${contract.transactionId}:`, error)
      }
      return contract
    })
  )

  // Pagination helpers
  const limit = 20
  let prevHref = ''
  if (cursor && contracts.length > 0) {
    const prevCursor = parseInt(contracts[0].id) + limit + 1
    prevHref = `/contracts?cursor=${prevCursor}`
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
              Smart Contracts
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore deployed and called contracts on Midnight
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <FileCode className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{contracts.length}</p>
                  <p className="text-xs text-muted-foreground">Contracts on this page</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contracts Table */}
          <Card className="bg-card/50 border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Contract Address
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Transaction
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contractsWithHashes.map((contract: Contract) => (
                    <tr
                      key={contract.id}
                      className="border-b border-border/50 hover:bg-accent/5 transition-colors"
                    >
                      <td className="p-4">
                        <Link
                          href={`/contracts/${contract.address}`}
                          className="font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors break-all"
                        >
                          {contract.address}
                        </Link>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={
                            contract.variant === 'Deploy'
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          }
                        >
                          {contract.variant}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {/* ✅ UPDATED: Link to /tx/[hash] instead of /tx/[id] */}
                        {contract.transactionHash ? (
                          <Link
                            href={`/tx/${contract.transactionHash}`}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
                          >
                            {contract.transactionHash.slice(0, 16)}...
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground font-mono">
                            TX #{contract.transactionId}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <Link href={`/contracts/${contract.address}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-border hover:bg-accent/50"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </Link>
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
              {cursor && (
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
                  href={`/contracts?cursor=${nextCursor}`}
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
import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight, Box, Clock } from "lucide-react"
import Link from "next/link"
import { getProvider } from "@/lib/data"
import { formatDistanceToNow } from "@/lib/utils"

// Disable prerendering so network calls are done at request time
export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    cursor?: string
  }>
}

export default async function BlocksPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const provider = getProvider()
  const cursor = resolvedSearchParams?.cursor

  // Fetch blocks with pagination (exactly 20 blocks per page)
  const { items: blocks, nextCursor } = await provider.getBlocksPage(cursor)

  // Pagination helpers
  const pageSize = 20
  const current = cursor ? parseInt(cursor, 10) : 0
  const prevCursor = current - pageSize
  const prevHref = prevCursor >= 0 ? `/blocks?cursor=${prevCursor}` : "/blocks"

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
              Blocks
            </h1>
            <p className="text-muted-foreground text-lg">Explore all blocks on the Midnight Cardano network</p>
          </div>

          {/* Search */}
          <Card className="bg-card/50 border-border p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by block height or hash..."
                  className="pl-10 bg-background/50 border-border"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Search
              </Button>
            </div>
          </Card>

          {/* Blocks Table */}
          <Card className="bg-card/50 border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Block</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Age</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Txns</th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((block) => (
                    <tr key={block.hash} className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">
                        <div className="space-y-1">
                          <Link
                            href={`/block/${block.height}`}
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-mono"
                          >
                            <Box className="h-4 w-4" />
                            {block.height.toLocaleString()}
                          </Link>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                            {block.hash}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {formatDistanceToNow(new Date(block.timestamp))} ago
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                          {block.txCount}
                        </Badge>
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
                  href={`/blocks?cursor=${nextCursor}`}
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
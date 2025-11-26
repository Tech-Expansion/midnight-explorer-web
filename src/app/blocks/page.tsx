import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"
import { SearchBarPage } from "@/components/search-bar-page"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Box, Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "@/lib/utils"
import { blockAPI } from "@/lib/api"

// Disable prerendering so network calls are done at request time
export const dynamic = "force-dynamic"

// ✅ Define Block interface
interface Block {
  hash: string
  height: number
  timestamp: number | string
  txCount: number
}

interface ApiResponse {
  items: Block[]
  nextCursor?: string
}

interface PageProps {
  searchParams: Promise<{
    cursor?: string
  }>
}


export default async function BlocksPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const cursor = resolvedSearchParams?.cursor

  // Fetch blocks from API
  const { items: blocks, nextCursor }: ApiResponse = await blockAPI.getBlocks(cursor)

  // Pagination helpers
  const limit = 20
  let prevHref = ''
  if (cursor && blocks.length > 0) {
    const prevCursor = blocks[0].height + limit + 1
    prevHref = `/blocks?cursor=${prevCursor}`
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 z-0">
        <Starfield />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8 space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Blocks
            </h1>
            <p className="text-muted-foreground text-lg">Explore all blocks on the Midnight network</p>
          </div>

          {/* Search */}
          <SearchBarPage searchType="block" />

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
                  {blocks.map((block: Block) => (
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
                          {formatDistanceToNow(new Date(Number(block.timestamp)))} ago
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
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Box, Clock } from "lucide-react"
import { formatDateTime } from "@/lib/utils"
import { blockAPI } from "@/lib/api"
import { Pagination, SimplePagination } from "@/components/pagination"
import { useNetworkStats } from "@/hooks/useNetworkStats"

interface Block {
  hash: string
  height: number
  parent_hash: string
  author: string
  timestamp: number | string
  protocol_version: number
  txCount: number
}

interface BlocksListProps {
  initialCursor?: string
  page?: number
}

export function BlocksList({ initialCursor, page = 1 }: BlocksListProps) {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [nextCursor, setNextCursor] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const { latestBlock } = useNetworkStats()

  const pageSize = 20
  // Calculate total pages from latest block height
  const totalPages = latestBlock ? Math.ceil(latestBlock.height / pageSize) : 0

  // Calculate cursor from page number
  const cursor = page > 1 && latestBlock ? latestBlock.height - (page - 1) * pageSize : initialCursor

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response: { items: Block[]; nextCursor?: string } = await blockAPI.getBlocks(cursor ? String(cursor) : undefined)
        setBlocks(response.items)
        setNextCursor(response.nextCursor)
      } catch (error) {
        console.error('Failed to fetch blocks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [cursor])

  if (loading) {
    return (
      <Card className="bg-card/50 border-border p-8">
        <p className="text-center text-muted-foreground">Loading blocks...</p>
      </Card>
    )
  }

  // Pagination helpers
  const limit = 20
  let prevHref = ''
  if (initialCursor && blocks.length > 0) {
    const prevCursor = blocks[0].height + limit + 1
    prevHref = `/blocks?cursor=${prevCursor}`
  }

  return (
    <>
      {/* Blocks Table */}
      <Card className="bg-card/50 border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Block</th>
                <th className="text-center p-4 text-sm font-semibold text-muted-foreground">
                  <span className="inline-block -translate-x-28">Age</span>
                </th>
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
                      {block.parent_hash && block.author && (
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="font-mono text-xs truncate max-w-[220px]">
                            Parent: {block.parent_hash.slice(0, 12)}...{block.parent_hash.slice(-8)}
                          </span>
                          <span className="truncate max-w-[160px]">
                            Author: {block.author.length > 24 ? `${block.author.slice(0, 12)}...${block.author.slice(-8)}` : block.author}
                          </span>
                          {block.protocol_version && (
                            <span className="text-muted-foreground">Protocol: v{block.protocol_version}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatDateTime(new Date(Number(block.timestamp)))}
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
      {totalPages > 0 ? (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          buildUrl={(p) => `/blocks?page=${p}`}
          className="mt-4 pb-8"
        />
      ) : (
        <SimplePagination
          hasPrev={!!initialCursor}
          hasNext={!!nextCursor}
          prevUrl={prevHref}
          nextUrl={nextCursor ? `/blocks?cursor=${nextCursor}` : undefined}
          className="mt-4 pb-8"
        />
      )}
    </>
  )
}

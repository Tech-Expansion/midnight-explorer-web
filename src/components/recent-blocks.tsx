'use client'

import { Card } from "@/components/ui/card"
import { Blocks, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDateTimeWithRelative } from '@/lib/utils'
import { Block } from '@/lib/types'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from "@/components/ui/badge"

interface RecentBlocksProps {
  blocks: Block[]
}

export function RecentBlocks({ blocks }: RecentBlocksProps) {
  const columns = [
    {
      id: "block",
      header: "Block",
      accessor: (block: Block) => (
        <Link href={`/block/${block.height}`} className="font-mono text-primary hover:underline">
          {block.height}
        </Link>
      ),
      className: "w-[120px]"
    },
    {
      id: "age",
      header: "Age",
      accessor: (block: Block) => (
        <span className="text-muted-foreground whitespace-nowrap" suppressHydrationWarning>
          {formatDateTimeWithRelative(new Date(block.timestamp))}
        </span>
      ),
    },
    {
      id: "txCount",
      header: "Tx Count",
      accessor: (block: Block) => (
        <Badge variant="secondary" className="font-mono bg-muted/50 text-foreground border-transparent rounded-[4px]">
          {block.txCount}
        </Badge>
      ),
    },
    {
      id: "proposer",
      header: "Proposer",
      accessor: (block: Block) => (
        <span className="font-mono text-muted-foreground">
          {block.author.slice(0, 8)}...{block.author.slice(-6)}
        </span>
      ),
    },
    {
      id: "size",
      header: "Size",
      accessor: () => (
        <span className="text-muted-foreground">-</span>
      ),
      className: "text-right"
    }
  ]

  return (
    <Card className="flex flex-col border border-border bg-card shadow-sm rounded-[4px]">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Blocks className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold tracking-tight">Latest Blocks</h3>
        </div>
        <Link
          href="/blocks"
          className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group"
        >
          View All
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="relative overflow-x-auto">
        {blocks.length === 0 ? (
          <div className="flex-1 space-y-3 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[48px] rounded-sm bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <DataTable
            data={blocks}
            columns={columns}
            getRowKey={(block) => block.height}
          />
        )}
      </div>
    </Card>
  )
}
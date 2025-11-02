'use client'

import { useMemo, useRef, useLayoutEffect } from 'react' // Thêm useLayoutEffect
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Blocks, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from '@/lib/utils'

interface Block {
  height: number
  hash: string
  timestamp: string
  txCount: number
}

interface RecentBlocksProps {
  blocks: Block[]
}

export function RecentBlocks({ blocks }: RecentBlocksProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const prevScrollTopRef = useRef(0) // Lưu scroll trước update

  // Restore scroll đồng bộ trước paint
  useLayoutEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = prevScrollTopRef.current
    }
  }, [blocks]) // Chạy khi blocks thay đổi

  const blocksContent = useMemo(() => {
    // Lưu scroll trước render mới
    prevScrollTopRef.current = scrollContainerRef.current?.scrollTop || 0

    return blocks.map((block) => (
      <Link
        key={block.height}
        href={`/block/${block.height}`}
        className="block"
      >
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer min-h-[120px] will-change-transform">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="font-mono">
                  #{block.height}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(block.timestamp))} ago
                </span>
              </div>

              <p className="text-sm font-mono text-muted-foreground truncate">
                {block.hash}
              </p>

              <div className="mt-2">
                <span className="text-sm text-muted-foreground">
                  Txns: {block.txCount}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    ))
  }, [blocks])

  // Luôn show skeleton nếu empty, nhưng giữ space để tránh shift
  if (blocks.length === 0) {
    return (
      <Card className="p-6 bg-card h-[680px] w-full flex flex-col" style={{ contain: 'strict' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Blocks className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Recent Blocks</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          {[...Array(5)].map((_, i) => ( // Giả sử max 5 items, giữ fixed skeleton
            <div key={i} className="p-4 rounded-lg bg-secondary/50 animate-pulse h-[120px]">
              <div className="h-full bg-muted rounded" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-card h-[680px] w-full flex flex-col relative" style={{ contain: 'strict' }}> {/* Isolate paint */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Blocks className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Recent Blocks</h2>
        </div>
        <Link
          href="/blocks"
          className="flex items-center gap-1 text-sm text-white-400 hover:text-blue-300 transition-colors"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2"
        style={{ 
          transform: 'translateZ(0)',
          willChange: 'scroll-position',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {blocksContent}
      </div>
    </Card>
  )
}
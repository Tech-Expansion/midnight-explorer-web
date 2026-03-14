'use client'

import { useMemo, useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/ui/copy-button"
import { Blocks, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDateTimeWithRelative } from '@/lib/utils'
import { Block } from '@/lib/types'


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
      <div
        key={block.height}
        className="block p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors min-h-[110px] will-change-transform group"
      >
        <Link href={`/block/${block.height}`} className="block h-full">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Badge variant="outline" className="font-mono flex-shrink-0">
                  #{block.height}
                </Badge>
                <span className="text-sm text-muted-foreground truncate" suppressHydrationWarning>
                  {formatDateTimeWithRelative(new Date(block.timestamp))}
                </span>
              </div>
              <span className="text-sm text-muted-foreground flex-shrink-0 ml-auto pr-23">
                Author
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              {/* HASH + COPY */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                
                <p className="text-sm font-mono text-muted-foreground truncate">
                  {`${block.hash.slice(0, 15)}...${block.hash.slice(-15)}`}
                </p>
                <div
                  onClick={(e) => e.preventDefault()}
                  className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <CopyButton text={block.hash} className="h-5 w-5" />
                </div>
              </div>

              {/* AUTHOR */}
              <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
                <Image src="/images/author.svg" alt="Author" width={25} height={25} />
                <span className="text-sm text-muted-foreground truncate">
                  {`${block.author.slice(0, 12)}...${block.author.slice(-12)}`}
                </span>
                <div
                  onClick={(e) => e.preventDefault()}
                  className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <CopyButton text={block.author} className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Txns: {block.txCount}
            </div>
          </div>
        </Link>
      </div>
    ))
  }, [blocks])

  // Luôn show skeleton nếu empty, nhưng giữ space để tránh shift
  if (blocks.length === 0) {
    return (
      <Card className="p-6 bg-card h-[680px] w-full flex flex-col" style={{ contain: 'strict' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Blocks className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Recent Blocks</h3>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg bg-secondary/50 animate-pulse min-h-[110px]">
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
          <h3 className="text-lg font-semibold">Recent Blocks</h3>
        </div>
        <Link
          href="/blocks"
          className="flex items-center gap-1 text-sm text-white hover:text-gray-300 transition-colors"
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
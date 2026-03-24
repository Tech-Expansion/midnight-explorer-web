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

    return blocks.map((block) => {
      const txns = block.txCount ?? (block as any).transactionsCount ?? 0;
      return (
        <div
          key={block.height}
          className="block px-4 py-3 rounded-lg bg-secondary/30 hover:bg-secondary/70 transition-colors min-h-[60px] will-change-transform group border border-transparent hover:border-border/50"
        >
          <Link
            href={`/block/${block.height}`}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 h-full"
          >
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <Badge
                variant="outline"
                className="font-mono flex-shrink-0 text-sm py-0.5 px-2 bg-background/50"
              >
                #{block.height}
              </Badge>
              <div className="flex items-center gap-2 min-w-0 group/hash">
                <p
                  className="text-sm font-mono text-muted-foreground truncate"
                  title={block.hash}
                >
                  {block.hash
                    ? `${block.hash.slice(0, 8)}...${block.hash.slice(-8)}`
                    : "Unknown"}
                </p>
                <div
                  onClick={(e) => e.preventDefault()}
                  className="opacity-0 group-hover/hash:opacity-100 transition-opacity"
                >
                  <CopyButton text={block.hash || ""} className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
              <div
                className="flex items-center gap-2 min-w-0"
                title={block.author}
              >
                <Image
                  src="/images/author.svg"
                  alt="Author"
                  width={14}
                  height={14}
                  className="opacity-50"
                />
                <span className="text-sm text-muted-foreground truncate max-w-[100px] sm:max-w-[150px]">
                  {block.author
                    ? `${block.author.slice(0, 8)}...${block.author.slice(-8)}`
                    : "Unknown"}
                </span>
                <div
                  onClick={(e) => e.preventDefault()}
                  className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <CopyButton
                    text={block.author || ""}
                    className="h-4 w-4 hidden md:block"
                  />
                </div>
              </div>

              <div className="text-sm font-medium text-foreground whitespace-nowrap bg-background/40 px-2 py-0.5 rounded-md border border-border/40">
                {txns} Txns
              </div>

              <span
                className="text-sm text-muted-foreground whitespace-nowrap min-w-[110px] text-right"
                suppressHydrationWarning
              >
                {formatDateTimeWithRelative(new Date(block.timestamp))}
              </span>
            </div>
          </Link>
        </div>
      );
    });
  }, [blocks])

  // Luôn show skeleton nếu empty, nhưng giữ space để tránh shift
  if (blocks.length === 0) {
    return (
      <Card
        className="p-4 bg-card h-[680px] w-full flex flex-col"
        style={{ contain: "strict" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Blocks className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Recent Blocks</h3>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-secondary/50 animate-pulse min-h-[60px]"
            >
              <div className="h-full bg-muted rounded" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="p-4 bg-card h-[680px] w-full flex flex-col relative"
      style={{ contain: "strict" }}
    >
      {" "}
      {/* Isolate paint */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Blocks className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Recent Blocks</h3>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2"
        style={{
          transform: "translateZ(0)",
          willChange: "scroll-position",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {blocksContent}
      </div>
    </Card>
  );
}
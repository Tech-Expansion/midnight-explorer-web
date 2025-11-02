'use client'

import { useMemo, useRef, useLayoutEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from '@/lib/utils'

interface Transaction {
  hash: string
  status: string
  blockHeight?: number
  timestamp?: string
}

interface RecentTransactionsProps {
  txs: Transaction[]
}

export function RecentTransactions({ txs }: RecentTransactionsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const prevScrollTopRef = useRef(0)

  useLayoutEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = prevScrollTopRef.current
    }
  }, [txs])

  const transactionsContent = useMemo(() => {
    prevScrollTopRef.current = scrollContainerRef.current?.scrollTop || 0

    return txs.map((tx, index) => (
      <Link
        key={`${tx.hash}-${index}`}
        href={`/tx/${tx.hash}`}
        className="block p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors min-h-[100px] will-change-transform"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-mono text-primary hover:text-primary/80 truncate flex-1">
              {tx.hash}
            </p>
            <Badge
              variant={tx.status === "success" ? "default" : tx.status === "failed" ? "destructive" : "secondary"}
              className={
                tx.status === "success"
                  ? "bg-green-500/20 text-green-500 border-green-500/30"
                  : tx.status === "failed"
                    ? "bg-red-500/20 text-red-500 border-red-500/30"
                    : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
              }
            >
              {tx.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            {tx.blockHeight ? (
              <Link
                href={`/block/${tx.blockHeight}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Block #{tx.blockHeight}
              </Link>
            ) : (
              <span className="text-muted-foreground">Pending</span>
            )}
            {tx.timestamp && (
              <span className="text-muted-foreground">
                {formatDistanceToNow(new Date(tx.timestamp))} ago
              </span>
            )}
          </div>
        </div>
      </Link>
    ))
  }, [txs])

  if (txs.length === 0) {
    return (
      <Card className="p-6 bg-card h-[680px] w-full flex flex-col" style={{ contain: 'strict' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg bg-secondary/50 animate-pulse h-[100px]">
              <div className="h-full bg-muted rounded" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-card h-[680px] w-full flex flex-col relative" style={{ contain: 'strict' }}>
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
        </div>
        <Link
          href="/transactions"
          className="text-sm text-white-400 hover:text-blue-300 transition-colors flex items-center gap-1"
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
        {transactionsContent}
      </div>
    </Card>
  )
}

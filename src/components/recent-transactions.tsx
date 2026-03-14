'use client'

import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/ui/copy-button"
import { Activity, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDateTimeWithRelative } from '@/lib/utils'
import { transactionAPI } from '@/lib/api'
import { RawTransaction, BufferData } from '@/lib/transaction-types'

export function RecentTransactions() {
  const [txs, setTxs] = useState<RawTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const prevScrollTopRef = useRef(0)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data: RawTransaction[] = await transactionAPI.getRecentTransactions<RawTransaction[]>()
        const normalizedData: RawTransaction[] = data.map((tx) => {
          let hashStr: string = ''
          if (typeof tx.hash === 'string') {
            hashStr = tx.hash.startsWith('0x') ? tx.hash : `0x${tx.hash}`
          } else if (tx.hash && typeof tx.hash === 'object' && 'data' in tx.hash && Array.isArray((tx.hash as BufferData).data)) {
            hashStr = '0x' + Buffer.from((tx.hash as BufferData).data).toString('hex')
          }

          return {
            hash: hashStr,
            variant: tx.variant || 'Regular',
            blockHeight: tx.blockHeight,
            timestamp: tx.timestamp ? Number(tx.timestamp) : undefined,
            protocolVersion: tx.protocolVersion ? Number(tx.protocolVersion) : undefined,
            size: tx.size ? Number(tx.size) : undefined,
          } as RawTransaction
        })
        setTxs(normalizedData)
      } catch (error) {
        console.error('Error fetching recent transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()

  }, [])

  useLayoutEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = prevScrollTopRef.current
    }
  }, [txs])

  const transactionsContent = useMemo(() => {
    prevScrollTopRef.current = scrollContainerRef.current?.scrollTop || 0

    return txs.map((tx, index) => {
      let txHash = ''
      if (typeof tx.hash === 'string') {
        txHash = tx.hash.startsWith('0x') ? tx.hash : `0x${tx.hash}`
      } else if (tx.hash && typeof tx.hash === 'object' && 'data' in tx.hash && Array.isArray((tx.hash as BufferData).data)) {
        txHash = '0x' + Buffer.from((tx.hash as BufferData).data).toString('hex')
      }

      return (
        <div
          key={`${txHash}-${index}`}
          className="block p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors min-h-[110px] will-change-transform group"
        >
          <Link href={`/tx/${txHash}`} className="block h-full">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {tx.blockHeight ? (
                    <Badge variant="outline" className="font-mono">
                      #{tx.blockHeight}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="font-mono">
                      Pending
                    </Badge>
                  )}
                  {tx.timestamp && (
                    <span className="text-sm text-muted-foreground" suppressHydrationWarning>
                      {formatDateTimeWithRelative(new Date(tx.timestamp))}
                    </span>
                  )}
                </div>
                <Badge
                  variant={tx.variant === "Regular" ? "default" : "secondary"}
                  className={
                    tx.variant === "Regular"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                  }
                >
                  {tx.variant}
                </Badge>
              </div>

              <div className="flex items-center gap-2 group/hash">
                <p className="text-sm font-mono text-muted-foreground truncate flex-1 select-all">
                  {txHash}
                </p>
                <div 
                  onClick={(e) => e.preventDefault()}
                  className="opacity-50 group-hover/hash:opacity-100 transition-opacity"
                >
                  <CopyButton text={txHash} className="h-6 w-6" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                {tx.protocolVersion && (
                  <span>Protocol v{tx.protocolVersion}</span>
                )}
                {tx.size && (
                  <span>{tx.size} B</span>
                )}
              </div>
            </div>
          </Link>
        </div>
      )
    })
  }, [txs])

  if (loading || txs.length === 0) {
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
            <div key={i} className="p-4 rounded-lg bg-secondary/50 animate-pulse min-h-[110px]">
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
          className="text-sm text-white hover:text-gray-300 transition-colors flex items-center gap-1"
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
'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Activity, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDateTimeWithRelative } from '@/lib/utils'
import { transactionAPI } from '@/lib/api'
import { RawTransaction, BufferData } from '@/lib/transaction-types'
import { DataTable } from '@/components/ui/data-table'
import { HashLink } from '@/components/ui/hash-link'
import { AddressLink } from '@/components/ui/address-link'
import { StatBadge } from '@/components/ui/stat-badge'

export function RecentTransactions() {
  const [txs, setTxs] = useState<RawTransaction[]>([])
  const [loading, setLoading] = useState(true)

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

  const columns = [
    {
      header: "Tx Hash",
      accessor: (tx: RawTransaction) => (
        <HashLink hash={tx.hash as string} type="tx" truncate showCopy={false} />
      ),
      className: "w-[120px]"
    },
    {
      header: "Method",
      accessor: (tx: RawTransaction) => (
        <StatBadge variant={tx.variant === "Regular" ? "outline" : "secondary"}>
          {tx.variant}
        </StatBadge>
      ),
    },
    {
      header: "Block",
      accessor: (tx: RawTransaction) => (
        tx.blockHeight ? (
          <Link href={`/block/${tx.blockHeight}`} className="font-mono text-primary hover:underline">
            {tx.blockHeight}
          </Link>
        ) : <span className="text-muted-foreground">-</span>
      ),
    },
    {
      header: "Age",
      accessor: (tx: RawTransaction) => (
        tx.timestamp ? (
          <span className="text-muted-foreground whitespace-nowrap" suppressHydrationWarning>
            {formatDateTimeWithRelative(new Date(tx.timestamp))}
          </span>
        ) : <span className="text-muted-foreground">-</span>
      ),
    },
    {
      header: "From",
      accessor: () => <AddressLink address="-" />,
    },
    {
      header: "To",
      accessor: () => <AddressLink address="-" />,
    },
    {
      header: "Value",
      accessor: () => <span className="text-muted-foreground">0 MID</span>,
      className: "text-right whitespace-nowrap"
    }
  ]

  return (
    <Card className="flex flex-col border border-border bg-card shadow-sm rounded-[4px]">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold tracking-tight">Latest Transactions</h3>
        </div>
        <Link
          href="/transactions"
          className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group"
        >
          View All
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="relative overflow-x-auto">
        {loading || txs.length === 0 ? (
          <div className="flex-1 space-y-3 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[48px] rounded-sm bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <DataTable data={txs} columns={columns} />
        )}
      </div>
    </Card>
  )
}
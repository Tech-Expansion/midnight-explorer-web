"use client"

import { useEffect, useState } from "react"
import { blockAPI } from "@/lib/api"
import { LoadingFallback } from "@/components/loading-fallback"
import { DataTable } from "@/components/ui/data-table"
import { HashLink } from "@/components/ui/hash-link"
import { CopyButton } from "@/components/ui/copy-button"

export interface Transaction {
  hash: string
  timestamp: number
  size: number
  protocol_version: number
}

interface BlockTransactionsListProps {
  height: number
  txCount: number
}

const ITEMS_PER_PAGE = 5

export function BlockTransactionsList({ height, txCount }: BlockTransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const response = await blockAPI.getBlockTransactions(height, ITEMS_PER_PAGE, offset)
        setTransactions((response as { transactions: Transaction[] }).transactions || [])
      } catch (err) {
        console.error("Error fetching block transactions:", err)
        setError("Failed to load transactions")
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [height, offset])

  if (loading) {
    return <LoadingFallback />
  }

  if (error) {
    return <div className="text-center py-4 text-destructive"><p>{error}</p></div>
  }

  const columns = [
    {
      id: "txHash",
      header: "Tx Hash",
      accessor: (tx: Transaction) => (
        <HashLink hash={tx.hash} type="tx" truncate showCopy={false} />
      ),
    },
    {
      id: "size",
      header: "Size",
      accessor: (tx: Transaction) => (
        <span className="font-mono text-muted-foreground">{tx.size} B</span>
      ),
    },
    {
      id: "action",
      header: "Action",
      accessor: (tx: Transaction) => (
        <CopyButton text={tx.hash} className="h-4 w-4 text-muted-foreground" />
      ),
      className: "text-right w-[60px]"
    }
  ]

  const totalPages = Math.ceil(txCount / ITEMS_PER_PAGE)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 9

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      let start = Math.max(2, currentPage - 3)
      let end = Math.min(totalPages - 1, currentPage + 3)

      if (currentPage <= 4) end = Math.min(maxVisible - 1, totalPages - 1)
      if (currentPage >= totalPages - 3) start = Math.max(2, totalPages - (maxVisible - 2))
      if (start > 2) pages.push('...')

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  const pages = getPageNumbers()

  return (
    <div className="space-y-4">
      <DataTable data={transactions} columns={columns} emptyMessage="No transactions found" getRowKey={(tx) => tx.hash} />

      {totalPages > 1 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-1">
            {pages.map((page, index) => {
              if (page === '...') return <span key={`ellipsis-${index}`} className="px-3 py-2 text-muted-foreground">...</span>

              const pageNum = page as number
              const isActive = pageNum === currentPage

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`min-w-[32px] h-[32px] text-sm flex items-center justify-center rounded-sm transition-colors font-medium border ${isActive
                      ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                      : 'bg-card border-border text-foreground hover:bg-muted'
                    }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Showing {transactions.length} of {txCount} transactions
          </div>
        </div>
      )}
    </div>
  )
}

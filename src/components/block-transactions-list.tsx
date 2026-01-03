"use client"

import { useEffect, useState } from "react"
import { blockAPI } from "@/lib/api"
import Link from "next/link"
import { CopyButton } from "@/components/ui/copy-button"
import { LoadingFallback } from "@/components/loading-fallback"

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
  const [currentPage, setCurrentPage] = useState(1) // 1-based for easier UI

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
    return (
      <div className="text-center py-8 text-red-400">
        <p>{error}</p>
      </div>
    )
  }

  if (transactions.length === 0 && currentPage === 1) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No transactions found</p>
      </div>
    )
  }

  const totalPages = Math.ceil(txCount / ITEMS_PER_PAGE)

  // Generate page numbers
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

      if (currentPage <= 4) {
        end = Math.min(maxVisible - 1, totalPages - 1)
      }

      if (currentPage >= totalPages - 3) {
        start = Math.max(2, totalPages - (maxVisible - 2))
      }

      if (start > 2) {
        pages.push('...')
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages - 1) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  const pages = getPageNumbers()

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-3 px-2 text-muted-foreground font-medium">Hash</th>
              <th className="text-right py-3 px-2 text-muted-foreground font-medium">Size</th>
              <th className="text-right py-3 px-2 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.hash} className="border-b border-border/30 hover:bg-muted/50 transition-colors">
                <td className="py-3 px-2">
                  <Link href={`/tx/${tx.hash}`} className="font-mono text-blue-400 hover:text-blue-300 break-all">
                    {tx.hash.slice(0, 24)}...{tx.hash.slice(-16)}
                  </Link>
                </td>
                <td className="text-right py-3 px-2 font-mono text-muted-foreground">{tx.size} bytes</td>
                <td className="text-right py-3 px-2">
                  <CopyButton text={tx.hash} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Numbered Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-1">
            {pages.map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-muted-foreground"
                  >
                    ...
                  </span>
                )
              }

              const pageNum = page as number
              const isActive = pageNum === currentPage

              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum)
                  }}
                  className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-md border transition-colors font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/50 to-purple-600/50 border-blue-500/30 text-foreground hover:from-blue-600/70 hover:to-purple-600/70'
                      : 'bg-card/50 border-border text-foreground hover:bg-card/70'
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

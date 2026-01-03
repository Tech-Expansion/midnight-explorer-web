"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils"
import { transactionAPI } from "@/lib/api"
import { Pagination, SimplePagination } from "@/components/pagination"
import { useNetworkStats } from "@/hooks/useNetworkStats"
import { Transaction } from "@/lib/transaction-types"

interface TransactionsListProps {
  initialCursor?: string
  searchHash?: string
  searchPage?: number
}

export function TransactionsList({ initialCursor, searchHash, searchPage = 1 }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [nextCursor, setNextCursor] = useState<string | undefined>()
  const [pagination, setPagination] = useState<{ page: number; pageSize: number; totalCount: number; totalPages: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const { totalTransactions } = useNetworkStats()

  const searchMode = !!searchHash
  const pageSize = 20

  // Calculate total pages from totalTransactions
  const totalPages = totalTransactions ? Math.ceil(totalTransactions / pageSize) : 0

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        if (searchHash) {
          // Search mode
          const response: { data: Transaction[]; pagination?: { page: number; pageSize: number; totalCount: number; totalPages: number } } = await transactionAPI.searchTransactions(searchHash, searchPage, pageSize)
          setTransactions(response.data)
          setPagination(response.pagination || null)
        } else {
          // Normal mode with cursor
          const response: { items: Transaction[]; nextCursor?: string } = await transactionAPI.getTransactions(initialCursor)
          setTransactions(response.items)
          setNextCursor(response.nextCursor)
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [initialCursor, searchHash, searchPage])

  const getVariantBadge = (variant?: Transaction['variant']) => {
    switch (variant) {
      case "Regular":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            {variant}
          </Badge>
        )
      case "System":
        return (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            {variant}
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card className="bg-card/50 border-border p-8">
        <p className="text-center text-muted-foreground">Loading transactions...</p>
      </Card>
    )
  }

  return (
    <>
      {/* Transactions Table */}
      <Card className="bg-card/50 border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Txn Hash</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Variant</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Block</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Protocol</th>
                <th className="text-center pr-24 p-4 text-sm font-semibold text-muted-foreground">Age</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Size</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx: Transaction, index: number) => (
                  <tr key={tx.id || `${tx.hash}-${index}`} className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                    <td className="p-4">
                      <Link
                        href={`/tx/${tx.hash}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors font-mono text-sm"
                      >
                        {tx.hash}
                      </Link>
                    </td>
                    <td className="p-4">{getVariantBadge(tx.variant)}</td>
                    <td className="p-4">
                      {tx.blockId ? (
                        <Link
                          href={`/block/${tx.blockId}`}
                          className="text-purple-400 hover:text-purple-300 transition-colors font-mono text-sm"
                        >
                          #{tx.blockId}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground text-sm">Pending</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground font-mono">
                        v{tx.protocolVersion}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {tx.timestamp ? formatDateTime(new Date(parseInt(String(tx.timestamp)))) : "N/A"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {tx.size ? `${tx.size} B` : "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="pb-8">
        {searchMode && pagination ? (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            buildUrl={(page) => `/transactions?hash=${searchHash}&page=${page}`}
            className="mt-4"
          />
        ) : totalPages > 0 ? (
          <Pagination
            currentPage={searchPage}
            totalPages={totalPages}
            buildUrl={(page) => `/transactions?page=${page}`}
            className="mt-4"
          />
        ) : (
          <SimplePagination
            hasPrev={!!initialCursor}
            hasNext={!!nextCursor}
            prevUrl="/transactions"
            nextUrl={nextCursor ? `/transactions?cursor=${nextCursor}` : undefined}
            className="mt-4"
          />
        )}
      </div>
    </>
  )
}

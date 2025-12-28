"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { formatDateTime } from "@/lib/utils"
import { transactionAPI } from "@/lib/api"
import { Pagination, SimplePagination } from "@/components/pagination"
import { useNetworkStats } from "@/hooks/useNetworkStats"

interface Transaction {
  id?: string
  hash: string
  status: 'success' | 'failed' | 'failure'
  blockHeight?: number
  protocolVersion: number
  timestamp?: string | number
  size?: number
}

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

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Success 
          </Badge>
        )
      case "failed":
      case "failure":
        return (
          <Badge className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
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
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Status</th>
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
                        0x{tx.hash}
                      </Link>
                    </td>
                    <td className="p-4">{getStatusBadge(tx.status)}</td>
                    <td className="p-4">
                      {tx.blockHeight ? (
                        <Link
                          href={`/block/${tx.blockHeight}`}
                          className="text-purple-400 hover:text-purple-300 transition-colors font-mono text-sm"
                        >
                          #{tx.blockHeight}
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

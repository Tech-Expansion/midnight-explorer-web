"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Waves, Globe } from "lucide-react"
import { poolAPI } from "@/lib/api"
import { ClickablePoolRow } from "@/components/clickable-pool-row"
import { Pagination } from "@/components/pagination"

interface BufferData {
  type: 'Buffer'
  data: number[]
}

interface PoolJson {
  name: string
  ticker: string
  homepage?: string
  description: string
}

interface Pool {
  id: number
  poolId: number
  tickerName: string
  hash: string | BufferData
  json: PoolJson
  bytes: BufferData
  pmrId: number
}

interface PaginationInfo {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

interface PoolsListProps {
  initialPage?: number
  pageSize?: number
  searchQuery?: string
}

export function PoolsList({ initialPage = 1, pageSize = 20, searchQuery = '' }: PoolsListProps) {
  const [pools, setPools] = useState<Pool[]>([])
  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: pageSize,
    totalCount: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response: { data?: Pool[]; pagination?: PaginationInfo } = await poolAPI.getPools(
          initialPage.toString(),
          pageSize.toString(),
          searchQuery
        )
        
        if (response) {
          const poolData = response.data || []
          if (Array.isArray(poolData)) {
            setPools(poolData.filter(pool => pool && pool.json))
            setPagination(response.pagination || pagination)
          }
        }
      } catch (error) {
        console.error('Failed to fetch pools:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPage, pageSize, searchQuery])

  const buildPaginationUrl = (targetPage: number) => {
    const params = new URLSearchParams()
    params.set('page', targetPage.toString())
    params.set('pageSize', pageSize.toString())
    if (searchQuery) params.set('q', searchQuery)
    return `/pool?${params.toString()}`
  }

  if (loading) {
    return (
      <Card className="bg-card/50 border-border p-8">
        <p className="text-center text-muted-foreground">Loading pools...</p>
      </Card>
    )
  }

  return (
    <>
      {pools.length > 0 ? (
        <>
          <Card className="bg-card/50 border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      ID
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Ticker
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pools.map((pool: Pool) => (
                    <ClickablePoolRow key={pool.id} id={pool.id}>
                      <td className="p-4">
                        <Badge variant="outline" className="font-mono group-hover:bg-blue-500/20">
                          #{pool.id}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-mono group-hover:bg-blue-500/30"
                        >
                          {pool.json?.ticker || 'N/A'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium group-hover:text-blue-400 transition-colors">
                            {pool.json?.name || 'Unknown Pool'}
                          </span>
                          {pool.json?.homepage && (
                            <Globe className="h-3 w-3 text-blue-400 group-hover:text-blue-300" />
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-muted-foreground line-clamp-2 max-w-md group-hover:text-foreground transition-colors">
                          {pool.json?.description || 'No description available'}
                        </p>
                      </td>
                    </ClickablePoolRow>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          <div className="space-y-4 pb-8">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              buildUrl={buildPaginationUrl}
              className="mt-4"
            />
            
          </div>
        </>
      ) : (
        <Card className="p-12 bg-card/50 border-border text-center">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-500/10 inline-block">
              <Waves className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-400">No Pools Found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery 
                  ? `No pools matching "${searchQuery}" were found.`
                  : 'No stake pools are available at the moment.'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}

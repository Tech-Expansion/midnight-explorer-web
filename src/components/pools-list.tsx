"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Waves } from "lucide-react"
import { poolAPI } from "@/lib/api"
import { Pagination } from "@/components/pagination"
import { Pool, PoolsResponse } from "@/lib/types"

interface PoolsListProps {
  initialPage?: number
  pageSize?: number
  searchQuery?: string
}

export function PoolsList({ initialPage = 1, pageSize = 20, searchQuery = '' }: PoolsListProps) {
  const router = useRouter()
  const [pools, setPools] = useState<Pool[]>([])
  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: pageSize,
    total: 0,
    hasMore: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        if (searchQuery) {
          // Search mode: use searchPools API
          const searchResults = await poolAPI.searchPools(searchQuery)
          if (Array.isArray(searchResults) && searchResults.length > 0) {
            setPools(searchResults)
            setPagination({
              page: 1,
              pageSize: searchResults.length,
              total: searchResults.length,
              hasMore: false
            })
          } else {
            setPools([])
            setPagination({
              page: 1,
              pageSize: pageSize,
              total: 0,
              hasMore: false
            })
          }
        } else {
          // Browse mode: use getPools API with pagination
          const response: PoolsResponse = await poolAPI.getPools(
            initialPage.toString(),
            pageSize.toString()
          )
          
          if (response && response.pools) {
            setPools(response.pools)
            setPagination({
              page: response.page,
              pageSize: response.pageSize,
              total: response.total,
              hasMore: response.hasMore
            })
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

  const getTotalPages = () => {
    return Math.ceil(pagination.total / pagination.pageSize)
  }

  const getPoolName = (pool: Pool): string => {
    if (pool.poolOffchainData?.name) {
      return pool.poolOffchainData.name
    }
    // Fallback to shortened auraPublicKey if no name
    if (!pool.auraPublicKey) return 'Unknown Pool'
    return `${pool.auraPublicKey.slice(0, 12)}...${pool.auraPublicKey.slice(-8)}`
  }

  const getAuraPublicKey = (pool: Pool): string => {
    if (!pool.auraPublicKey) return 'N/A'
    return `${pool.auraPublicKey.slice(0, 12)}...${pool.auraPublicKey.slice(-8)}`
  }

  const getBlocksMinted = (pool: Pool): string => {
    return pool.blocksMinted.toLocaleString()
  }

  const limitWords = (text: string, wordLimit: number = 10): string => {
    const words = text.split(' ')
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...'
    }
    return text
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
          {/* Pools Table - Desktop */}
          <div className="hidden md:block">
            <Card className="bg-card/50 border-border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                        Pool Name
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground ml-0">
                        Aura Public Key
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground ml-0">
                      Blocks Minted
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pools.map((pool: Pool) => {
                      return (
                        <tr 
                          key={pool.auraPublicKey} 
                          className="border-b border-border/50 hover:bg-accent/5 transition-colors cursor-pointer"
                          onClick={() => router.push(`/pool/${pool.auraPublicKey}`)}
                        >
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-blue-400">
                                <span>{getPoolName(pool)}</span>
                                {pool.poolOffchainData?.ticker && (
                                  <Badge variant="outline" className="ml-2 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">
                                    [{pool.poolOffchainData.ticker}]
                                  </Badge>
                                )}
                              </div>
                              {pool.poolOffchainData?.description && (
                                <p className="text-xs text-muted-foreground">
                                  {limitWords(pool.poolOffchainData.description, 10)}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-left ml-0">
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 font-mono text-xs">
                              {getAuraPublicKey(pool)}
                            </Badge>
                          </td>
                          <td className="p-4 text-left ml-0">
                            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 font-mono">
                              {getBlocksMinted(pool)}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Pools Grid - Mobile */}
          <div className="md:hidden space-y-3">
            {pools.map((pool: Pool) => (
              <Card 
                key={pool.auraPublicKey} 
                className="bg-card/50 border-border p-4 cursor-pointer hover:bg-accent/5 transition-colors"
                onClick={() => router.push(`/pool/${pool.auraPublicKey}`)}
              >
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-blue-400">
                      <span>{getPoolName(pool)}</span>
                      {pool.poolOffchainData?.ticker && (
                        <Badge variant="outline" className="ml-2 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">
                          [{pool.poolOffchainData.ticker}]
                        </Badge>
                      )}
                    </div>
                    {pool.poolOffchainData?.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {limitWords(pool.poolOffchainData.description, 10)}
                      </p>
                    )}
                  </div>
                  <div className="border-t border-border/50 pt-2 space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Aura Public Key:</span>
                      <Badge variant="outline" className="mt-1 bg-purple-500/10 text-purple-400 border-purple-500/20 font-mono text-xs block w-fit">
                        {getAuraPublicKey(pool)}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Blocks Minted:</span>
                      <Badge variant="outline" className="mt-1 bg-green-500/10 text-green-400 border-green-500/20 font-mono block w-fit">
                        {getBlocksMinted(pool)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="space-y-4 pb-8">
            <Pagination
              currentPage={pagination.page}
              totalPages={getTotalPages()}
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

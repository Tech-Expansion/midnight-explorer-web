import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"
import { SearchBarPage } from "@/components/search-bar-page"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Waves, Globe } from "lucide-react"
import Link from "next/link"
import { poolAPI } from "@/lib/api"
import { ClickablePoolRow } from "@/components/clickable-pool-row"

export const dynamic = "force-dynamic"

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
  }
}

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

interface ApiResponse {
  data: Pool[]   // Backend always returns data array
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

interface PageProps {
  searchParams: Promise<{
    page?: string
    pageSize?: string
    q?: string  // Search query
  }>
}

export default async function PoolPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams?.page || '1'
  const pageSize = resolvedSearchParams?.pageSize || '20'
  const searchQuery = resolvedSearchParams?.q || ''
  
  let pools: Pool[] = []
  let pagination = {
    page: parseInt(page),
    pageSize: parseInt(pageSize),
    totalCount: 0,
    totalPages: 0
  }
  let errorMessage = ''

  // Try to fetch pools from API, fall back to empty state if unavailable
  try {
    const response: ApiResponse = await poolAPI.getPools<ApiResponse>(page, pageSize, searchQuery)
    if (response) {
      const poolData = response.data || []
      if (Array.isArray(poolData)) {
        pools = poolData.filter(pool => pool && pool.json) // Filter out invalid pools
        pagination = response.pagination || pagination
      }
    }
  } catch (error) {
    console.error('Failed to fetch pools:', error)
    errorMessage = error instanceof Error ? error.message : 'Failed to fetch pools'
  }

  const currentPage = parseInt(page)
  const prevPage = currentPage > 1 ? currentPage - 1 : null
  const nextPage = currentPage < pagination.totalPages ? currentPage + 1 : null

  // Build query string for pagination links
  const buildPaginationUrl = (targetPage: number) => {
    const params = new URLSearchParams()
    params.set('page', targetPage.toString())
    params.set('pageSize', pageSize)
    if (searchQuery) params.set('q', searchQuery)
    return `/pool?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 z-0">
        <Starfield />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {searchQuery ? 'Pool Search Results' : 'Stake Pools'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {searchQuery 
                ? `Showing results for "${searchQuery}"` 
                : 'Explore stake pools on the Midnight network'}
            </p>
          </div>

          {/* Search Bar */}
          <SearchBarPage searchType="pool" />

          {/* Clear Search Link */}
          {searchQuery && (
            <div className="flex items-center gap-2">
              <Link 
                href="/pool" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← Clear search and show all pools
              </Link>
            </div>
          )}

          {/* Note: Error handling is silent - shows empty state instead of error message for better UX */}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Waves className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{pagination.totalCount}</p>
                  <p className="text-xs text-muted-foreground">
                    {searchQuery ? 'Matching Pools' : 'Total Pools'}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Waves className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{pools.length}</p>
                  <p className="text-xs text-muted-foreground">Pools on this page</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card/50 border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Waves className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{pagination.totalPages}</p>
                  <p className="text-xs text-muted-foreground">Total Pages</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Pools Table */}
          {pools.length > 0 ? (
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

          {/* Pagination */}
          {pools.length > 0 && (
            <div className="flex justify-between items-center mt-4 pb-8">
              <div className="flex items-center gap-2">
                {prevPage && (
                  <Link
                    href={buildPaginationUrl(prevPage)}
                    className="px-4 py-2 bg-card/50 hover:bg-card/70 border border-border text-foreground rounded-md transition-colors inline-flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Link>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Page {pagination.page} of {pagination.totalPages}</span>
                <span>•</span>
                <span>{pagination.totalCount} {searchQuery ? 'matching' : 'total'} pools</span>
              </div>

              <div className="flex items-center gap-2">
                {nextPage && (
                  <Link
                    href={buildPaginationUrl(nextPage)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600/50 to-purple-600/50 hover:from-blue-600/70 hover:to-purple-600/70 border border-blue-500/30 text-foreground rounded-md transition-colors inline-flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { contractAPI } from "@/lib/api"
import { Pagination } from "@/components/pagination"

interface Contract {
  id: number
  address: string
  transactionId: string
  transactionHash?: string
  transactionhash?: string  // API response uses lowercase
  variant: 'Deploy' | 'Call'
}

interface ContractsListProps {
  initialCursor?: string
  page?: number
  searchAddress?: string
}

export function ContractsList({ initialCursor, page = 1, searchAddress }: ContractsListProps) {
  const searchParams = useSearchParams()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [totalContracts, setTotalContracts] = useState<number>(0)
  const [displayedContracts, setDisplayedContracts] = useState<Contract[]>([])
  const cursorMapRef = useRef<Record<number, string | undefined>>({ 1: initialCursor })

  const pageSize = 20
  const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page')!) : page
  const currentSearch = searchParams.get('search') || searchAddress

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        let contractsData: Contract[] = []
        
        if (currentSearch) {
          // Search by address
          const response: { contracts?: Contract[] } = await contractAPI.searchContractsByAddress(currentSearch)
          contractsData = response.contracts || []
          setTotalContracts(contractsData.length)
        } else {
          // Fetch contracts with cursor-based pagination
          const currentCursor = cursorMapRef.current[currentPage]
          const response: { items?: Contract[]; nextCursor?: string } = await contractAPI.getContracts(currentCursor)
          contractsData = response.items || []
          const nextCursorValue = response.nextCursor
          
          // Save nextCursor for next page (using ref, doesn't trigger re-render)
          if (nextCursorValue && currentPage + 1 > Object.keys(cursorMapRef.current).length) {
            cursorMapRef.current[currentPage + 1] = nextCursorValue
          }
          
          // Estimate total contracts from the first contract ID
          if (contractsData.length > 0 && currentPage === 1) {
            const firstId = contractsData[0].id
            setTotalContracts(firstId)
          }
        }
        
        // Map transactionhash to transactionHash for consistency
        const contractsWithHashes = contractsData.map((contract: Contract): Contract => ({
          ...contract,
          transactionHash: contract.transactionhash || contract.transactionHash
        }))
        
        setContracts(contractsWithHashes)
        
        // For search results, apply pagination
        if (currentSearch) {
          const startIdx = (currentPage - 1) * pageSize
          const endIdx = startIdx + pageSize
          setDisplayedContracts(contractsWithHashes.slice(startIdx, endIdx))
        } else {
          setDisplayedContracts(contractsWithHashes)
        }
      } catch (error) {
        console.error('Failed to fetch contracts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage, currentSearch])

  const totalPages = totalContracts > 0 ? Math.ceil(totalContracts / pageSize) : 0

  const SkeletonRow = () => (
    <tr className="border-b border-border/50 animate-pulse">
      <td className="p-4">
        <div className="h-4 bg-muted rounded w-3/4"></div>
      </td>
      <td className="p-4">
        <div className="h-5 bg-muted rounded w-16 mx-auto"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-muted rounded w-32"></div>
      </td>
      <td className="p-4">
        <div className="h-8 bg-muted rounded w-20 mx-auto"></div>
      </td>
    </tr>
  )

  const SkeletonMobileCard = () => (
    <Card className="bg-card/50 border-border p-4 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="flex items-center gap-2">
          <div className="h-3 bg-muted rounded w-10"></div>
          <div className="h-5 bg-muted rounded w-16 inline-block"></div>
        </div>
        <div className="border-t border-border/50 pt-2">
          <div className="h-3 bg-muted rounded w-20 mb-1"></div>
          <div className="h-4 bg-muted rounded w-32 mt-1"></div>
        </div>
        <div className="pt-2">
          <div className="h-9 bg-muted rounded w-full"></div>
        </div>
      </div>
    </Card>
  )

  return (
    <>
      {/* Contracts Table - Desktop */}
      <div className="hidden md:block">
        <Card className="bg-card/50 border-border">
          <div className="overflow-x-auto">
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '40%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '30%' }} />
                <col style={{ width: '15%' }} />
              </colgroup>
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    Contract Address
                  </th>
                  <th className="text-center p-4 text-sm font-semibold text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    Transaction
                  </th>
                  <th className="text-center p-4 text-sm font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <SkeletonRow key={`skeleton-${index}`} />
                  ))
                ) : (
                  displayedContracts.map((contract: Contract) => (
                    <tr
                      key={contract.id}
                      className="border-b border-border/50 hover:bg-accent/5 transition-colors"
                    >
                      <td className="p-4 truncate">
                        <Link
                          href={`/contracts/${contract.id}`}
                          className="font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors truncate block"
                          title={contract.address}
                        >
                          {contract.address}
                        </Link>
                      </td>
                      <td className="p-4 truncate">
                        <div className="flex justify-center">
                          <Badge
                            variant="outline"
                            className={
                              contract.variant === 'Deploy'
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            }
                          >
                            {contract.variant}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4 truncate">
                        {contract.transactionHash ? (
                          <Link
                            href={`/tx/${contract.transactionHash}`}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono truncate block"
                            title={contract.transactionHash}
                          >
                            {contract.transactionHash.slice(0, 16)}...
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground font-mono">
                            TX #{contract.transactionId}
                          </span>
                        )}
                      </td>
                      <td className="p-4 truncate">
                        <div className="flex justify-center">
                          <Link href={`/contracts/${contract.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-border hover:bg-accent/50"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Contracts Grid - Mobile */}
      <div className="md:hidden space-y-3">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <SkeletonMobileCard key={`skeleton-mobile-${index}`} />
          ))
        ) : (
          displayedContracts.map((contract: Contract) => (
          <Card key={contract.id} className="bg-card/50 border-border p-4">
            <div className="space-y-3">
              <Link
                href={`/contracts/${contract.id}`}
                className="font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors break-all font-semibold"
              >
                {contract.address}
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Type:</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    contract.variant === 'Deploy'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  }`}
                >
                  {contract.variant}
                </Badge>
              </div>
              <div className="border-t border-border/50 pt-2">
                <span className="text-xs text-muted-foreground">Transaction:</span>
                <div className="mt-1">
                  {contract.transactionHash ? (
                    <Link
                      href={`/tx/${contract.transactionHash}`}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono break-all"
                    >
                      {contract.transactionHash}
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono">
                      TX #{contract.transactionId}
                    </span>
                  )}
                </div>
              </div>
              <Link href={`/contracts/${contract.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-border hover:bg-accent/50 mt-2"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </Link>
            </div>
          </Card>
        ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          buildUrl={(p) => searchAddress ? `/contracts?search=${encodeURIComponent(searchAddress)}&page=${p}` : `/contracts?page=${p}`}
          className="mt-4 pb-8"
        />
      )}
    </>
  )
}

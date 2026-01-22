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

  if (loading) {
    return (
      <Card className="bg-card/50 border-border p-8">
        <p className="text-center text-muted-foreground">Loading contracts...</p>
      </Card>
    )
  }

  return (
    <>
      {/* Contracts Table */}
      <Card className="bg-card/50 border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                  Contract Address
                </th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                  Type
                </th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                  Transaction
                </th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedContracts.map((contract: Contract) => (
                <tr
                  key={contract.id}
                  className="border-b border-border/50 hover:bg-accent/5 transition-colors"
                >
                  <td className="p-4">
                    <Link
                      href={`/contracts/${contract.id}`}
                      className="font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors break-all"
                    >
                      {contract.address}
                    </Link>
                  </td>
                  <td className="p-4">
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
                  </td>
                  <td className="p-4">
                    {contract.transactionHash ? (
                      <Link
                        href={`/tx/${contract.transactionHash}`}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
                      >
                        {contract.transactionHash.slice(0, 16)}...
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground font-mono">
                        TX #{contract.transactionId}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { contractAPI, transactionAPI } from "@/lib/api"
import { Pagination } from "@/components/pagination"

interface Contract {
  id: string
  address: string
  transactionId: string
  transactionHash?: string
  variant: 'Deploy' | 'Call'
}

interface ContractsListProps {
  initialCursor?: string
  page?: number
}

export function ContractsList({ initialCursor, page = 1 }: ContractsListProps) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [totalContracts, setTotalContracts] = useState<number>(0)

  const pageSize = 20

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch contracts
        const response: { items?: Contract[]; nextCursor?: string } = await contractAPI.getContracts(initialCursor)
        const contractsData = response.items || []
        
        // Fetch transaction hashes for all contracts
        const contractsWithHashes = await Promise.all(
          contractsData.map(async (contract: Contract): Promise<Contract> => {
            try {
              const txData: { hash: string } = await transactionAPI.getTransactionById(contract.transactionId)
              return { ...contract, transactionHash: txData.hash }
            } catch (error) {
              console.error(`Failed to fetch hash for TX ${contract.transactionId}:`, error)
            }
            return contract
          })
        )
        
        setContracts(contractsWithHashes)
        
        // Estimate total contracts from the first contract ID (assuming sequential IDs)
        if (contractsWithHashes.length > 0) {
          const firstId = parseInt(contractsWithHashes[0].id)
          setTotalContracts(firstId)
        }
      } catch (error) {
        console.error('Failed to fetch contracts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [initialCursor])

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
              {contracts.map((contract: Contract) => (
                <tr
                  key={contract.id}
                  className="border-b border-border/50 hover:bg-accent/5 transition-colors"
                >
                  <td className="p-4">
                    <Link
                      href={`/contracts/${contract.address}`}
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
                    <Link href={`/contracts/${contract.address}`}>
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
          buildUrl={(p) => `/contracts?page=${p}`}
          className="mt-4 pb-8"
        />
      )}
    </>
  )
}

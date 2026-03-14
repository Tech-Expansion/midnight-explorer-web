"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import {
  checkBlock,
  checkTransaction,
  checkContract,
  searchPool,
  isContractAddress,
  isHexHash,
  isBlockHeight,
} from "@/lib/search-utils"
import { contractAPI } from "@/lib/api"
import { Contract } from "@/lib/types"

interface SearchBarProps {
  searchType?: "all" | "transaction" | "block" | "address" | "contract" | "pool"
}

export function SearchBarPage({ searchType = "all" }: SearchBarProps) {
  const [selectedType, setSelectedType] = useState<typeof searchType>(searchType)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const router = useRouter()

  const getPlaceholder = () => {
    switch (searchType) {
      case "block":
        return "Search by block height or hash..."
      case "transaction":
        return "Search by transaction hash..."
      case "address":
        return "Search by address..."
      case "contract":
        return "Search by contract address..."
      case "pool":
        return "Search by pool hash, ticker, or name..."
      default:
        return "Search by Hash / Height / Contract Address / Pool"
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    const cleanQuery = searchQuery.trim().replace(/,/g, '')
    setIsSearching(true)
    setSearchError(null)

    try {
      // If user selected Transaction
      if (selectedType === "transaction") {
        await verifyAndNavigate(cleanQuery, 'tx')
        return
      }

      // If user selected Block
      if (selectedType === "block") {
        await verifyAndNavigate(cleanQuery, 'block')
        return
      }

      // If user selected Address
      if (selectedType === "address") {
        router.push(`/address/${cleanQuery}`)
        setIsSearching(false)
        return
      }

      // If user selected Contract
      if (selectedType === "contract") { 
        if (isContractAddress(cleanQuery)) {
          try {
            const response = await contractAPI.searchContractsByAddress(cleanQuery)
        
            const contracts = (response as Record<string, Contract[]>).contracts || []
            
            if (contracts && contracts.length > 0) {
              router.push(`/contracts?search=${encodeURIComponent(cleanQuery)}`)
            } else {
              setSearchError('No contracts found for this address')
            }
          } catch (error) {
            console.error('Contract search error:', error)
            setSearchError('Contract search failed')
          }
        } else {
          setSearchError('Please enter a valid contract address')
        }
        setIsSearching(false)
        return
      }

      // If user selected Pool
      if (selectedType === "pool") {
        await searchAndNavigateToPool(cleanQuery)
        return
      }

      // If "all" is selected, smart detection
      if (selectedType === "all") {
        // Check if it looks like a tx/block hash (64 hex chars)
        if (isHexHash(cleanQuery)) {
          // Check TRANSACTION first
          const txResult = await checkTransaction(cleanQuery)
          if (txResult.found) {
            router.push(`/transactions?hash=${cleanQuery}`)
            setIsSearching(false)
            return
          }

          // Check CONTRACT second
          const contractResult = await checkContract(cleanQuery)
          if (contractResult.found) {
            router.push(`/contracts/${cleanQuery}`)
            setIsSearching(false)
            return
          }

          // Check BLOCK third
          const blockResult = await checkBlock(cleanQuery)
          if (blockResult.found && blockResult.height) {
            router.push(`/block/${blockResult.height}`)
            setIsSearching(false)
            return
          }

          // Try pool search as fallback
          const poolResult = await searchPool(cleanQuery)
          if (poolResult.found && poolResult.value) {
            router.push(`/pool/${poolResult.value}`)
            setIsSearching(false)
            return
          }

          setSearchError('Hash not found in transactions, contracts, blocks, or pools')
          setIsSearching(false)
          return
        }

        // Check if it's a contract address (64 chars without 0x, or 66 chars with 0x)
        if (isContractAddress(cleanQuery)) {
          //console.log('[All Mode] Detected contract address:', cleanQuery)
          try {
            const response = await contractAPI.searchContractsByAddress(cleanQuery)
            //console.log('[All Mode] Contract API response:', response)
            const contracts = (response as Record<string, Contract[]>).contracts || []
            
            if (contracts && contracts.length > 0) {
              router.push(`/contracts?search=${encodeURIComponent(cleanQuery)}`)
              setIsSearching(false)
              return
            }
          } catch (error) {
            console.error('Contract search error in all mode:', error)
          }
          setSearchError('No contracts found for this address')
          setIsSearching(false)
          return
        }

        // Check if it's a number (block height)
        if (isBlockHeight(cleanQuery)) {
          const result = await checkBlock(cleanQuery)
          if (result.found) {
            router.push(`/block/${result.height || cleanQuery}`)
            setIsSearching(false)
            return
          }
          setSearchError('Block not found')
          setIsSearching(false)
          return
        }

        // If not a hex hash, try pool search (for ticker/name)
        const poolResult = await searchPool(cleanQuery)
        if (poolResult.found) {
          if (poolResult.count === 1 && poolResult.value) {
            router.push(`/pool/${poolResult.value}`)
          } else {
            router.push(`/pool?q=${encodeURIComponent(cleanQuery)}`)
          }
          setIsSearching(false)
          return
        }

        setSearchError('No results found. Please enter a valid block height, transaction hash, contract address, or pool name/ticker')
        setIsSearching(false)
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchError('Search failed. Please try again.')
      setIsSearching(false)
    }
  }

  const verifyAndNavigate = async (query: string, type: 'tx' | 'block' | 'contract') => {
    if (type === 'block') {
      const result = await checkBlock(query)
      if (result.found && result.height) {
        router.push(`/block/${result.height}`)
      } else {
        setSearchError('Block not found')
      }
    } else if (type === 'contract') {
      const result = await checkContract(query)
      if (result.found) {
        router.push(`/contracts/${query}`)
      } else {
        setSearchError('Contract not found')
      }
    } else {
      const result = await checkTransaction(query)
      if (result.found) {
        // Always navigate to transactions page to show all matching transactions
        router.push(`/transactions?hash=${query}`)
      } else {
        setSearchError('Transaction not found')
      }
    }
    
    setIsSearching(false)
  }

  const searchAndNavigateToPool = async (query: string) => {
    // Check if query looks like a pool hash (64 hex chars)
    const isPoolHash = isHexHash(query)
    
    const result = await searchPool(query)
    
    if (result.found) {
      // If it's a hash and found exactly 1 pool, navigate directly to pool detail
      if (isPoolHash && result.count === 1 && result.value) {
        router.push(`/pool/${result.value}`)
      } else {
        // For ticker/name search or multiple results, show list
        router.push(`/pool?q=${encodeURIComponent(query)}`)
      }
    } else {
      setSearchError('Pool not found')
    }
    
    setIsSearching(false)
  }

  return (
    <form onSubmit={handleSearch}>
      <Card className="bg-card/50 border-border p-4">
        <div className="flex flex-col sm:flex-row gap-2">
            {searchType === "all" && (
              <Select value={selectedType} onValueChange={(val) => setSelectedType(val as typeof searchType)}>
                <SelectTrigger className="w-full sm:w-[180px] bg-card border-border">
                  <SelectValue placeholder="Search type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="transaction">Transaction</SelectItem>
                  <SelectItem value="block">Block</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="pool">Pool</SelectItem>
                </SelectContent>
              </Select>
            )}

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={getPlaceholder()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSearching}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 
             hover:from-blue-700 hover:to-purple-700 cursor-pointer 
             disabled:opacity-50 disabled:cursor-not-allowed text-white" >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Error Message */}
          {searchError && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-md">
              <p className="text-red-400 text-sm">{searchError}</p>
            </div>
          )}
        </Card>
      </form>
  )
}
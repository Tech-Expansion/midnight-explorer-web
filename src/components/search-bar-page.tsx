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
  searchPool,
  isHexHash,
} from "@/lib/search-utils"

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
      // case "pool":
      //   return "Search by pool hash, ticker, or name..."
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
      // Pool is handled separately since it's not in lite/search
      if (selectedType === "pool") {
        await searchAndNavigateToPool(cleanQuery)
        return
      }
      
      // If user selected Address explicitly
      if (selectedType === "address") {
        router.push(`/address/${cleanQuery}`)
        setIsSearching(false)
        return
      }

      // For All, Transaction, Block, Contract
      try {
        const typeParam = selectedType === "all" ? "all" : selectedType;
        const searchResponse = await fetch(`/api/lite/search?hash=${encodeURIComponent(cleanQuery)}&type=${typeParam}`);
        
        if (searchResponse.ok) {
           const json = await searchResponse.json();
           const resData = (json && typeof json === 'object' && 'isSuccess' in json && 'data' in json) ? json.data : json;
           
           if (!resData.error) {
              if (resData.type === 'transaction') {
                 router.push(`/transactions?hash=${cleanQuery}`)
                 setIsSearching(false)
                 return
              }
              if (resData.type === 'block') {
                 const blockHeight = resData.data.block?.height ?? resData.data.height;
                 if (blockHeight !== undefined) {
                    router.push(`/block/${blockHeight}`)
                    setIsSearching(false)
                    return
                 }
              }
              if (resData.type === 'contract') {
                 const cData = resData.data.contract || resData.data;
                 const address = cData.address || cleanQuery;
                 router.push(`/contracts/${address}`)
                 setIsSearching(false)
                 return
              }
           }
        }
      } catch (error) {
         console.error('Unified search API error in page:', error);
      }

      // Fallback for Pool if "all"
      if (selectedType === "all") {
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
      }

      setSearchError(
        selectedType === "all" 
          ? 'No results found. Please enter a valid block height, transaction hash, contract address, or pool name/ticker' 
          : `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} not found`
      )
      setIsSearching(false)
    } catch (error) {
      console.error('Search error:', error)
      setSearchError('Search failed. Please try again.')
      setIsSearching(false)
    }
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
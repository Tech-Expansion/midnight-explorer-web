"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"

interface SearchBarProps {
  searchType?: "all" | "transaction" | "block" | "address" | "contract" | "pool"
}

export function SearchBarPage({ searchType = "all" }: SearchBarProps) {
  const [selectedType, setSelectedType] = useState<typeof searchType>(searchType)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
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

    const cleanQuery = searchQuery.trim()
    setIsSearching(true)

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
        router.push(`/contracts/${cleanQuery}`)
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
        // Check if it's a number (block height)
        if (/^\d+$/.test(cleanQuery)) {
          const result = await checkBlock(cleanQuery)
          if (result.found) {
            router.push(`/block/${result.height || cleanQuery}`)
            setIsSearching(false)
            return
          }
          alert('Block not found')
          setIsSearching(false)
          return
        }

        // Check if it's a contract address (70 chars without 0x, or 72 chars with 0x)
        const cleanHashForCheck = cleanQuery.startsWith("0x") 
          ? cleanQuery.slice(2) 
          : cleanQuery
        
        const isContractAddress = /^[a-fA-F0-9]{70}$/.test(cleanHashForCheck)
        
        if (isContractAddress) {
          router.push(`/contracts/${cleanQuery}`)
          setIsSearching(false)
          return
        }

        // Check if it looks like a block/tx hash (64 chars)
        const isHexHash = /^[a-fA-F0-9]{64}$/.test(cleanHashForCheck)

        if (isHexHash) {
          // Check BLOCK first
          const blockResult = await checkBlock(cleanQuery)
          if (blockResult.found && blockResult.height) {
            router.push(`/block/${blockResult.height}`)
            setIsSearching(false)
            return
          }

          // Check transaction (now uses search API)
          const txResult = await checkTransaction(cleanQuery)
          if (txResult.found) {
            // Navigate to transactions page to show all matching transactions
            router.push(`/transactions?hash=${cleanQuery}`)
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

          alert('Hash not found in blocks, transactions, or pools')
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

        alert('No results found. Please enter a valid block height, transaction hash, contract address, or pool name/ticker')
        setIsSearching(false)
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Search failed. Please try again.')
      setIsSearching(false)
    }
  }

  const checkBlock = async (query: string): Promise<{ found: boolean; height?: string }> => {
    const timeoutMs = 15000
    const cleanQuery = query.startsWith("0x") ? query.slice(2) : query
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

      const response = await fetch(`/api/blocks/${encodeURIComponent(cleanQuery)}`, {
        signal: controller.signal,
        cache: 'no-store'
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        return { found: false }
      }

      const data = await response.json()
      const height = data.block?.height ?? data.height
      const hash = data.block?.hash ?? data.hash
      const isSearchingByHeight = /^\d+$/.test(query)
      
      if (!isSearchingByHeight && hash) {
        const normalizedSearchHash = cleanQuery.toLowerCase()
        const normalizedReturnedHash = (hash.startsWith("0x") ? hash.slice(2) : hash).toLowerCase()
        
        if (normalizedSearchHash !== normalizedReturnedHash) {
          return { found: false }
        }
      }
      
      if (height !== undefined) {
        return { found: true, height: String(height) }
      }
      
      return { found: false }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('⏱️ Block check timeout')
      }
      return { found: false }
    }
  }

  const checkTransaction = async (query: string): Promise<{ found: boolean }> => {
    const timeoutMs = 15000
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

      const response = await fetch(`/api/transactions/${encodeURIComponent(query)}`, {
        signal: controller.signal,
        cache: 'no-store'
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        return { found: false }
      }

      const data = await response.json()
      
      // Check if transaction data exists
      if (data.transaction || data.hash) {
        return { found: true }
      }
      
      return { found: false }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
       // console.log('⏱️ Transaction check timeout')
      }
      return { found: false }
    }
  }

  const searchPool = async (query: string): Promise<{ found: boolean; value?: string; count?: number }> => {
    const timeoutMs = 15000
    
    try {
      const endpoint = '/api/pools/search'
      
      
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, timeoutMs)

      const response = await fetch(
        `${endpoint}?q=${encodeURIComponent(query)}`,
        { 
          signal: controller.signal,
          cache: 'no-store'
        }
      )
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
    //    console.log('❌ Pool search API returned error:', response.status)
        return { found: false }
      }

      const data = await response.json()
    
      
      if (data.data && data.data.length > 0) {
        return { found: true, value: data.data[0].id, count: data.data.length }
      }
      
      return { found: false }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
 //       console.log('⏱️ Pool search timeout')
      } else {
        console.error('❌ Pool search error:', error)
      }
      return { found: false }
    }
  }

  const verifyAndNavigate = async (query: string, type: 'tx' | 'block') => {
    if (type === 'block') {
      const result = await checkBlock(query)
      if (result.found && result.height) {
        router.push(`/block/${result.height}`)
      } else {
        alert('Block not found')
      }
    } else {
      const result = await checkTransaction(query)
      if (result.found) {
        // Always navigate to transactions page to show all matching transactions
        router.push(`/transactions?hash=${query}`)
      } else {
        alert('Transaction not found')
      }
    }
    
    setIsSearching(false)
  }

  const searchAndNavigateToPool = async (query: string) => {
    // Check if query looks like a pool hash (64 hex chars)
    const cleanQuery = query.startsWith("0x") ? query.slice(2) : query
    const isPoolHash = /^[a-fA-F0-9]{64}$/.test(cleanQuery)
    
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
      alert('Pool not found')
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
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </Card>
      </form>
  )
}
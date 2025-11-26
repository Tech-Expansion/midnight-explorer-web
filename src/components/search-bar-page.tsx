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
  searchType?: "all" | "transaction" | "block" | "address" | "contract"
}

export function SearchBarPage({ searchType = "all" }: SearchBarProps) {
  const [selectedType, setSelectedType] = useState<typeof searchType>(searchType)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  // Determine available search types based on current page
  const getAvailableTypes = () => {
    if (searchType === "all") {
      return [
        { value: "all", label: "All" },
        { value: "transaction", label: "Transaction" },
        { value: "block", label: "Block" },
        { value: "contract", label: "Contract" }
      ]
    }
    // Show only current type for specific pages
    return [{ value: searchType, label: searchType.charAt(0).toUpperCase() + searchType.slice(1) }]
  }

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
      default:
        return "Search by Hash / Height / Contract Address"
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

      // If "all" is selected, smart detection
      if (selectedType === "all") {
        // Check if it's a number (block height)
        if (/^\d+$/.test(cleanQuery)) {
          console.log('🔍 Detected block height:', cleanQuery)
          const result = await verifyHash(cleanQuery, 'block')
          if (result.found) {
            router.push(`/block/${result.value || cleanQuery}`)
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
          console.log('🔍 Detected contract address (70 chars):', cleanHashForCheck)
          // Navigate directly to contract page
          router.push(`/contracts/${cleanQuery}`)
          setIsSearching(false)
          return
        }

        // Check if it looks like a block/tx hash (64 chars)
        const isHexHash = /^[a-fA-F0-9]{64}$/.test(cleanHashForCheck)

        if (isHexHash) {
          console.log('🔍 Detected hash:', cleanHashForCheck)
          
          // Check BLOCK first (faster lookup)
          const blockResult = await verifyHash(cleanQuery, 'block')
          
          if (blockResult.found) {
            router.push(`/block/${blockResult.value}`)
            setIsSearching(false)
            return
          }

          // If not a block, check transaction
          const txResult = await verifyHash(cleanQuery, 'tx')

          if (txResult.found) {
            router.push(`/tx/${cleanQuery}`)
            setIsSearching(false)
            return
          }

          // Not found in blocks or transactions
          alert('Hash not found in blocks or transactions')
          setIsSearching(false)
          return
        }

        // Otherwise, show error
        alert('Invalid format. Please enter a valid block height, transaction hash, or contract address')
        setIsSearching(false)
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Search failed. Please try again.')
      setIsSearching(false)
    }
  }

  const verifyHash = async (query: string, type: 'tx' | 'block'): Promise<{ found: boolean; type?: string; value?: string }> => {
    const timeoutMs = 15000
    
    try {
      const endpoint = type === 'tx' ? '/api/transactions/verify' : '/api/blocks/verify'
      
      console.log(`🔍 Verifying ${type}:`, query)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, timeoutMs)

      const response = await fetch(
        `${endpoint}?hash=${encodeURIComponent(query)}`,
        { 
          signal: controller.signal,
          cache: 'no-store'
        }
      )
      
      clearTimeout(timeoutId)
      
      console.log(`✅ ${type} API response status:`, response.status)
      
      if (!response.ok) {
        console.log(`❌ ${type} API returned error:`, response.status)
        return { found: false }
      }

      const data = await response.json()
      console.log(`✅ ${type} API response:`, data)
      
      if (data.found) {
        return { found: true, type: data.type, value: data.value }
      }
      
      return { found: false }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('⏱️ Search timeout')
      } else {
        console.error('❌ Verify error:', error)
      }
      return { found: false }
    }
  }

  const verifyAndNavigate = async (query: string, type: 'tx' | 'block') => {
    const result = await verifyHash(query, type)
    
    if (result.found) {
      if (type === 'block' && result.value) {
        router.push(`/block/${result.value}`)
      } else {
        const path = type === 'tx' ? `/tx/${query}` : `/block/${query}`
        router.push(path)
      }
    } else {
      alert(`${type === 'tx' ? 'Transaction' : 'Block'} not found`)
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
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </Card>
      </form>
  )
}
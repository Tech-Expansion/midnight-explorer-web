"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export function SearchBar() {
  const [searchType, setSearchType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    const cleanQuery = searchQuery.trim()
    setIsSearching(true)

    try {
      // If user selected Transaction
      if (searchType === "transaction") {
        await verifyAndNavigate(cleanQuery, 'tx')
        return
      }

      // If user selected Block
      if (searchType === "block") {
        await verifyAndNavigate(cleanQuery, 'block')
        return
      }

      // If user selected Address
      if (searchType === "address") {
        router.push(`/address/${cleanQuery}`)
        setIsSearching(false)
        return
      }

      // If "all" is selected, smart detection
      if (searchType === "all") {
        // Check if it's a number (block height)
        if (/^\d+$/.test(cleanQuery)) {
          console.log('🔍 Detected block height:', cleanQuery)
          const result = await verifyHash(cleanQuery, 'block')
          if (result.found) {
            // Use the height from result, not the query
            router.push(`/block/${result.value || cleanQuery}`)
            setIsSearching(false)
            return
          }
          alert('Block not found')
          setIsSearching(false)
          return
        }

        // Check if it looks like a hash
        const cleanHashForCheck = cleanQuery.startsWith("0x") 
          ? cleanQuery.slice(2) 
          : cleanQuery
        
        const isHexHash = /^[a-fA-F0-9]{64}$/.test(cleanHashForCheck)

        if (isHexHash) {
          console.log('🔍 Detected hash:', cleanHashForCheck)
          
          // Check BLOCK first (faster lookup)
          const blockResult = await verifyHash(cleanQuery, 'block')
          
          if (blockResult.found) {
            // Navigate using height, not hash
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

          // Not found in either
          alert('Hash not found in blocks or transactions')
          setIsSearching(false)
          return
        }

        // Otherwise, treat as address
        router.push(`/address/${cleanQuery}`)
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
        // For blocks, use the height value returned from API
        router.push(`/block/${result.value}`)
      } else {
        // For transactions, use the original query (hash)
        const path = type === 'tx' ? `/tx/${query}` : `/block/${query}`
        router.push(path)
      }
    } else {
      alert(`${type === 'tx' ? 'Transaction' : 'Block'} not found`)
    }
    
    setIsSearching(false)
    return result
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSearch}>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-full sm:w-[180px] bg-card border-border">
              <SelectValue placeholder="Search type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="transaction">Transaction</SelectItem>
              <SelectItem value="block">Block</SelectItem>
              <SelectItem value="address">Address</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by Hash / Height / Address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
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
      </form>
    </div>
  )
}
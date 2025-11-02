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
        router.push(`/`)
        setIsSearching(false)
        return
      }

      // If "all" is selected, smart detection
      if (searchType === "all") {
        // Check if it's a number (block height)
        if (/^\d+$/.test(cleanQuery)) {
          await verifyAndNavigate(cleanQuery, 'block')
          return
        }

        // Check if it looks like a hash (0x... or hex string)
        const isHexHash = cleanQuery.startsWith("0x") || /^[a-fA-F0-9]{40,}$/.test(cleanQuery)

        if (isHexHash) {
          // Check BLOCK first (faster), then TX
          const blockResult = await verifyHash(cleanQuery, 'block')

          if (blockResult.found) {
            router.push(`/block/${cleanQuery}`)
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
          setIsSearching(false)
          return
        }

        // Otherwise, treat as address
        router.push(`/`)
        setIsSearching(false)
      }
    } catch (error) {
      console.error('Search error:', error)
      setIsSearching(false)
    }
  }

  const verifyHash = async (query: string, type: 'tx' | 'block'): Promise<{ found: boolean; type?: string; value?: string }> => {
    const timeoutMs = 15000
    
    try {
      const endpoint = type === 'tx' ? '/api/transactions/verify' : '/api/blocks/verify'
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, timeoutMs)

      const response = await fetch(
        `${endpoint}?hash=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      )
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        return { found: false }
      }

      const data = await response.json()
      
      if (data.found) {
        return { found: true, type, value: query }
      }
      
      return { found: false }
    } catch (error) {
      return { found: false }
    }
  }

  const verifyAndNavigate = async (query: string, type: 'tx' | 'block') => {
    const result = await verifyHash(query, type)
    
    if (result.found) {
      const path = type === 'tx' ? `/tx/${query}` : `/block/${query}`
      router.push(path)
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
              placeholder="Search by Transaction Hash / Block / Address"
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
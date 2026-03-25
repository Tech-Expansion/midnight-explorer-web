"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search, Waves, Box, ArrowRightLeft, FileCode } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import {
  searchPool,
  type PoolResult,
  type BlockResult,
  type TransactionResult,
  type ContractResult,
} from "@/lib/search-utils"
import {
  SEARCH_TYPE_ALL,
  SEARCH_TYPE_BLOCK,
  SEARCH_TYPE_TRANSACTION,
  SEARCH_TYPE_CONTRACT,
  SEARCH_TYPE_POOL,
  RESULT_TYPE_BLOCK,
  RESULT_TYPE_TRANSACTION,
  RESULT_TYPE_CONTRACT,
  RESULT_TYPE_POOL,
  RESULT_TYPE_VIEW_ALL,
  type SearchType,
} from "@/lib/constants/search.constants"

type SearchResult = 
  | { type: typeof RESULT_TYPE_BLOCK; block: BlockResult }
  | { type: typeof RESULT_TYPE_TRANSACTION; transaction: TransactionResult }
  | { type: typeof RESULT_TYPE_CONTRACT; contract: ContractResult }
  | { type: typeof RESULT_TYPE_POOL; pool: PoolResult }
  | { type: typeof RESULT_TYPE_VIEW_ALL; count: number; searchHash: string }

export function SearchBar() {
    const [searchType, setSearchType] = useState<SearchType>(SEARCH_TYPE_ALL)
    const [searchQuery,
        setSearchQuery] = useState("")
    const [isSearching,
        setIsSearching] = useState(false)
    const [searchResults,
        setSearchResults] = useState<SearchResult[]>([])
    const [showDropdown,
        setShowDropdown] = useState(false)
    const [searchError,
        setSearchError] = useState<string | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        const cleanQuery = searchQuery.trim().replace(/,/g, '')
        setIsSearching(true)
        setSearchResults([])
        setShowDropdown(false)
        setSearchError(null)

        try {
            const results: SearchResult[] = []

            // If user selected Pool (not supported by lite/search directly)
            if (searchType === SEARCH_TYPE_POOL) {
                const poolResult = await searchPool(cleanQuery)
                if (poolResult.found && poolResult.results) {
                    const displayPools = poolResult.results.slice(0, 5)
                    displayPools.forEach(pool => {
                        results.push({ type: RESULT_TYPE_POOL, pool })
                    })
                }
                if (results.length > 0) {
                    setSearchResults(results)
                    setShowDropdown(true)
                } else {
                    setSearchError('Pool not found')
                }
                setIsSearching(false)
                return
            }

            // For all other types (All, Block, Transaction, Contract), use the unified lite/search API
            try {
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), 15000)
                const typeParam = searchType === SEARCH_TYPE_ALL ? 'all' : searchType;
                
                const searchResponse = await fetch(`/api/lite/search?hash=${encodeURIComponent(cleanQuery)}&type=${typeParam}`, {
                    signal: controller.signal,
                    cache: 'no-store'
                })
                clearTimeout(timeoutId)

                if (searchResponse.ok) {
                    const json = await searchResponse.json();
                    const resData = (json && typeof json === 'object' && 'isSuccess' in json && 'data' in json) ? json.data : json;
                    
                    if (!resData.error) {
                        if (resData.type === 'transaction') {
                            results.push({ 
                                type: RESULT_TYPE_TRANSACTION, 
                                transaction: {
                                    hash: resData.data.hash,
                                    blockHeight: resData.data.block?.height,
                                    status: resData.data.transactionResult?.status ?? 'success'
                                } 
                            })
                        } else if (resData.type === 'block') {
                            results.push({ 
                                type: RESULT_TYPE_BLOCK, 
                                block: {
                                    hash: resData.data.block?.hash || resData.data.hash,
                                    height: resData.data.block?.height || resData.data.height,
                                    timestamp: resData.data.block?.timestamp || resData.data.timestamp
                                }
                            })
                        } else if (resData.type === 'contract') {
                            const cData = resData.data.contract || resData.data;
                            results.push({ 
                                type: RESULT_TYPE_CONTRACT, 
                                contract: {
                                    id: cData.id || '',
                                    address: cData.address || cleanQuery,
                                    variant: cData.variant || 'Contract'
                                }
                            })
                        }
                    }
                }
            } catch (error) {
                console.error('Unified search API error:', error)
            }

            // Fallback for Pool if SEARCH_TYPE_ALL and no results from unified search
            if (results.length === 0 && searchType === SEARCH_TYPE_ALL) {
                const poolResult = await searchPool(cleanQuery)
                if (poolResult.found && poolResult.results) {
                    const displayPools = poolResult.results.slice(0, 5)
                    displayPools.forEach(pool => {
                        results.push({ type: RESULT_TYPE_POOL, pool })
                    })
                }
            }

            if (results.length > 0) {
                setSearchResults(results)
                setShowDropdown(true)
            } else {
                setSearchError(
                  searchType === SEARCH_TYPE_ALL 
                    ? 'No results found. Please enter a valid block height, transaction hash, contract address, or pool name/ticker' 
                    : `${searchType.charAt(0).toUpperCase() + searchType.slice(1)} not found`
                )
            }
        } catch (error) {
            console.error('Search error:', error)
            setSearchError('Search failed. Please try again.')
        } finally {
            setIsSearching(false)
        }
    }

    const handleResultSelect = (result: SearchResult) => {
        setShowDropdown(false)
        setSearchQuery("")
        setSearchResults([])

        switch (result.type) {
            case RESULT_TYPE_BLOCK:
                if (result.block) {
                    router.push(`/block/${result.block.height}`)
                }
                break
            case RESULT_TYPE_TRANSACTION:
                if (result.transaction) {
                    router.push(`/tx/${result.transaction.hash}`)
                }
                break
            case RESULT_TYPE_CONTRACT:
                if (result.contract) {
                    router.push(`/contracts/${result.contract.id}`)
                }
                break
            case RESULT_TYPE_POOL:
                if (result.pool) {
                    router.push(`/pool/${result.pool.auraPublicKey}`)
                }
                break
            case RESULT_TYPE_VIEW_ALL:
                if (result.searchHash) {
                    router.push(`/transactions?hash=${result.searchHash}`)
                }
                break
        }
    }

    const getResultIcon = (type: SearchResult['type']) => {
        switch (type) {
            case RESULT_TYPE_BLOCK:
                return <Box className="h-4 w-4 text-purple-400" />
            case RESULT_TYPE_TRANSACTION:
                return <ArrowRightLeft className="h-4 w-4 text-green-400" />
            case RESULT_TYPE_CONTRACT:
                return <FileCode className="h-4 w-4 text-orange-400" />
            case RESULT_TYPE_POOL:
                return <Waves className="h-4 w-4 text-blue-400" />
            case RESULT_TYPE_VIEW_ALL:
                return <ArrowRightLeft className="h-4 w-4 text-blue-400" />
        }
    }

    const getResultBgColor = (type: SearchResult['type']) => {
        switch (type) {
            case RESULT_TYPE_BLOCK:
                return 'bg-purple-500/10'
            case RESULT_TYPE_TRANSACTION:
                return 'bg-green-500/10'
            case RESULT_TYPE_CONTRACT:
                return 'bg-orange-500/10'
            case RESULT_TYPE_POOL:
                return 'bg-blue-500/10'
            case RESULT_TYPE_VIEW_ALL:
                return 'bg-blue-500/10'
        }
    }

    const getResultTextColor = (type: SearchResult['type']) => {
        switch (type) {
            case RESULT_TYPE_BLOCK:
                return 'text-purple-400'
            case RESULT_TYPE_TRANSACTION:
                return 'text-green-400'
            case RESULT_TYPE_CONTRACT:
                return 'text-orange-400'
            case RESULT_TYPE_POOL:
                return 'text-blue-400'
            case RESULT_TYPE_VIEW_ALL:
                return 'text-blue-400'
        }
    }

    const renderResultItem = (result: SearchResult, index: number) => {
        let title = ''
        let subtitle = ''

        switch (result.type) {
            case RESULT_TYPE_BLOCK:
                title = `Block #${result.block
                    ?.height}`
                subtitle = result.block
                    ?.hash
                    ? `${result
                        .block
                        .hash
                        .slice(0, 16)}...`
                    : ''
                break
            case RESULT_TYPE_TRANSACTION:
                title = result.transaction
                    ?.blockHeight
                    ? `Transaction (Block #${result.transaction.blockHeight})`
                    : `Transaction`
                subtitle = result.transaction
                    ?.hash
                    ? `${result
                        .transaction
                        .hash
                        .slice(0, 20)}...`
                    : ''
                break
            case RESULT_TYPE_CONTRACT:
                title = `Contract`
                subtitle = result.contract
                    ?.address
                    ? `${result
                        .contract
                        .address
                        .slice(0, 20)}...`
                    : ''
                break
            case RESULT_TYPE_POOL:
                title = result.pool
                    ?.poolOffchainData
                    ?.ticker || 'Pool'
                subtitle = result.pool
                    ?.poolOffchainData
                    ?.name || `Pool ${result.pool
                        ?.auraPublicKey?.slice(0, 12)}...`
                break
            case RESULT_TYPE_VIEW_ALL:
                title = `View All ${result.count} Transactions`
                subtitle = `Click to see all transactions with this hash`
                break
        }

        return (
            <button
                key={`${result.type}-${index}`}
                onClick={() => handleResultSelect(result)}
                className="w-full px-3 py-2 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0 flex items-center gap-2">
                <div className={`p-1.5 rounded ${getResultBgColor(result.type)} shrink-0`}>
                    {getResultIcon(result.type)}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getResultTextColor(result.type)}`}>{title}</span>
                        <span className="text-xs text-muted-foreground capitalize">{result.type}</span>
                        {result.type === RESULT_TYPE_CONTRACT && result.contract?.variant && (
                            <Badge variant="outline" className="text-xs ml-auto">
                                {result.contract.variant}
                            </Badge>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate font-mono">{subtitle}</p>
                </div>
            </button>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch}>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={searchType} onValueChange={(value: string) => setSearchType(value as SearchType)}>
                        <SelectTrigger 
                            className="w-full sm:w-[180px] bg-card border-border"
                            suppressHydrationWarning
                        >
                            <SelectValue placeholder="Search type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={SEARCH_TYPE_ALL}>All</SelectItem>
                            <SelectItem value={SEARCH_TYPE_TRANSACTION}>Transaction</SelectItem>
                            <SelectItem value={SEARCH_TYPE_BLOCK}>Block</SelectItem>
                            <SelectItem value={SEARCH_TYPE_CONTRACT}>Contract</SelectItem>
                            <SelectItem value={SEARCH_TYPE_POOL}>Pool</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Input wrapper with dropdown */}
                    <div className="relative flex-1" ref={dropdownRef}>
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                        <Input
                            type="text"
                            placeholder="Search by Hash / Height / Contract Address / Pool Name / AuraPubkey"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value.replace(/,/g, ''))}
                            className="pl-10 bg-card border-border"
                            suppressHydrationWarning
                        /> {/* Search Results Dropdown */}
                        {showDropdown && searchResults.length > 0 && (
                            <div
                                className="absolute top-full left-0 right-0 mt-1 z-50 bg-card border border-border rounded-lg shadow-xl overflow-hidden">
                                <div className="px-3 py-2 border-b border-border bg-muted/30">
                                    <p className="text-xs text-muted-foreground">
                                        Found {searchResults.length}
                                        result{searchResults.length > 1
                                            ? 's'
                                            : ''}
                                        - Click to view
                                    </p>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {searchResults.map((result, index) => renderResultItem(result, index))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSearching}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 
             hover:from-blue-700 hover:to-purple-700 cursor-pointer 
             disabled:opacity-50 disabled:cursor-not-allowed text-white"
                        suppressHydrationWarning
                    >
                        {isSearching ? 'Searching...' : 'Search'}
                    </Button>

                </div>
            </form>

            {/* Error Message */}
            {searchError && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                    <p className="text-red-400 text-sm">{searchError}</p>
                </div>
            )}
        </div>
    )
}

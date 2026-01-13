"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search, Waves, Box, ArrowRightLeft, FileCode } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import {
  checkBlock,
  checkTransaction,
  checkContract,
  searchPool,
  isContractAddress,
  isHexHash,
  isBlockHeight,
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
        if (!searchQuery.trim())
            return

        const cleanQuery = searchQuery.trim().replace(/,/g, '')
        setIsSearching(true)
        setSearchResults([])
        setShowDropdown(false)
        setSearchError(null)

        try {
            const results: SearchResult[] = []

            // If user selected Transaction
            if (searchType === SEARCH_TYPE_TRANSACTION) {
                const txResult = await checkTransaction(cleanQuery)
                if (txResult.found && txResult.results && txResult.results.length > 0) {
                    const totalCount = txResult.count || txResult.results.length

                    // Show up to 5 in dropdown
                    const displayResults = txResult
                        .results
                        .slice(0, 5)
                    displayResults.forEach(tx => {
                        results.push({ type: RESULT_TYPE_TRANSACTION, transaction: tx })
                    })

                    // Add "View All" option if more than 5 results available
                    if (totalCount > 5) {
                        results.push({ type: RESULT_TYPE_VIEW_ALL, count: totalCount, searchHash: cleanQuery })
                    }

                    setSearchResults(results)
                    setShowDropdown(true)
                } else {
                    setSearchError('Transaction not found')
                }
                setIsSearching(false)
                return
            }

            // If user selected Block
            if (searchType === SEARCH_TYPE_BLOCK) {
                const blockResult = await checkBlock(cleanQuery)
                if (blockResult.found && blockResult.data) {
                    results.push({ type: RESULT_TYPE_BLOCK, block: blockResult.data })
                }
                if (results.length > 0) {
                    setSearchResults(results)
                    setShowDropdown(true)
                } else {
                    setSearchError('Block not found')
                }
                setIsSearching(false)
                return
            }

            // If user selected Contract
            if (searchType === SEARCH_TYPE_CONTRACT) {
                const contractResult = await checkContract(cleanQuery)
                if (contractResult.found && contractResult.data) {
                    results.push({ type: RESULT_TYPE_CONTRACT, contract: contractResult.data })
                }
                if (results.length > 0) {
                    setSearchResults(results)
                    setShowDropdown(true)
                } else {
                    setSearchError('Contract not found')
                }
                setIsSearching(false)
                return
            }

            // If user selected Pool
            if (searchType === SEARCH_TYPE_POOL) {
                const poolResult = await searchPool(cleanQuery)
                if (poolResult.found && poolResult.results) {
                    // Show up to 5 pools in dropdown
                    const displayPools = poolResult
                        .results
                        .slice(0, 5)
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

            // If "all" is selected, smart detection
            if (searchType === SEARCH_TYPE_ALL) {
                // Check if it looks like a tx/block/contract hash (64 or 66 chars)
                if (isHexHash(cleanQuery)) {
                    // Check TRANSACTION first using search API (same as transaction mode)
                    const txResult = await checkTransaction(cleanQuery)
                    if (txResult.found && txResult.results && txResult.results.length > 0) {
                        const totalCount = txResult.count || txResult.results.length

                        // Show up to 5 in dropdown
                        const displayResults = txResult
                            .results
                            .slice(0, 5)
                        displayResults.forEach(tx => {
                            results.push({ type: RESULT_TYPE_TRANSACTION, transaction: tx })
                        })

                        // Add "View All" option if more than 5 results available
                        if (totalCount > 5) {
                            results.push({ type: RESULT_TYPE_VIEW_ALL, count: totalCount, searchHash: cleanQuery })
                        }

                        setSearchResults(results)
                        setShowDropdown(true)
                        setIsSearching(false)
                        return
                    }

                    // Check CONTRACT second
                    const contractResult = await checkContract(cleanQuery)
                    if (contractResult.found && contractResult.data) {
                        results.push({ type: RESULT_TYPE_CONTRACT, contract: contractResult.data })
                        setSearchResults(results)
                        setShowDropdown(true)
                        setIsSearching(false)
                        return
                    }

                    // Check POOL third
                    const poolResult = await searchPool(cleanQuery)
                    if (poolResult.found && poolResult.results) {
                        const displayPools = poolResult.results.slice(0, 5)
                        displayPools.forEach(pool => {
                            results.push({ type: RESULT_TYPE_POOL, pool })
                        })
                        setSearchResults(results)
                        setShowDropdown(true)
                        setIsSearching(false)
                        return
                    }

                    // Check BLOCK fourth
                    const blockResult = await checkBlock(cleanQuery)
                    if (blockResult.found && blockResult.data) {
                        results.push({ type: RESULT_TYPE_BLOCK, block: blockResult.data })
                        setSearchResults(results)
                        setShowDropdown(true)
                        setIsSearching(false)
                        return
                    }

                    setSearchError('Hash not found in transactions, contracts, blocks, or pools')
                    setIsSearching(false)
                    return
                }

                // Check if it's a contract address (70 chars without 0x, or 72 chars with 0x)
                if (isContractAddress(cleanQuery)) {
                    const contractResult = await checkContract(cleanQuery)
                    if (contractResult.found && contractResult.data) {
                        results.push({ type: RESULT_TYPE_CONTRACT, contract: contractResult.data })
                    }
                    if (results.length > 0) {
                        setSearchResults(results)
                        setShowDropdown(true)
                    } else {
                        setSearchError('Contract not found')
                    }
                    setIsSearching(false)
                    return
                }

                // Check if it's a number (block height)
                if (isBlockHeight(cleanQuery)) {
                    const blockResult = await checkBlock(cleanQuery)
                    if (blockResult.found && blockResult.data) {
                        results.push({ type: RESULT_TYPE_BLOCK, block: blockResult.data })
                    }
                    if (results.length > 0) {
                        setSearchResults(results)
                        setShowDropdown(true)
                    } else {
                        setSearchError('Block not found')
                    }
                    setIsSearching(false)
                    return
                }

                // If not a hex hash or number, try pool search (for name/ticker)
                const poolResult = await searchPool(cleanQuery)
                if (poolResult.found && poolResult.results) {
                    // Show up to 5 pools in dropdown
                    const displayPools = poolResult.results.slice(0, 5)
                    displayPools.forEach(pool => {
                        results.push({ type: RESULT_TYPE_POOL, pool })
                    })
                }
                
                if (results.length > 0) {
                    setSearchResults(results)
                    setShowDropdown(true)
                } else {
                    setSearchError('No results found. Please enter a valid block height, transaction hash, contract address, or pool name/ticker')
                }
                setIsSearching(false)
            }
        } catch (error) {
            console.error('Search error:', error)
            setSearchError('Search failed. Please try again.')
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
                    router.push(`/contracts/${result.contract.address}`)
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

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

type SearchResult = | {
    type: 'block';
    block?: BlockResult
} | {
    type: 'transaction';
    transaction?: TransactionResult
} | {
    type: 'contract';
    contract?: ContractResult
} | {
    type: 'pool';
    pool?: PoolResult
} | {
    type: 'viewAll';
    count: number;
    searchHash: string
}

export function SearchBar() {
    const [searchType,
        setSearchType] = useState("all")
    const [searchQuery,
        setSearchQuery] = useState("")
    const [isSearching,
        setIsSearching] = useState(false)
    const [searchResults,
        setSearchResults] = useState<SearchResult[]>([])
    const [showDropdown,
        setShowDropdown] = useState(false)
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

        const cleanQuery = searchQuery.trim()
        setIsSearching(true)
        setSearchResults([])
        setShowDropdown(false)

        try {
            const results: SearchResult[] = []

            // If user selected Transaction
            if (searchType === "transaction") {
                const txResult = await checkTransaction(cleanQuery)
                if (txResult.found && txResult.results && txResult.results.length > 0) {
                    const totalCount = txResult.count || txResult.results.length

                    if (totalCount === 1) {
                        // Only one result, navigate directly
                        router.push(`/tx/${cleanQuery}`)
                    } else {
                        // Multiple results - show up to 5 in dropdown
                        const displayResults = txResult
                            .results
                            .slice(0, 5)
                        displayResults.forEach(tx => {
                            results.push({ type: 'transaction', transaction: tx })
                        })

                        // Add "View All" option if more than 5 results available
                        if (totalCount > 5) {
                            results.push({ type: 'viewAll', count: totalCount, searchHash: cleanQuery })
                        }

                        setSearchResults(results)
                        setShowDropdown(true)
                    }
                } else {
                    alert('Transaction not found')
                }
                setIsSearching(false)
                return
            }

            // If user selected Block
            if (searchType === "block") {
                const blockResult = await checkBlock(cleanQuery)
                if (blockResult.found && blockResult.data) {
                    results.push({ type: 'block', block: blockResult.data })
                }
                if (results.length > 0) {
                    setSearchResults(results)
                    setShowDropdown(true)
                } else {
                    alert('Block not found')
                }
                setIsSearching(false)
                return
            }

            // If user selected Contract
            if (searchType === "contract") {
                const contractResult = await checkContract(cleanQuery)
                if (contractResult.found && contractResult.data) {
                    results.push({ type: 'contract', contract: contractResult.data })
                }
                if (results.length > 0) {
                    setSearchResults(results)
                    setShowDropdown(true)
                } else {
                    alert('Contract not found')
                }
                setIsSearching(false)
                return
            }

            // If user selected Pool
            if (searchType === "pool") {
                const poolResult = await searchPool(cleanQuery)
                if (poolResult.found && poolResult.results) {
                    // Show up to 5 pools in dropdown
                    const displayPools = poolResult
                        .results
                        .slice(0, 5)
                    displayPools.forEach(pool => {
                        results.push({ type: 'pool', pool })
                    })
                }
                if (results.length > 0) {
                    setSearchResults(results)
                    setShowDropdown(true)
                } else {
                    alert('Pool not found')
                }
                setIsSearching(false)
                return
            }

            // If "all" is selected, smart detection
            if (searchType === "all") {
                // Check if it's a number (block height)
                if (isBlockHeight(cleanQuery)) {
                    const blockResult = await checkBlock(cleanQuery)
                    if (blockResult.found && blockResult.data) {
                        results.push({ type: 'block', block: blockResult.data })
                    }
                    if (results.length > 0) {
                        setSearchResults(results)
                        setShowDropdown(true)
                    } else {
                        alert('Block not found')
                    }
                    setIsSearching(false)
                    return
                }

                // Check if it's a contract address (70 chars without 0x, or 72 chars with 0x)
                if (isContractAddress(cleanQuery)) {
                    const contractResult = await checkContract(cleanQuery)
                    if (contractResult.found && contractResult.data) {
                        results.push({ type: 'contract', contract: contractResult.data })
                    }
                    if (results.length > 0) {
                        setSearchResults(results)
                        setShowDropdown(true)
                    } else {
                        alert('Contract not found')
                    }
                    setIsSearching(false)
                    return
                }

                // Check if it looks like a block/tx hash (64 chars)
                if (isHexHash(cleanQuery)) {
                    // Check all types in parallel
                    const [txResult,
                        poolResult,
                        blockResult] = await Promise.all([checkTransaction(cleanQuery), searchPool(cleanQuery), checkBlock(cleanQuery)])

                    if (blockResult.found && blockResult.data) {
                        results.push({ type: 'block', block: blockResult.data })
                    }

                    // Handle multiple transactions
                    if (txResult.found && txResult.results && txResult.results.length > 0) {
                        const totalCount = txResult.count || txResult.results.length

                        if (totalCount === 1) {
                            // Only one transaction, add to dropdown
                            results.push({ type: 'transaction', transaction: txResult.results[0] })
                        } else {
                            // Multiple transactions - show up to 5 in dropdown
                            const displayResults = txResult
                                .results
                                .slice(0, 5)
                            displayResults.forEach(tx => {
                                results.push({ type: 'transaction', transaction: tx })
                            })

                            // Add "View All" option if more than 5 results available
                            if (totalCount > 5) {
                                results.push({ type: 'viewAll', count: totalCount, searchHash: cleanQuery })
                            }
                        }
                    }

                    if (poolResult.found && poolResult.results) {
                        // Show up to 5 pools in dropdown
                        const displayPools = poolResult
                            .results
                            .slice(0, 5)
                        displayPools.forEach(pool => {
                            results.push({ type: 'pool', pool })
                        })
                    }

                    if (results.length > 0) {
                        setSearchResults(results)
                        setShowDropdown(true)
                    } else {
                        alert('Hash not found in blocks, transactions, or pools')
                    }
                    setIsSearching(false)
                    return
                }

                // Otherwise, show error
                alert('Invalid format. Please enter a valid block height, transaction hash, or contract' +
                    ' address')
                setIsSearching(false)
            }
        } catch (error) {
            console.error('Search error:', error)
            alert('Search failed. Please try again.')
            setIsSearching(false)
        }
    }

    const handleResultSelect = (result: SearchResult) => {
        setShowDropdown(false)
        setSearchQuery("")
        setSearchResults([])

        switch (result.type) {
            case 'block':
                if (result.block) {
                    router.push(`/block/${result.block.height}`)
                }
                break
            case 'transaction':
                if (result.transaction) {
                    router.push(`/tx/${result.transaction.hash}`)
                }
                break
            case 'contract':
                if (result.contract) {
                    router.push(`/contracts/${result.contract.address}`)
                }
                break
            case 'pool':
                if (result.pool) {
                    router.push(`/pool/${result.pool.id}`)
                }
                break
            case 'viewAll':
                if (result.searchHash) {
                    router.push(`/transactions?hash=${result.searchHash}`)
                }
                break
        }
    }

    const getResultIcon = (type: SearchResult['type']) => {
        switch (type) {
            case 'block':
                return <Box className="h-4 w-4 text-purple-400" />
            case 'transaction':
                return <ArrowRightLeft className="h-4 w-4 text-green-400" />
            case 'contract':
                return <FileCode className="h-4 w-4 text-orange-400" />
            case 'pool':
                return <Waves className="h-4 w-4 text-blue-400" />
            case 'viewAll':
                return <ArrowRightLeft className="h-4 w-4 text-blue-400" />
        }
    }

    const getResultBgColor = (type: SearchResult['type']) => {
        switch (type) {
            case 'block':
                return 'bg-purple-500/10'
            case 'transaction':
                return 'bg-green-500/10'
            case 'contract':
                return 'bg-orange-500/10'
            case 'pool':
                return 'bg-blue-500/10'
            case 'viewAll':
                return 'bg-blue-500/10'
        }
    }

    const getResultTextColor = (type: SearchResult['type']) => {
        switch (type) {
            case 'block':
                return 'text-purple-400'
            case 'transaction':
                return 'text-green-400'
            case 'contract':
                return 'text-orange-400'
            case 'pool':
                return 'text-blue-400'
            case 'viewAll':
                return 'text-blue-400'
        }
    }

    const renderResultItem = (result: SearchResult, index: number) => {
        let title = ''
        let subtitle = ''

        switch (result.type) {
            case 'block':
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
            case 'transaction':
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
            case 'contract':
                title = `Contract`
                subtitle = result.contract
                    ?.address
                    ? `${result
                        .contract
                        .address
                        .slice(0, 20)}...`
                    : ''
                break
            case 'pool':
                title = result.pool
                    ?.json
                    ?.ticker || result.pool
                        ?.tickerName || 'Pool'
                subtitle = result.pool
                    ?.json
                    ?.name || `Pool #${result.pool
                        ?.id}`
                break
            case 'viewAll':
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
                    <Select value={searchType} onValueChange={setSearchType}>
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

                    {/* Input wrapper with dropdown */}
                    <div className="relative flex-1" ref={dropdownRef}>
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                        <Input
                            type="text"
                            placeholder="Search by Hash / Height / Contract Address / Pool"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-card border-border" /> {/* Search Results Dropdown */}
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
             disabled:opacity-50 disabled:cursor-not-allowed text-white">
                        {isSearching ? 'Searching...' : 'Search'}
                    </Button>

                </div>
            </form>
        </div>
    )
}

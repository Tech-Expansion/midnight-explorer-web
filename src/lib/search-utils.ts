// Shared types for search functionality
export interface PoolResult {
  auraPublicKey: string
  blocksMinted: number
  mainchainPublicKey?: string
  poolOffchainData?: {
    name: string
    ticker: string
    homepage?: string
    description?: string
  }
}

export interface BlockResult {
  hash: string
  height: number
  timestamp?: number
  txCount?: number
}

export interface TransactionResult {
  hash: string
  blockHeight?: number
  status?: string
}

export interface ContractResult {
  address: string
  variant?: string
}

const DEFAULT_TIMEOUT_MS = 15000

/**
 * Check if a block exists by height or hash
 */
export async function checkBlock(query: string): Promise<{
  found: boolean
  height?: string
  data?: BlockResult
}> {
  const cleanQuery = query.startsWith("0x") ? query.slice(2) : query

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

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
      return {
        found: true,
        height: String(height),
        data: {
          hash: hash || query,
          height: Number(height),
          timestamp: data.block?.timestamp ?? data.timestamp,
          txCount: data.block?.txCount ?? data.txCount
        }
      }
    }

    return { found: false }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('⏱️ Block check timeout')
    }
    return { found: false }
  }
}

/**
 * Check if a transaction exists by hash
 */
export async function checkTransaction(query: string): Promise<{
  found: boolean
  data?: TransactionResult
  count?: number
  results?: TransactionResult[]
}> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

    const response = await fetch(
      `/api/transactions/search?hash=${encodeURIComponent(query)}&page=1&pageSize=20`,
      {
        signal: controller.signal,
        cache: 'no-store'
      }
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      return { found: false }
    }

    const responseData = await response.json()

    if (responseData.data && Array.isArray(responseData.data) && responseData.data.length > 0) {
      const transactions = responseData.data.map(
        (tx: { hash: string; blockHeight?: number; status?: string }) => ({
          hash: tx.hash || query,
          blockHeight: tx.blockHeight,
          status: tx.status ?? 'success'
        })
      )

      const totalCount = responseData.pagination?.totalCount || transactions.length

      return {
        found: true,
        data: transactions[0],
        count: totalCount,
        results: transactions
      }
    }

    return { found: false }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('⏱️ Transaction check timeout')
    }
    return { found: false }
  }
}

/**
 * Search for pools by query (hash, ticker, or name)
 * Returns pools matching the query
 */
export async function searchPool(query: string): Promise<{
  found: boolean
  value?: string
  count?: number
  results?: Array<{
    auraPublicKey: string
    blocksMinted: number
    mainchainPublicKey?: string
    poolOffchainData?: {
      name: string
      ticker: string
      homepage?: string
      description?: string
    }
  }>
}> {
  try {
    const { poolAPI } = await import('@/lib/api')
    
    const data = await poolAPI.searchPools<Array<{
      auraPublicKey: string
      blocksMinted: number
      mainchainPublicKey?: string
      poolOffchainData?: {
        name: string
        ticker: string
        homepage?: string
        description?: string
      }
    }>>(query)

    // API returns array directly
    if (Array.isArray(data) && data.length > 0) {
      return {
        found: true,
        value: data[0].auraPublicKey,
        count: data.length,
        results: data
      }
    }

    return { found: false }
  } catch (error) {
    console.error('❌ Pool search error:', error)
    return { found: false }
  }
}

/**
 * Check if a contract exists by address
 */
export async function checkContract(query: string): Promise<{
  found: boolean
  data?: ContractResult
}> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

    const response = await fetch(`/api/contracts/${encodeURIComponent(query)}`, {
      signal: controller.signal,
      cache: 'no-store'
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return { found: false }
    }

    const data = await response.json()

    if (data.contract || data.address) {
      return {
        found: true,
        data: {
          address: data.contract?.address ?? data.address ?? query,
          variant: data.contract?.variant ?? data.variant
        }
      }
    }

    return { found: false }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('⏱️ Contract check timeout')
    }
    return { found: false }
  }
}

/**
 * Helper function to determine if a string is a contract address (70 hex chars)
 */
export function isContractAddress(query: string): boolean {
  const cleanHash = query.startsWith("0x") ? query.slice(2) : query
  return /^[a-fA-F0-9]{70}$/.test(cleanHash)
}

/**
 * Helper function to determine if a string is a hex hash (64 hex chars)
 */
export function isHexHash(query: string): boolean {
  const cleanHash = query.startsWith("0x") ? query.slice(2) : query
  return /^[a-fA-F0-9]{64}$/.test(cleanHash)
}

/**
 * Helper function to determine if a string is a block height (numeric)
 */
export function isBlockHeight(query: string): boolean {
  return /^\d+$/.test(query)
}

/**
 * API client for Midnight Explorer
 * Works for both client-side and server-side rendering
 * 
 * @example
 * import { blockAPI, transactionAPI } from '@/lib/api'
 * 
 * const block = await blockAPI.getBlock(12345)
 * const transactions = await transactionAPI.getRecentTransactions()
 */

/**
 * Get the base URL for API calls
 * For server-side rendering, we need to construct the full URL
 * For client-side, we can use relative URLs
 */
function getApiBaseUrl(): string {
  // Server-side: construct URL based on Vercel URL or localhost
  if (typeof window === 'undefined') {
    // On Vercel
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api`
    }
    // Local development
    return `http://localhost:${process.env.PORT || 3000}/api`
  }
  // Client-side: use relative URL
  return '/api'
}

export const API_BASE_URL = getApiBaseUrl()

/**
 * Returns the standard API headers for Midnight Explorer API requests
 * Includes the API key from environment variables
 * Safe to use in both server and client components
 */
function getApiHeaders(): HeadersInit {
  // No API key needed - we're calling our own API routes
  return {}
}

/**
 * Creates a fetch configuration object with API headers and no-store cache
 * Useful for server-side API calls that need fresh data
 */
export function getApiFetchConfig(): RequestInit {
  return {
    cache: 'no-store',
    headers: getApiHeaders()
  }
}

/**
 * Generic API fetch wrapper with consistent error handling
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint}`
  const config: RequestInit = {
    cache: 'no-store',
    ...options,
    headers: {
      ...getApiHeaders(),
      ...options?.headers
    }
  }

  const response = await fetch(url, config)
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Block API methods
 */
export const blockAPI = {
  /**
   * Get a block by height or hash
   */
  getBlock: <T = unknown>(heightOrHash: string | number) =>
    apiFetch<T>(`/blocks/${heightOrHash}`),

  /**
   * Get recent blocks
   */
  getRecentBlocks: <T = unknown>() =>
    apiFetch<T>('/blocks/recent'),

  /**
   * Get blocks with pagination
   */
  getBlocks: <T = unknown>(cursor?: string) =>
    apiFetch<T>(`/blocks${cursor ? `?cursor=${cursor}` : ''}`),

  /**
   * Get transactions for a specific block
   */
  getBlockTransactions: <T = unknown>(height: string | number, params?: { limit?: number; offset?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset)
    const query = queryParams.toString()
    return apiFetch<T>(`/blocks/${height}/transactions${query ? `?${query}` : ''}`)
  }
}

/**
 * Transaction API methods
 */
export const transactionAPI = {
  /**
   * Get a transaction by hash (full detail)
   * Requires full 64-character hash
   * Returns single transaction with all details
   */
  getTransaction: <T = unknown>(hash: string) =>
    apiFetch<T>(`/transactions/${hash}`),

  /**
   * Search transactions by hash (partial or full)
   * Returns list with basic info and pagination
   * Used for search functionality
   */
  searchTransactions: <T = unknown>(hash: string, page?: number, pageSize?: number) => {
    const queryParams = new URLSearchParams()
    queryParams.append('hash', hash)
    if (page) queryParams.append('page', page.toString())
    if (pageSize) queryParams.append('pageSize', pageSize.toString())
    return apiFetch<T>(`/transactions/search?${queryParams.toString()}`)
  },

  /**
   * Get a transaction by ID
   */
  getTransactionById: <T = unknown>(id: string) =>
    apiFetch<T>(`/transactions/id/${id}`),

  /**
   * Get recent transactions
   */
  getRecentTransactions: <T = unknown>() =>
    apiFetch<T>('/transactions/recent'),

  /**
   * Get transactions with pagination
   */
  getTransactions: <T = unknown>(cursor?: string) =>
    apiFetch<T>(`/transactions${cursor ? `?cursor=${cursor}` : ''}`)
}

/**
 * Contract API methods
 */
export const contractAPI = {
  /**
   * Get a contract by address
   */
  getContract: <T = unknown>(address: string) =>
    apiFetch<T>(`/contracts/${address}`),

  /**
   * Get contracts with pagination
   */
  getContracts: <T = unknown>(cursor?: string) =>
    apiFetch<T>(`/contracts${cursor ? `?cursor=${cursor}` : ''}`)
}

/**
 * Network API methods
 */
export const networkAPI = {
  /**
   * Get network chart data for a specific time range
   * @param range - '1D' (1 day), '7D' (7 days), or '1M' (1 month) - defaults to '1D'
   */
  getChart: <T = unknown>(range: '1D' | '7D' | '1M' = '1D') =>
    apiFetch<T>(`/network/chart?range=${range}`)
}

/**
 * Token API methods
 */
export const tokenAPI = {
  /**
   * Get NIGHT token information from CoinMarketCap
   */
  getNightToken: <T = unknown>() =>
    apiFetch<T>('/token-night')
}
/**
 * Pool API methods
 */
export const poolAPI = {
  /**
   * Get all pools with pagination
   */
  getPools: <T = unknown>(page?: string, pageSize?: string, query?: string) => {
    const params = new URLSearchParams()
    if (page) params.append('page', page)
    if (pageSize) params.append('pageSize', pageSize)
    if (query) params.append('q', query)
    const queryString = params.toString()
    return apiFetch<T>(`/pool${queryString ? `?${queryString}` : ''}`)
  },

  /**
   * Search pools by query (name, ticker, or auraPublicKey)
   * Returns array of pools matching the query
   */
  searchPools: <T = unknown>(query: string) =>
    apiFetch<T>(`/pool/search?q=${encodeURIComponent(query)}`),

  /**
   * Get pool detail by aura public key
   */
  getPoolDetail: <T = unknown>(auraPublicKey: string) =>
    apiFetch<T>(`/pool/detail/${auraPublicKey}`),

  /**
   * Get a specific pool by ID
   */
  getPool: <T = unknown>(id: string) =>
    apiFetch<T>(`/pool/${id}`)
}
/**
 * Export getApiHeaders for direct use
 */
export { getApiHeaders }

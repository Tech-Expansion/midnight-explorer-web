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

import { fetchWithTokenRetry } from './token-client'
import { fetchServerToken } from './server-token'

const BACKEND_API_URL = process.env.API_URL || 'http://localhost:3002'
const API_VERSION = 'v1'

// Cache server token (valid for ~90 seconds)
let serverTokenCache: { token: string; expiresAt: number } | null = null

/**
 * Get cached or fetch new server token
 */
async function getServerToken(): Promise<string | null> {
  const now = Date.now()
  
  // Return cached token if still valid (with 10s buffer)
  if (serverTokenCache && serverTokenCache.expiresAt > now + 10000) {
    console.log('[API] Using cached server token')
    return serverTokenCache.token
  }
  
  // Fetch new token
  const token = await fetchServerToken()
  if (!token) return null
  
  // Cache for 90 seconds (token lives 120s, we refresh at 90s)
  serverTokenCache = {
    token,
    expiresAt: now + 90000
  }
  
  return token
}

/**
 * Get the base URL for API calls
 * Server-side: call backend directly (no token needed for public endpoints)
 * Client-side: call through Next.js proxy (with token)
 */
function getApiBaseUrl(): string {
  // Server-side: call backend directly
  if (typeof window === 'undefined') {
    return `${BACKEND_API_URL}/api/${API_VERSION}`
  }
  // Client-side: use Next.js proxy routes
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
 * Server-side: calls backend directly with server token
 * Client-side: calls through proxy with browser token
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint}`
  
  let config: RequestInit = {
    cache: 'no-store',
    ...options,
    headers: {
      ...getApiHeaders(),
      ...options?.headers
    }
  }

  // Server-side: add Authorization header with server token
  if (typeof window === 'undefined') {
    const token = await getServerToken()
    if (!token) {
      throw new Error('Failed to obtain server token')
    }
    
    config = {
      ...config,
      headers: {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      }
    }
    
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }

  // Client-side: use fetchWithTokenRetry through Next.js proxy
  const response = await fetchWithTokenRetry(url, config)
  
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
   * Get NIGHT token information from backend that will fetch from CoinMarketCap
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
    apiFetch<T>(`/pools/detail/${auraPublicKey}`),
}
/**
 * Export getApiHeaders for direct use
 */
export { getApiHeaders }

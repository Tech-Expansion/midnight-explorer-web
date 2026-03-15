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

const BACKEND_API_URL = process.env.API_URL || 'http://localhost:3002'
const API_VERSION = 'v1'

/**
 * Get the base URL for API calls
 * Server-side: call backend directly
 * Client-side: call through Next.js proxy routes
 */
function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return `${BACKEND_API_URL}/api/${API_VERSION}`
  }
  return '/api'
}

export const API_BASE_URL = getApiBaseUrl()

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
      'Content-Type': 'application/json',
      ...options?.headers,
    },
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
  getBlock: <T = unknown>(heightOrHash: string | number) =>
    apiFetch<T>(`/blocks/${heightOrHash}`),

  getRecentBlocks: <T = unknown>() =>
    apiFetch<T>('/blocks/recent'),

  getBlocks: <T = unknown>(cursor?: string) =>
    apiFetch<T>(`/blocks${cursor ? `?cursor=${cursor}` : ''}`),

  getBlockTransactions: <T = unknown>(height: string | number, limit?: number, offset?: number) => {
    const queryParams = new URLSearchParams()
    if (limit) queryParams.append('limit', limit.toString())
    if (offset !== undefined) queryParams.append('offset', offset.toString())
    const query = queryParams.toString()
    return apiFetch<T>(`/blocks/${height}/transactions${query ? `?${query}` : ''}`)
  },
}

/**
 * Transaction API methods
 */
export const transactionAPI = {
  getTransaction: <T = unknown>(hash: string) =>
    apiFetch<T>(`/transactions/${hash}`),

  verifyTransaction: <T = unknown>(hash: string) =>
    apiFetch<T>(`/transactions/verify?hash=${encodeURIComponent(hash)}`),

  searchTransactions: <T = unknown>(hash: string, page?: number, pageSize?: number) => {
    const queryParams = new URLSearchParams()
    queryParams.append('hash', hash)
    if (page) queryParams.append('page', page.toString())
    if (pageSize) queryParams.append('pageSize', pageSize.toString())
    return apiFetch<T>(`/transactions/search?${queryParams.toString()}`)
  },

  getTransactionById: <T = unknown>(id: string) =>
    apiFetch<T>(`/transactions/id/${id}`),

  getRecentTransactions: <T = unknown>() =>
    apiFetch<T>('/transactions/recent'),

  getTransactions: <T = unknown>(cursor?: string) =>
    apiFetch<T>(`/transactions${cursor ? `?cursor=${cursor}` : ''}`),
}

/**
 * Contract API methods
 */
export const contractAPI = {
  getContract: <T = unknown>(id: string | number) =>
    apiFetch<T>(`/contracts/${id}?Id=${id}`),

  getContracts: <T = unknown>(cursor?: string) =>
    apiFetch<T>(`/contracts${cursor ? `?cursor=${cursor}` : ''}`),

  searchContractsByAddress: <T = unknown>(address: string) =>
    apiFetch<T>(`/contracts/contract_actions?address=${encodeURIComponent(address)}`),
}

/**
 * Network API methods
 */
export const networkAPI = {
  getChart: <T = unknown>(range: '1D' | '7D' | '1M' = '1D') =>
    apiFetch<T>(`/network/chart?range=${range}`),

  getSidechainStatus: <T = unknown>() =>
    apiFetch<T>('/network/sidechainStatus'),
}

/**
 * Token API methods
 */
export const tokenAPI = {
  getNightToken: <T = unknown>() => apiFetch<T>('/token-night-v2'),
}

/**
 * Pool API methods
 */
export const poolAPI = {
  getPools: <T = unknown>(page?: string, pageSize?: string, query?: string) => {
    const params = new URLSearchParams()
    if (page) params.append('page', page)
    if (pageSize) params.append('pageSize', pageSize)
    if (query) params.append('q', query)
    const queryString = params.toString()
    return apiFetch<T>(`/pool${queryString ? `?${queryString}` : ''}`)
  },

  searchPools: <T = unknown>(query: string) =>
    apiFetch<T>(`/pool/search?q=${encodeURIComponent(query)}`),

  getPoolDetail: <T = unknown>(auraPublicKey: string) =>
    apiFetch<T>(`/pools/detail/${auraPublicKey}`),
}

// Legacy export for compatibility
export function getApiHeaders(): HeadersInit {
  return {}
}

export function getApiFetchConfig(): RequestInit {
  return { cache: 'no-store' }
}

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
/* eslint-disable @typescript-eslint/no-unused-vars */

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

  const result = await response.json()
  // Unwrap ResultDto: if response has the { data, isSuccess, license } envelope, return data.
  // Falls back to the raw response for any endpoint not yet wrapped (defensive).
  return (result !== null && typeof result === 'object' && 'isSuccess' in result && 'data' in result
    ? result.data
    : result) as T
}

/**
 * Block API methods
 */
export const blockAPI = {
  getBlock: <T = unknown>(heightOrHash: string | number) =>
    apiFetch<T>(`/lite/blocks/${heightOrHash}`),

  getRecentBlocks: <T = unknown>() =>
    Promise.resolve({ blocks: [] } as unknown as T),

  getBlocks: async <T = unknown>(cursor?: string) => {
    const query = cursor ? `?cursor=${cursor}` : ''
    return apiFetch<T>(`/blocks${query}`)
  },

  getBlockTransactions: <T = unknown>(height: string | number, _limit?: number, _offset?: number) => {
    return apiFetch<T>(`/lite/blocks/${height}`)
  },
}

/**
 * Transaction API methods
 */
export const transactionAPI = {
  getTransaction: <T = unknown>(hash: string) =>
    apiFetch<T>(`/lite/transactions/${hash}`),

  verifyTransaction: <T = unknown>(hash: string) =>
    apiFetch<T>(`/lite/transactions/${hash}`),

  searchTransactions: async <T = unknown>(hash: string, page?: number, pageSize?: number) => {
    const res = await apiFetch<{ type?: string; data?: unknown }>(`/lite/search?hash=${encodeURIComponent(hash)}`)
    if (res.type === 'transaction' && res.data) {
      return { 
        data: [res.data], 
        pagination: { page: page || 1, pageSize: pageSize || 20, totalCount: 1, totalPages: 1 } 
      } as unknown as T
    }
    return { data: [], pagination: null } as unknown as T
  },

  getTransactionById: <T = unknown>(id: string) =>
    apiFetch<T>(`/lite/transactions/${id}`),

  getRecentTransactions: <T = unknown>() =>
    apiFetch<T>('/transactions/recent'),

  getTransactions: async <T = unknown>(cursor?: string) => {
    const query = cursor ? `?cursor=${cursor}` : ''
    return apiFetch<T>(`/transactions${query}`)
  },
}

/**
 * Contract API methods
 */
export const contractAPI = {
  getContract: <T = unknown>(id: string | number) =>
    apiFetch<T>(`/lite/contracts/${id}`),

  getContracts: async <T = unknown>(_cursor?: string) => {
    return { items: [] } as unknown as T
  },

  searchContractsByAddress: async <T = unknown>(address: string) => {
    try {
      const res = await apiFetch<{ contract?: unknown }>(`/lite/contracts/${encodeURIComponent(address)}`)
      return { contracts: res.contract ? [res.contract] : [] } as unknown as T
    } catch {
      return { contracts: [] } as unknown as T
    }
  },
}

/**
 * Network API methods
 */
export const networkAPI = {
  getChart: <T = unknown>(range: '1D' | '7D' | '1M' = '1D') =>
    apiFetch<T>(`/networks/chart?range=${range}`),

  getSidechainStatus: <T = unknown>() =>
    apiFetch<T>('/networks/sidechainStatus'),

  getOverview: <T = unknown>() =>
    Promise.resolve({ latestBlock: null, totalTransactions: 0 } as unknown as T),
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

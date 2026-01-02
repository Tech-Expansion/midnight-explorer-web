/**
 * Client-side Token Refresh Manager
 * Handles automatic token refresh and retry logic
 * This MUST run in browser to send real fingerprint
 */

import { fetchWithRetry } from './fetch-utils'

const REFRESH_INTERVAL = 90000 // 90 seconds (refresh every 1.5 minutes)

let refreshTimer: NodeJS.Timeout | null = null
let isRefreshing = false
let initialTokenFetched = false

/**
 * Start automatic token refresh
 * Called on app initialization
 */
export function startTokenRefresh() {
  if (typeof window === 'undefined') return // Only run in browser
    
  // Refresh immediately on first load (synchronously wait for it)
  refreshTokenSync()
  
  // Then refresh every 90 seconds
  refreshTimer = setInterval(() => {
    refreshToken()
  }, REFRESH_INTERVAL)
}

/**
 * Synchronous token refresh on startup
 * Ensures token is available before making any API calls
 */
async function refreshTokenSync() {
  const success = await refreshToken()
  
  if (success) {
    initialTokenFetched = true
  } else {
    // Retry after 2 seconds if failed
    setTimeout(refreshTokenSync, 2000)
  }
}

/**
 * Stop automatic token refresh
 * Called on unmount
 */
export function stopTokenRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

/**
 * Manually refresh token
 */
async function refreshToken(): Promise<boolean> {
  if (isRefreshing) {
    return false
  }
  
  try {
    isRefreshing = true
    
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Important: send cookies
    })
    
    if (!response.ok) {
      return false
    }
    
    const data = await response.json()
    return true
  } catch (error) {
    return false
  } finally {
    isRefreshing = false
  }
}

/**
 * Fetch with automatic retry on 401 and other errors
 * Wraps fetchWithRetry with token refresh callback
 */
export async function fetchWithTokenRetry(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetchWithRetry(url, options, refreshToken)
}

/**
 * Enhanced API fetch wrapper
 * Use this instead of raw fetch for API calls
 */
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetchWithTokenRetry(endpoint, options)
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

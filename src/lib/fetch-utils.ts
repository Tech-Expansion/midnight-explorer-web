/**
 * Fetch Utilities
 * Reusable fetch functions with retry logic and error handling
 */

const RETRY_DELAY = 1000 // 1 second base retry delay
const MAX_RETRIES = 3 // Maximum retry attempts for API calls
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504] // Retryable HTTP status codes

/**
 * Calculate exponential backoff delay
 */
function getBackoffDelay(attempt: number): number {
  return Math.min(RETRY_DELAY * Math.pow(2, attempt), 10000) // Max 10 seconds
}

/**
 * Check if error is retryable
 */
function isRetryableError(status: number): boolean {
  return RETRYABLE_STATUS_CODES.includes(status)
}

/**
 * Fetch with automatic retry on various errors
 * Handles: 401 (token refresh), 5xx, 429, network errors
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param onTokenRefresh - Callback to refresh token (optional)
 * @returns Promise<Response>
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  onTokenRefresh?: () => Promise<boolean>
): Promise<Response> {
  // Ensure credentials are included
  const fetchOptions: RequestInit = {
    ...options,
    credentials: 'include',
  }
  
  let lastError: Error | null = null
  let lastResponse: Response | null = null
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      console.log(`[FetchUtils] Attempt ${attempt + 1}/${MAX_RETRIES} for ${url}`)
      
      const response = await fetch(url, fetchOptions)
      
      // Success
      if (response.ok) {
        if (attempt > 0) {
          console.log(`[FetchUtils] Request succeeded after ${attempt + 1} attempts`)
        }
        return response
      }
      
      // Handle 401 - Token expired (only if onTokenRefresh is provided)
      if (response.status === 401 && onTokenRefresh) {
        console.log('[FetchUtils] Got 401, refreshing token...')
        
        const refreshed = await onTokenRefresh()
        if (!refreshed) {
          console.error('[FetchUtils] Token refresh failed')
          return response
        }
        
        // Wait for cookie to propagate
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
        
        // Retry with new token
        console.log('[FetchUtils] Retrying with new token...')
        const retryResponse = await fetch(url, fetchOptions)
        
        if (retryResponse.ok) {
          console.log('[FetchUtils] Retry after token refresh successful')
        }
        return retryResponse
      }
      
      // Check if error is retryable (5xx, 429, 408, etc.)
      if (isRetryableError(response.status)) {
        lastResponse = response
        
        if (attempt < MAX_RETRIES - 1) {
          const delay = getBackoffDelay(attempt)
          console.log(`[FetchUtils] Retryable error ${response.status}, retrying in ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
      }
      
      // Non-retryable error or last attempt
      return response
      
    } catch (error) {
      // Network error or fetch failure
      lastError = error as Error
      console.error(`[FetchUtils] Fetch error on attempt ${attempt + 1}:`, error)
      
      if (attempt < MAX_RETRIES - 1) {
        const delay = getBackoffDelay(attempt)
        console.log(`[FetchUtils] Network error, retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
    }
  }
  
  // All retries exhausted
  if (lastError) {
    console.error('[FetchUtils] All retries exhausted, throwing error')
    throw lastError
  }
  
  if (lastResponse) {
    console.error('[FetchUtils] All retries exhausted, returning last response')
    return lastResponse
  }
  
  // Should never reach here
  throw new Error('Fetch failed with no response or error')
}

/**
 * Enhanced API fetch wrapper with retry and JSON parsing
 * Use this instead of raw fetch for API calls
 */
export async function apiFetchWithRetry<T>(
  endpoint: string, 
  options?: RequestInit,
  onTokenRefresh?: () => Promise<boolean>
): Promise<T> {
  const response = await fetchWithRetry(endpoint, options, onTokenRefresh)
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

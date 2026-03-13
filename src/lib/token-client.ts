/**
 * Client-side Token Refresh Manager
 * Simplified version with clear state management
 */

import { fetchWithRetry } from './fetch-utils'

const REFRESH_INTERVAL = 90000 // 90 seconds

// Token state management
class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null
  private isRefreshing = false
  private isReady = false
  private readyPromise: Promise<boolean> | null = null
  private readyResolve: ((value: boolean) => void) | null = null
  private turnstileToken: string | null = null

  /**
   * Set Turnstile token from the widget (called by TokenProvider)
   */
  setTurnstileToken(token: string) {
    this.turnstileToken = token
  }

  /**
   * Initialize token system - fetch first token and start auto-refresh
   */
  async start(): Promise<void> {
    if (typeof window === 'undefined') return
    if (this.isReady) return // Already started

    // Create ready promise
    this.readyPromise = new Promise((resolve) => {
      this.readyResolve = resolve
    })

    // Fetch initial token
    await this.fetchInitialToken()

    // Start auto-refresh
    this.refreshTimer = setInterval(() => {
      this.refresh()
    }, REFRESH_INTERVAL)
  }

  /**
   * Fetch initial token with retry logic
   */
  private async fetchInitialToken(): Promise<void> {
    const success = await this.refresh()

    if (success) {
      this.isReady = true
      this.readyResolve?.(true)
    } else {
      // Retry after 2 seconds
      setTimeout(() => this.fetchInitialToken(), 2000)
    }
  }

  /**
   * Refresh token from backend
   */
  async refresh(): Promise<boolean> {
    if (this.isRefreshing) return false

    try {
      this.isRefreshing = true

      const headers: Record<string, string> = {}

      // Attach Turnstile token if available
      if (this.turnstileToken) {
        headers['x-turnstile-token'] = this.turnstileToken
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers,
      })

      if (!response.ok) return false

      // Clear turnstile token after successful use (one-time use)
      this.turnstileToken = null

      await response.json()
      return true
    } catch {
      return false
    } finally {
      this.isRefreshing = false
    }
  }

  /**
   * Wait for token to be ready
   */
  async waitUntilReady(): Promise<boolean> {
    if (typeof window === 'undefined') return true // SSR
    if (this.isReady) return true
    return this.readyPromise || Promise.resolve(false)
  }

  /**
   * Check if token is ready (synchronous)
   */
  get ready(): boolean {
    return this.isReady
  }

  /**
   * Stop auto-refresh
   */
  stop(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
  }
}

// Singleton instance
const tokenManager = new TokenManager()

// Public API
export const startTokenRefresh = () => tokenManager.start()
export const stopTokenRefresh = () => tokenManager.stop()
export const waitForToken = () => tokenManager.waitUntilReady()
export const isTokenReady = () => tokenManager.ready
export const setTurnstileToken = (token: string) => tokenManager.setTurnstileToken(token)

/**
 * Fetch with automatic token retry
 * Waits for initial token before making request
 */
export async function fetchWithTokenRetry(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Wait for initial token
  await tokenManager.waitUntilReady()

  // Fetch with retry logic (handles 401 auto-refresh)
  return fetchWithRetry(url, options, () => tokenManager.refresh())
}

/**
 * Enhanced API fetch wrapper
 */
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetchWithTokenRetry(endpoint, options)

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

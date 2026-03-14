/**
 * Token client stubs - ephemeral token system removed
 * Kept for compatibility in case of remaining imports
 */

export const startTokenRefresh = async () => {}
export const stopTokenRefresh = () => {}
export const waitForToken = async () => true
export const isTokenReady = () => true
export const setTurnstileToken = (_token: string) => {}

export async function fetchWithTokenRetry(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(url, { credentials: 'include', ...options })
}

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetchWithTokenRetry(endpoint, options)
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

/**
 * Server-side token fetcher
 * Fetches ephemeral token for SSR requests
 */

const BACKEND_API_URL = process.env.API_URL || 'http://localhost:3002'

/**
 * Fetch ephemeral token for server-side requests
 * Uses server fingerprint
 */
export async function fetchServerToken(): Promise<string | null> {
  try {
    console.log('[ServerToken] Fetching token for SSR...')
    
    const response = await fetch(`${BACKEND_API_URL}/api/v1/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'User-Agent': 'NextJS-SSR',
        'Accept-Language': 'en-US',
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error(`[ServerToken] Failed to fetch token: ${response.status}`)
      return null
    }

    const data = await response.json()
    console.log('[ServerToken] Token fetched successfully')
    return data.token
  } catch (error) {
    console.error('[ServerToken] Error fetching token:', error)
    return null
  }
}

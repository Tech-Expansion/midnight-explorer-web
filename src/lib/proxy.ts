
/**
 * API Proxy Utility
 * Forwards all requests to external API service
 * Only validates token, never auto-refreshes
 */

import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from './token-manager'

const API_BASE_URL = process.env.API_URL
const API_VERSION = 'v1'
/**
 * Proxy a request to the external API
 * Returns 401 if token is invalid/missing (browser will handle refresh)
 */
export async function proxyToExternalAPI(
  request: NextRequest,
  endpoint: string
): Promise<NextResponse> {
  try {
    // 1. Validate token (no auto-refresh)
    const token = validateToken(request)
    
    if (!token) {
      console.error('[Proxy] No valid token, returning 401')
      return NextResponse.json(
        { error: 'Token required', code: 'TOKEN_REQUIRED' },
        { status: 401 }
      )
    }
  
    const url = new URL(request.url)
    const queryString = url.search 
    
    // Build full URL with /api/v1 prefix
    const fullUrl = endpoint.includes('?') 
      ? `${API_BASE_URL}/api/${API_VERSION}${endpoint}`
      : `${API_BASE_URL}/api/${API_VERSION}${endpoint}${queryString}`

    //console.log(`[Proxy] Forwarding request to: ${fullUrl}`)

    // 2. Forward request with token
    const response = await fetch(fullUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error(`[Proxy] External API error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: 'External API request failed', status: response.status },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Proxy] Error:', error)
    return NextResponse.json(
      { error: 'Failed to proxy request', message: String(error) },
      { status: 500 }
    )
  }
}
/**
 * API Proxy Utility
 * Forwards all requests to external API service
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_URL
const API_VERSION = 'v1'

/**
 * Proxy a request to the external API (no auth required)
 */
export async function proxyToExternalAPI(
  request: NextRequest,
  endpoint: string
): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const queryString = url.search

    // Build full URL with /api/v1 prefix
    const fullUrl = endpoint.includes('?')
      ? `${API_BASE_URL}/api/${API_VERSION}${endpoint}`
      : `${API_BASE_URL}/api/${API_VERSION}${endpoint}${queryString}`

    // Forward request body if present
    let body: string | undefined
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.text()
    }

    const response = await fetch(fullUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body,
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
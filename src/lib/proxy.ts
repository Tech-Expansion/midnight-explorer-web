/**
 * API Proxy Utility
 * Forwards all requests to external API service
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_URL || 'https://preview-service.midnightexplorer.com'
const API_KEY = process.env.API_KEY || ''
/**
 * Proxy a request to the external API
 */
export async function proxyToExternalAPI(
  request: NextRequest,
  endpoint: string
): Promise<NextResponse> {
  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`

    console.log(`Proxying request to: ${fullUrl}`)

    const response = await fetch(fullUrl, {
      method: request.method,
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error(`External API error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: 'External API request failed', status: response.status },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to proxy request', message: String(error) },
      { status: 500 }
    )
  }
}

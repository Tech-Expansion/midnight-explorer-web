/**
 * API Proxy Utility
 * Forwards all requests to external API service.
 *
 * Performance improvements:
 * - Streams response body directly (no JSON parse → re-stringify round-trip)
 * - Supports per-call cache TTL via `revalidate` option
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_URL
const API_VERSION = 'v1'

export interface ProxyOptions {
  /** Request headers to forward to the upstream API (e.g. 'x-mek') */
  forwardRequestHeaders?: string[]
  /** Response headers from the upstream API to pass back to the client (e.g. 'x-ect') */
  forwardResponseHeaders?: string[]
  /**
   * Cache revalidation period in seconds (Next.js ISR / fetch cache).
   * Use 0 (default) for `no-store` – fully dynamic endpoints.
   * Use a positive number (e.g. 30) for semi-static endpoints like charts/token data.
   */
  revalidate?: number
}

/**
 * Proxy a request to the external API (no auth required).
 * Response body is streamed directly without buffering JSON.
 */
export async function proxyToExternalAPI(
  request: NextRequest,
  endpoint: string,
  options: ProxyOptions = {}
): Promise<NextResponse> {
  const {
    forwardRequestHeaders = [],
    forwardResponseHeaders = [],
    revalidate = 0,
  } = options

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

    // Build upstream headers, forwarding any explicitly requested ones
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    for (const key of forwardRequestHeaders) {
      const val = request.headers.get(key)
      if (val) headers[key] = val
    }

    const fetchOptions: RequestInit & { next?: { revalidate: number } } =
      revalidate > 0
        ? { method: request.method, headers, body, next: { revalidate } }
        : { method: request.method, headers, body, cache: 'no-store' }

    const response = await fetch(fullUrl, fetchOptions)

    if (!response.ok) {
      console.error(`[Proxy] External API error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: 'External API request failed', status: response.status },
        { status: response.status }
      )
    }

    // Stream body directly – avoids JSON.parse() + JSON.stringify() overhead
    const responseHeaders = new Headers({
      'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
    })
    for (const key of forwardResponseHeaders) {
      const val = response.headers.get(key)
      if (val) responseHeaders.set(key, val)
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('[Proxy] Error:', error)
    return NextResponse.json(
      { error: 'Failed to proxy request', message: String(error) },
      { status: 500 }
    )
  }
}
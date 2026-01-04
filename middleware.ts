/**
 * Next.js Middleware
 * Removes auto-refresh logic - browser handles token refresh
 */

import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip middleware for now - token validation happens in proxy
  // Token refresh is handled by browser via /api/auth/refresh
  return NextResponse.next()
}

/**
 * Configure which paths this middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all API routes
     */
    '/api/:path*',
  ],
}

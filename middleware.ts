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
 * Empty matcher – middleware won't be invoked for any routes.
 * This avoids the unnecessary Edge Function invocation overhead on /api/* paths.
 */
export const config = {
  matcher: [],
}


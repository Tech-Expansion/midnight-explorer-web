/**
 * Token Refresh Endpoint
 * Browser calls this to get a fresh token using real browser fingerprint
 * This prevents curl abuse - token can only be obtained via real browser
 */

import { NextRequest, NextResponse } from 'next/server'
import { fetchNewToken, createTokenCookie, getTokenExpiry } from '@/lib/token-manager'

export async function POST(request: NextRequest) {
  try {
    //console.log('[Auth] Token refresh requested')
    
    // Get browser fingerprint from headers
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const acceptLanguage = request.headers.get('accept-language') || 'en-US'
    
    // Fetch new token from backend with browser fingerprint
    const token = await fetchNewToken(userAgent, acceptLanguage)
    
    if (!token) {
      console.error('[Auth] Failed to fetch token')
      return NextResponse.json(
        { error: 'Failed to obtain token' },
        { status: 500 }
      )
    }
    
    // Get expiry for client-side scheduling
    const expiry = getTokenExpiry(token)
    
    // Create response with HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      expiresAt: expiry, // Client needs this to schedule next refresh
    })
    
    response.headers.set('Set-Cookie', createTokenCookie(token))
    //console.log('[Auth] Token refreshed successfully')
    
    return response
  } catch (error) {
    console.error('[Auth] Refresh error:', error)
    return NextResponse.json(
      { error: 'Token refresh failed' },
      { status: 500 }
    )
  }
}

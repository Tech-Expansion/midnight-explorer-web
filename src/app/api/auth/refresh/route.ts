/**
 * Token Refresh Endpoint
 * Browser calls this to get a fresh token using real browser fingerprint
 * Protected by Cloudflare Turnstile to prevent curl/bot abuse
 */

import { NextRequest, NextResponse } from 'next/server'
import { fetchNewToken, createTokenCookie, getTokenExpiry } from '@/lib/token-manager'

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || ''
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * Verify Cloudflare Turnstile token
 */
async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) {
    console.warn('[Auth] TURNSTILE_SECRET_KEY is not configured, skipping verification')
    return true // Allow in dev if not configured
  }

  try {
    const formData = new FormData()
    formData.append('secret', TURNSTILE_SECRET_KEY)
    formData.append('response', token)
    formData.append('remoteip', ip)

    const result = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: formData,
    })

    const outcome = await result.json() as { success: boolean; 'error-codes'?: string[] }
    
    if (!outcome.success) {
      console.warn('[Auth] Turnstile verification failed:', outcome['error-codes'])
    }
    
    return outcome.success
  } catch (error) {
    console.error('[Auth] Turnstile verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Extract Turnstile token from request header
    const turnstileToken = request.headers.get('x-turnstile-token')
    
    if (!turnstileToken) {
      console.warn('[Auth] Missing Turnstile token')
      return NextResponse.json(
        { error: 'Turnstile token required' },
        { status: 403 }
      )
    }

    // Get real client IP (respects trust proxy from Next.js)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || request.headers.get('x-real-ip')
      || '127.0.0.1'

    // Verify Turnstile token with Cloudflare
    const isHuman = await verifyTurnstileToken(turnstileToken, ip)
    
    if (!isHuman) {
      return NextResponse.json(
        { error: 'Turnstile verification failed' },
        { status: 403 }
      )
    }

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
      expiresAt: expiry,
    })
    
    response.headers.set('Set-Cookie', createTokenCookie(token))
    
    return response
  } catch (error) {
    console.error('[Auth] Refresh error:', error)
    return NextResponse.json(
      { error: 'Token refresh failed' },
      { status: 500 }
    )
  }
}

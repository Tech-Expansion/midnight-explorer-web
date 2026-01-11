/**
 * Ephemeral Token Manager
 * Browser-driven token refresh to prevent curl abuse
 * BFF only validates tokens, never auto-refreshes
 */

import { ResultDto } from "./types"

const BACKEND_AUTH_URL = process.env.API_URL || 'http://localhost:3002'
const TOKEN_COOKIE_NAME = '__et'

interface TokenPayload {
  fingerprint: string
  iat: number
  exp: number
}

interface TokenResponse {
  token: string
}

/**
 * Decode JWT without verification (we only need to read exp)
 */
export function decodeJWT(token: string): TokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = parts[1]
    // Base64url decode
    const decoded = Buffer.from(payload, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch (error) {
    console.error('[Token] Failed to decode JWT:', error)
    return null
  }
}

/**
 * Check if token is valid (not expired)
 */
export function isTokenValid(token: string): boolean {
  const payload = decodeJWT(token)
  if (!payload || !payload.exp) return false
  
  const now = Math.floor(Date.now() / 1000)
  return payload.exp > now
}

/**
 * Get token expiry timestamp for client
 */
export function getTokenExpiry(token: string): number | null {
  const payload = decodeJWT(token)
  return payload?.exp || null
}

/**
 * Fetch new token from backend using browser fingerprint
 */
export async function fetchNewToken(userAgent: string, acceptLanguage: string): Promise<string | null> {
  try {
    console.log('[Token] Fetching new token from backend...');
    
    const response = await fetch(`${BACKEND_AUTH_URL}/api/v1/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        'User-Agent': userAgent,
        'Accept-Language': acceptLanguage,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[Token] Failed to fetch token: ${response.status}`);
      return null;
    }

    const data : ResultDto<TokenResponse> = await response.json(); 
    if(!data.isSuccess){
      console.error(`[Token] Backend error: ${data.message}`);
      return null;
    }
    console.log('[Token] New token fetched successfully')
    return data.data?.token;
  } catch (error) {
    console.error('[Token] Error fetching token:', error);
    return null;
  }
}

/**
 * Get token from cookie
 */
export function getTokenFromCookie(cookies: string): string | null {
  const cookieArray = cookies.split(';').map(c => c.trim())
  const tokenCookie = cookieArray.find(c => c.startsWith(`${TOKEN_COOKIE_NAME}=`))
  
  if (!tokenCookie) return null
  
  return tokenCookie.split('=')[1]
}

/**
 * Create token cookie string (properly replaces old cookie)
 */
export function createTokenCookie(token: string): string {
  // HttpOnly, Secure (in production), SameSite=Lax, Max-Age=120 (2 minutes)
  const isProduction = process.env.NODE_ENV === 'production'
  
  return [
    `${TOKEN_COOKIE_NAME}=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    'Max-Age=120', // 2 minutes to match token expiry
    isProduction ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ')
}

/**
 * Delete token cookie
 */
export function deleteTokenCookie(): string {
  const isProduction = process.env.NODE_ENV === 'production'
  
  return [
    `${TOKEN_COOKIE_NAME}=`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    'Max-Age=0', // Delete immediately
    isProduction ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ')
}

/**
 * Validate token from request
 * Returns token if valid, null if invalid/missing
 * Does NOT auto-refresh
 */
export function validateToken(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || ''
  const token = getTokenFromCookie(cookieHeader)
  
  if (!token) {
    console.log('[Token] No token found in cookie')
    return null
  }
  
  if (!isTokenValid(token)) {
    console.log('[Token] Token is expired')
    return null
  }
  
  console.log('[Token] Token is valid')
  return token
}

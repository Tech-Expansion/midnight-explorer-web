'use client'

import { useEffect, useState, useRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { startTokenRefresh, stopTokenRefresh, setTurnstileToken } from '@/lib/token-client'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

/**
 * Global Token Provider
 * Initializes token system and shows loading until ready
 * Wraps the Cloudflare Turnstile widget invisibly to proof of browser
 */
export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const turnstileReady = useRef(false)

  const handleTurnstileSuccess = (token: string) => {
    // Feed Turnstile token into the token manager before starting refresh
    setTurnstileToken(token)

    if (!turnstileReady.current) {
      turnstileReady.current = true
      // Start token system once we have a Turnstile token
      startTokenRefresh().then(() => {
        setIsReady(true)
      })
    }
  }

  useEffect(() => {
    return () => {
      stopTokenRefresh()
    }
  }, [])

  // Show loading until token ready
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>

        {/* Invisible Turnstile widget - runs CAPTCHA challenge silently */}
        {SITE_KEY && (
          <Turnstile
            siteKey={SITE_KEY}
            onSuccess={handleTurnstileSuccess}
            options={{
              theme: 'dark',
              size: 'invisible',
            }}
            style={{ display: 'none' }}
          />
        )}
      </div>
    )
  }

  return <>{children}</>
}

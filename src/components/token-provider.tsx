'use client'

import { useEffect } from 'react'
import { startTokenRefresh, stopTokenRefresh } from '@/lib/token-client'

/**
 * Global Token Provider
 * Initializes token refresh for the entire app
 * Must be client component
 */
export function TokenProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('[TokenProvider] Initializing token system...')
    startTokenRefresh()
    
    return () => {
      console.log('[TokenProvider] Cleaning up token system...')
      stopTokenRefresh()
    }
  }, [])
  
  return <>{children}</>
}

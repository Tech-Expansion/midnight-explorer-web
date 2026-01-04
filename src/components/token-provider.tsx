'use client'

import { useEffect, useState } from 'react'
import { startTokenRefresh, stopTokenRefresh } from '@/lib/token-client'

/**
 * Global Token Provider
 * Initializes token system and shows loading until ready
 */
export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    // Start token system (returns promise when first token ready)
    startTokenRefresh().then(() => {
      setIsReady(true)
    })
    
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
      </div>
    )
  }
  
  return <>{children}</>
}

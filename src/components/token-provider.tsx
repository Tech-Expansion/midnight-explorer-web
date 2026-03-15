'use client'

/**
 * Token Provider (passthrough - no auth required)
 */
export function TokenProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

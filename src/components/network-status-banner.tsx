'use client'

import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NetworkStatusBanner() {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <Alert variant="destructive" className="shadow-lg border-2 border-yellow-600 ">
        <AlertTitle className="text-base font-semibold text-yellow-200">
            Indexing Issue
        </AlertTitle>
        <AlertDescription>
          <p className="mb-2 text-yellow-100/90">
            The Midnight indexer has stopped indexing at blocks 2637734. 
            We are aware of this issue and waiting for new indexer version. Some new data may be temporarily unavailable.
          </p>
        </AlertDescription>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 rounded-full hover:bg-yellow-900/30 text-yellow-200 hover:text-yellow-100"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  )
}

'use client'

import { useRouter } from "next/navigation"

interface ClickablePoolRowProps {
  poolId: number
  children: React.ReactNode
}

export function ClickablePoolRow({ poolId, children }: ClickablePoolRowProps) {
  const router = useRouter()
  
  const handleClick = () => {
    router.push(`/pool/${poolId}`)
  }

  return (
    <tr 
      className="border-b border-border/50 hover:bg-accent/5 transition-colors cursor-pointer group"
      onClick={handleClick}
    >
      {children}
    </tr>
  )
}
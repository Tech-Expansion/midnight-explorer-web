'use client'

import { useRouter } from "next/navigation"

interface ClickablePoolRowProps {
  id: number  // Use id (database id) for navigation
  children: React.ReactNode
}

export function ClickablePoolRow({ id, children }: ClickablePoolRowProps) {
  const router = useRouter()
  
  const handleClick = () => {
    router.push(`/pool/${id}`)
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
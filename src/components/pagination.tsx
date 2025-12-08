"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  buildUrl: (page: number) => string
  className?: string
}

/**
 * Pagination component with numbered page links (1, 2, 3, ..., 9)
 * For use with page-based pagination (Pool page)
 */
export function Pagination({ currentPage, totalPages, buildUrl, className }: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 9 // Show up to 9 page numbers like in the image
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      // Calculate range around current page
      let start = Math.max(2, currentPage - 3)
      let end = Math.min(totalPages - 1, currentPage + 3)
      
      // Adjust if we're near the start
      if (currentPage <= 4) {
        end = Math.min(maxVisible - 1, totalPages - 1)
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 3) {
        start = Math.max(2, totalPages - (maxVisible - 2))
      }
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...')
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...')
      }
      
      // Always show last page
      pages.push(totalPages)
    }
    
    return pages
  }

  const pages = getPageNumbers()
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {/* Page numbers only - no Previous/Next buttons */}
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-muted-foreground"
            >
              ...
            </span>
          )
        }

        const pageNum = page as number
        const isActive = pageNum === currentPage

        return (
          <Link
            key={pageNum}
            href={buildUrl(pageNum)}
            className={cn(
              "min-w-[40px] h-[40px] flex items-center justify-center rounded-md border transition-colors font-medium",
              isActive
                ? "bg-gradient-to-r from-blue-600/50 to-purple-600/50 border-blue-500/30 text-foreground hover:from-blue-600/70 hover:to-purple-600/70"
                : "bg-card/50 border-border text-foreground hover:bg-card/70"
            )}
          >
            {pageNum}
          </Link>
        )
      })}
    </div>
  )
}

interface SimplePaginationProps {
  hasPrev: boolean
  hasNext: boolean
  prevUrl?: string
  nextUrl?: string
  className?: string
  pageInfo?: string
}

/**
 * Simple pagination component with only icon buttons for cursor-based pagination
 * For use with cursor-based pagination (Transactions, Blocks, Contracts)
 */
export function SimplePagination({ 
  hasPrev, 
  hasNext, 
  prevUrl, 
  nextUrl, 
  className,
  pageInfo 
}: SimplePaginationProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* Previous button - icon only */}
      {hasPrev && prevUrl ? (
        <Link
          href={prevUrl}
          className="min-w-[40px] h-[40px] flex items-center justify-center rounded-md border bg-card/50 border-border text-foreground hover:bg-card/70 transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      ) : (
        <div className="min-w-[40px] h-[40px] flex items-center justify-center rounded-md border bg-card/30 border-border/50 text-muted-foreground/50 cursor-not-allowed">
          <ChevronLeft className="h-5 w-5" />
        </div>
      )}

      {/* Optional page info */}
      {pageInfo && (
        <div className="px-4 text-sm text-muted-foreground">
          {pageInfo}
        </div>
      )}

      {/* Next button - icon only */}
      {hasNext && nextUrl ? (
        <Link
          href={nextUrl}
          className="min-w-[40px] h-[40px] flex items-center justify-center rounded-md border bg-gradient-to-r from-blue-600/50 to-purple-600/50 border-blue-500/30 text-foreground hover:from-blue-600/70 hover:to-purple-600/70 transition-colors"
          title="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      ) : (
        <div className="min-w-[40px] h-[40px] flex items-center justify-center rounded-md border bg-card/30 border-border/50 text-muted-foreground/50 cursor-not-allowed">
          <ChevronRight className="h-5 w-5" />
        </div>
      )}
    </div>
  )
}

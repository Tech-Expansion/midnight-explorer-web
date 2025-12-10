import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"
import { SearchBarPage } from "@/components/search-bar-page"
import { PoolsList } from "@/components/pools-list"
import Link from "next/link"

export const dynamic = "force-dynamic"

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
  }
}

interface PageProps {
  searchParams: Promise<{
    page?: string
    pageSize?: string
    q?: string  // Search query
  }>
}

export default async function PoolPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1
  const pageSize = resolvedSearchParams?.pageSize ? parseInt(resolvedSearchParams.pageSize) : 20
  const searchQuery = resolvedSearchParams?.q || ''

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 z-0">
        <Starfield />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {searchQuery ? 'Pool Search Results' : 'Stake Pools'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {searchQuery 
                ? `Showing results for "${searchQuery}"` 
                : 'Explore stake pools on the Midnight network'}
            </p>
          </div>

          {/* Search Bar */}
          <SearchBarPage searchType="pool" />

          {/* Clear Search Link */}
          {searchQuery && (
            <div className="flex items-center gap-2">
              <Link 
                href="/pool" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← Clear search and show all pools
              </Link>
            </div>
          )}

          {/* Pools List */}
          <PoolsList
            initialPage={page}
            pageSize={pageSize}
            searchQuery={searchQuery}
          />
        </main>

        <Footer />
      </div>
    </div>
  )
}

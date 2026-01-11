
import { SearchBarPage } from "@/components/search-bar-page"
import { BlocksList } from "@/components/blocks-list"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    cursor?: string
    page?: string
  }>
}

export default async function BlocksPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const cursor = resolvedSearchParams?.cursor
  const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Blocks
        </h1>
        <p className="text-muted-foreground text-lg">Explore all blocks on the Midnight network</p>
      </div>

      {/* Search */}
      <SearchBarPage searchType="block" />

      {/* Blocks List */}
      <BlocksList initialCursor={cursor} page={page} />
    </div>
  )
}
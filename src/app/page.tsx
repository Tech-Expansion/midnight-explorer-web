'use client'

import { useQuery } from '@tanstack/react-query'
import { SearchBar } from "@/components/search-bar"
import { RecentBlocks } from "@/components/recent-blocks"
import { blockAPI } from "@/lib/api"
import { Block } from "@/lib/types"

function HomePageContent() {
  // Query cho blocks
  const { data: blocksData } = useQuery({
    queryKey: ['recent-blocks'],
    queryFn: async () => {
      const data = await blockAPI.getRecentBlocks<{ blocks: Block[] }>()
      return data.blocks || []
    },
  })

  const blocks = blocksData || []

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section with Search */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-balance">Midnight Blockchain Explorer</h1>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Trace and explore all transactions, blocks, contracts, pools on the Midnight network
          </p>
        </div>
        <SearchBar />
      </section>

      {/* Recent Blocks Centered */}
      <div className="w-full max-w-4xl mx-auto mt-8">
        <RecentBlocks blocks={blocks} />
      </div>
    </div>
  )
}

export default function HomePage() {
  return <HomePageContent />
}
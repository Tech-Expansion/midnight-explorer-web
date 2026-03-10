'use client'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { NetworkStats } from "@/components/network-stats"
import { RecentBlocks } from "@/components/recent-blocks"
import { RecentTransactions } from "@/components/recent-transactions"
import { ErrorBoundary } from "@/components/error-boundary"
import { blockAPI } from "@/lib/api"
import { Block } from "@/lib/types"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 15000,
    },
  },
})

function HomePageContent() {
  const { data: blocksData } = useQuery({
    queryKey: ['recent-blocks'],
    queryFn: async () => {
      const data = await blockAPI.getRecentBlocks<{ blocks: Block[] }>()
      return data.blocks || []
    },
  })

  const blocks = blocksData || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      <NetworkStats />

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <ErrorBoundary>
          <RecentBlocks blocks={blocks} />
        </ErrorBoundary>

        <ErrorBoundary>
          <RecentTransactions />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomePageContent />
    </QueryClientProvider>
  )
}
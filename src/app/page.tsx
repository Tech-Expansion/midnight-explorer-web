'use client'

import { useQuery } from '@tanstack/react-query'
import { SearchBar } from "@/components/search-bar"
import { NetworkStats } from "@/components/network-stats"
import { RecentBlocks } from "@/components/recent-blocks"
import { RecentTransactions } from "@/components/recent-transactions"
import { NetworkCharts } from "@/components/network-charts"
import { MidnightTokenInfo } from "@/components/midnight-token-info"
import { ErrorBoundary } from "@/components/error-boundary"
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

      {/* Network Statistics */}
      <NetworkStats />

      {/* Charts & Token Info Grid */}
      <div className="grid xl:grid-cols-[3fr_1fr] gap-6">
        <ErrorBoundary>
          <NetworkCharts />
        </ErrorBoundary>

        <ErrorBoundary>
          <MidnightTokenInfo />
        </ErrorBoundary>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecentBlocks blocks={blocks} />
        {/* FIXED: RecentTransactions doesn't need props - it fetches internally */}
        <RecentTransactions />
      </div>

      {/* Validator Statistics */}
      {/* <ValidatorStats /> 

        {/* Token Statistics */}
      {/*} <TokenStats />  */}

      {/* Network Health */}
      {/*}  <NetworkHealth />  */}
    </div>
  )
}

export default function HomePage() {
  return <HomePageContent />
}
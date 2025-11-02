'use client'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { NetworkStats } from "@/components/network-stats"
import { RecentBlocks } from "@/components/recent-blocks"
import { RecentTransactions } from "@/components/recent-transactions"
import { NetworkCharts } from "@/components/network-charts"
import { ValidatorStats } from "@/components/validator-stats"
import { TokenStats } from "@/components/token-stats"
import { NetworkHealth } from "@/components/network-health"
import { Starfield } from "@/components/starfield"

interface Block {
  height: number
  hash: string
  timestamp: string
  txCount: number
}

// Tạo QueryClient global
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 15000,
    },
  },
})

function HomePageContent() {
  // Query cho blocks
  const { data: blocksData } = useQuery({
    queryKey: ['recent-blocks'],
    queryFn: async () => {
      const res = await fetch('/api/blocks/recent', {
        cache: 'no-store',
        next: { revalidate: 0 }
      })
      if (!res.ok) throw new Error('Failed to fetch blocks')
      const data = await res.json()
      return data.blocks || []
    },
    refetchInterval: 30000,
  })

  const blocks = blocksData || []

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 z-0">
        <Starfield />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Hero Section with Search */}
          <section className="text-center space-y-6 py-12">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-balance">Midnight Blockchain Explorer</h1>
              <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
                Trace and explore all transactions, blocks, and addresses on the Midnight network
              </p>
            </div>
            <SearchBar />
          </section>

          {/* Network Statistics */}
          <NetworkStats /> 

          {/* Recent Activity Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            <RecentBlocks blocks={blocks} />
            {/* ✅ FIXED: RecentTransactions doesn't need props - it fetches internally */}
            <RecentTransactions />
          </div>

          {/* Charts Section */}
          <NetworkCharts /> 

          {/* Validator Statistics */}
          <ValidatorStats /> 

          {/* Token Statistics */}
          <TokenStats /> 

          {/* Network Health */}
          <NetworkHealth /> 
        </main>

        <Footer />
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
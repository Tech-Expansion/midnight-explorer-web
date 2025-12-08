import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"
import { SearchBarPage } from "@/components/search-bar-page"
import { ContractsList } from "@/components/contracts-list"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    cursor?: string
    page?: string
  }>
}

export default async function ContractsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const cursor = resolvedSearchParams?.cursor
  const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1

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
              Smart Contracts
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore deployed and called contracts on Midnight
            </p>
          </div>

          {/* Search Bar */}
          <SearchBarPage searchType="contract" />

          {/* Contracts List */}
          <ContractsList initialCursor={cursor} page={page} />
        </main>

        <Footer />
      </div>
    </div>
  )
}
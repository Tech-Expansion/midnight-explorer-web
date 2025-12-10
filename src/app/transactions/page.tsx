import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"
import { SearchBarPage } from "@/components/search-bar-page"
import { TransactionsList } from "@/components/transactions-list"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{ cursor?: string; hash?: string; page?: string }>
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const cursor = resolvedSearchParams?.cursor
  const searchHash = resolvedSearchParams?.hash
  const searchPage = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1
  
  const searchMode = !!searchHash

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 z-0">
        <Starfield />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8 space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {searchMode ? 'Search Results' : 'Transactions'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {searchMode 
                ? `Searching for transactions matching "${searchHash}"`
                : 'Track all transactions on the Midnight network'
              }
            </p>
          </div>

          {/* Search */}
          <SearchBarPage searchType="transaction" />

          {/* Transactions List */}
          <TransactionsList
            initialCursor={cursor}
            searchHash={searchHash}
            searchPage={searchPage}
          />
        </main>

        <Footer />
      </div>
    </div>
  )
}
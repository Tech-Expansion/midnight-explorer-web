import { TransactionsListSkeleton } from "@/components/skeletons/transactions-list-skeleton"
import { SearchBarPage } from "@/components/search-bar-page"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Transactions
        </h1>
        <p className="text-muted-foreground text-lg">
          Track all transactions on the Midnight network
        </p>
      </div>

      <SearchBarPage searchType="transaction" />

      <TransactionsListSkeleton />
    </div>
  )
}

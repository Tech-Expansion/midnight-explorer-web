import { ContractsListSkeleton } from "@/components/skeletons/contracts-list-skeleton"
import { SearchBarPage } from "@/components/search-bar-page"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Smart Contracts
        </h1>
        <p className="text-muted-foreground text-lg">
          Explore deployed and called contracts on Midnight
        </p>
      </div>

      <SearchBarPage searchType="contract" />

      {/* Contracts List */}
      <ContractsListSkeleton />
    </div>
  )
}

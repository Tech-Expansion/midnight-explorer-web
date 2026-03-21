import { Card } from "@/components/ui/card"

export function TransactionsListSkeleton() {
  return (
    <>
      <div className="hidden md:block">
        <Card className="bg-card/50 border-border">
          <div className="overflow-x-auto">
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '35%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '8%' }} />
              </colgroup>
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Txn Hash</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Variant</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Block</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Protocol</th>
                  <th className="text-center p-4 text-sm font-semibold text-muted-foreground">Age</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Size</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 20 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="border-b border-border/50 animate-pulse">
                    <td className="p-4">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-muted rounded w-16"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-muted rounded w-12"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-muted rounded w-10"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-muted rounded w-10"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="md:hidden space-y-3">
        {Array.from({ length: 15 }).map((_, index) => (
          <Card key={`skeleton-mobile-${index}`} className="bg-card/50 border-border p-4 animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-5 bg-muted rounded w-16"></div>
                <div className="h-4 bg-muted rounded w-12"></div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="h-3 bg-muted rounded w-12 mb-1"></div>
                  <div className="h-4 bg-muted rounded w-8 mt-1"></div>
                </div>
                <div>
                  <div className="h-3 bg-muted rounded w-12 mb-1"></div>
                  <div className="h-4 bg-muted rounded w-16 mt-1"></div>
                </div>
              </div>
              <div className="border-t border-border/50 pt-2">
                <div className="h-3 bg-muted rounded w-12 mb-1"></div>
                <div className="h-4 bg-muted rounded w-24 mt-1"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center gap-2 mt-4 pb-8">
        <div className="h-10 w-10 bg-card/30 border border-border/50 rounded-md"></div>
        <div className="h-10 w-10 bg-card/30 border border-border/50 rounded-md"></div>
      </div>
    </>
  )
}

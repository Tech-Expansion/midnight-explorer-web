import { Card } from "@/components/ui/card"

export function PoolsListSkeleton() {
  return (
    <>
      <div className="hidden md:block">
        <Card className="bg-card/50 border-border">
          <div className="overflow-x-auto">
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '45%' }} />
                <col style={{ width: '35%' }} />
                <col style={{ width: '20%' }} />
              </colgroup>
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Pool Name</th>
                  <th className="text-center p-4 text-sm font-semibold text-muted-foreground">Aura Public Key</th>
                  <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Blocks Minted</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 20 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="border-b border-border/50 animate-pulse">
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                        <div className="h-3 bg-muted rounded w-full"></div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <div className="h-5 bg-muted rounded w-40"></div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        <div className="h-5 bg-muted rounded w-24"></div>
                      </div>
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
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
              <div className="border-t border-border/50 pt-2 space-y-2">
                <div>
                  <div className="h-3 bg-muted rounded w-20 mb-1"></div>
                  <div className="h-5 bg-muted rounded w-40"></div>
                </div>
                <div>
                  <div className="h-3 bg-muted rounded w-20 mb-1"></div>
                  <div className="h-5 bg-muted rounded w-24"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center gap-1 mt-4 pb-8">
        <div className="h-10 w-10 bg-card/50 border border-border rounded-md"></div>
        <div className="h-10 w-10 bg-card/50 border border-border rounded-md"></div>
        <div className="h-10 w-10 bg-card/50 border border-border rounded-md"></div>
        <div className="px-3 py-2 text-muted-foreground">...</div>
        <div className="h-10 w-10 bg-card/50 border border-border rounded-md"></div>
      </div>
    </>
  )
}

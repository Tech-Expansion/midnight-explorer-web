"use client"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CopyButton } from "@/components/ui/copy-button"
import { transactionAPI } from "@/lib/api"
import { TransactionDetail } from "@/lib/transaction-types"
import {
  formatDate,
  formatValue
} from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { HashLink } from "@/components/ui/hash-link"
import { StatBadge } from "@/components/ui/stat-badge"

export default function TransactionPage() {
  const params = useParams()
  const hash = params.hash as string

  const [transaction, setTransaction] = useState<TransactionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedContractIndex, setExpandedContractIndex] = useState<number | null>(null)
  const [showRawData, setShowRawData] = useState(false)

  useEffect(() => {
    async function fetchTransaction() {
      try {
        const data = await transactionAPI.getTransaction<TransactionDetail>(hash)
        setTransaction(data)
      } catch (error) {
        console.error("Error fetching transaction:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    fetchTransaction()
  }, [hash])

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading transaction...</p>
      </div>
    )
  }

  if (!transaction) {
    return notFound()
  }

  const totalInput = transaction.unshieldedSpentOutputs && transaction.unshieldedSpentOutputs.length > 0
    ? formatValue(transaction.unshieldedSpentOutputs.reduce((sum, output) =>
      (BigInt(sum) + BigInt(output.value)).toString(), "0"))
    : "0.000000"

  const totalOutput = transaction.unshieldedCreatedOutputs && transaction.unshieldedCreatedOutputs.length > 0
    ? formatValue(transaction.unshieldedCreatedOutputs.reduce(
      (sum, output) => (BigInt(sum) + BigInt(output.value)).toString(),
      "0",
    ))
    : "0.000000"

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Transaction <span className="text-muted-foreground text-lg ml-2">{transaction.hash.slice(0, 16)}...</span>
        </h1>
        <div className="flex items-center gap-3">
          <CopyButton text={transaction.hash} className="text-muted-foreground" />
          {transaction.transactionResult && (
            <StatBadge variant={transaction.transactionResult === 'Success' ? 'success' : 'destructive'} className="uppercase px-3 py-1 text-xs">
              {transaction.transactionResult}
            </StatBadge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[4px] border-border bg-card shadow-sm p-0 overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold">Transaction Details</h2>
            </div>
            <div className="divide-y divide-border/50 text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-4 hover:bg-muted/20 transition-colors">
                <div className="w-1/3 text-muted-foreground font-medium">Tx Hash</div>
                <div className="w-2/3 flex items-center gap-2">
                  <span className="font-mono">{transaction.hash}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-4 hover:bg-muted/20 transition-colors">
                <div className="w-1/3 text-muted-foreground font-medium">Block</div>
                <div className="w-2/3 flex items-center gap-2 font-mono">
                  <Link href={`/block/${transaction.block.height}`} className="text-primary hover:underline">
                    {transaction.block.height}
                  </Link>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-4 hover:bg-muted/20 transition-colors">
                <div className="w-1/3 text-muted-foreground font-medium">Block Hash</div>
                <div className="w-2/3 flex items-center gap-2">
                  <HashLink hash={transaction.block.hash} type="block" showCopy={false} />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-4 hover:bg-muted/20 transition-colors">
                <div className="w-1/3 text-muted-foreground font-medium">Timestamp</div>
                <div className="w-2/3">
                  <span className="font-mono">{formatDate(transaction.block.timestamp)}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-4 hover:bg-muted/20 transition-colors">
                <div className="w-1/3 text-muted-foreground font-medium">Protocol Version</div>
                <div className="w-2/3">v{transaction.protocolVersion}</div>
              </div>
              <div className="flex flex-col sm:flex-row px-4 py-3 gap-1 sm:gap-4 hover:bg-muted/20 transition-colors">
                <div className="w-1/3 text-muted-foreground font-medium">From</div>
                <div className="w-2/3 font-mono break-all text-muted-foreground">
                  {transaction.unshieldedSpentOutputs?.[0]?.owner || "-"}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row px-4 py-3 gap-1 sm:gap-4 hover:bg-muted/20 transition-colors">
                <div className="w-1/3 text-muted-foreground font-medium">To</div>
                <div className="w-2/3 font-mono break-all text-muted-foreground space-y-1">
                  {(() => {
                    const toAddresses = transaction.unshieldedCreatedOutputs?.filter(
                      output => output.owner !== transaction.unshieldedSpentOutputs?.[0]?.owner
                    ) || [];
                    if (!toAddresses.length) return "-";
                    return toAddresses.map((o, i) => <div key={i}>{o.owner}</div>);
                  })()}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[4px] border-border bg-card shadow-sm p-0 overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold">Value Summary</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Input</p>
                <p className="font-mono text-lg font-medium">{totalInput} <span className="text-sm text-muted-foreground">NIGHT</span></p>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Output</p>
                <p className="font-mono text-lg font-medium text-emerald-600">{totalOutput} <span className="text-sm text-muted-foreground">NIGHT</span></p>
              </div>
              {transaction.paidFees && (
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Paid Fees</p>
                  <p className="font-mono text-lg font-medium text-amber-600">{formatValue(transaction.paidFees)} <span className="text-sm text-muted-foreground">DUST</span></p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="rounded-[4px] border-border bg-card shadow-sm p-0 overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">Inputs</h3>
            <span className="text-xs text-muted-foreground">{transaction.unshieldedSpentOutputs?.length || 0}</span>
          </div>
          <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto bg-muted/5">
            {transaction.unshieldedSpentOutputs?.length ? transaction.unshieldedSpentOutputs.map((out, i) => (
              <div key={i} className="p-3 text-sm flex gap-3 items-center justify-between hover:bg-muted/20">
                <div className="min-w-0">
                  <span className="text-xs font-mono text-muted-foreground block mb-0.5">#{out.outputIndex}</span>
                  <span className="font-mono text-xs block truncate w-[160px] sm:w-[240px]">{out.owner}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-medium">{formatValue(out.value)} <span className="text-[10px] uppercase text-muted-foreground">Night</span></span>
                </div>
              </div>
            )) : <div className="p-4 text-sm text-muted-foreground text-center">No unshielded inputs</div>}
          </div>
        </Card>

        <Card className="rounded-[4px] border-border bg-card shadow-sm p-0 overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">Outputs</h3>
            <span className="text-xs text-muted-foreground">{transaction.unshieldedCreatedOutputs?.length || 0}</span>
          </div>
          <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto bg-muted/5">
            {transaction.unshieldedCreatedOutputs?.length ? transaction.unshieldedCreatedOutputs.map((out, i) => (
              <div key={i} className="p-3 text-sm flex gap-3 items-center justify-between hover:bg-muted/20">
                <div className="min-w-0">
                  <span className="text-xs font-mono text-muted-foreground block mb-0.5">#{out.outputIndex}</span>
                  <span className="font-mono text-xs block truncate w-[160px] sm:w-[240px]">{out.owner}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-medium text-emerald-600">{formatValue(out.value)} <span className="text-[10px] uppercase text-muted-foreground">Night</span></span>
                </div>
              </div>
            )) : <div className="p-4 text-sm text-muted-foreground text-center">No unshielded outputs</div>}
          </div>
        </Card>
      </div>

      {transaction.contractActions && transaction.contractActions.length > 0 && (
        <Card className="rounded-[4px] border-border bg-card shadow-sm p-0 overflow-hidden mb-6">
          <div className="bg-muted/50 px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold">Contract Actions</h2>
          </div>
          <div className="divide-y divide-border/50">
            {transaction.contractActions.map((action, i) => (
              <div key={i} className="p-4 group">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex gap-2 items-center mb-1">
                      <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground border-border rounded-sm uppercase tracking-widest px-2 group-hover:bg-muted transition-colors cursor-pointer" onClick={() => setExpandedContractIndex(expandedContractIndex === i ? null : i)}>
                        Action #{i + 1}
                      </Badge>
                    </div>
                    <p className="font-mono text-sm text-primary hover:underline cursor-pointer">{action.address}</p>
                  </div>
                  <CopyButton text={action.address} className="h-4 w-4 text-muted-foreground" />
                </div>
                {expandedContractIndex === i && (
                  <div className="mt-4 p-3 bg-muted/20 rounded-sm border border-border text-xs font-mono space-y-3">
                    {action.state && <div><p className="text-muted-foreground mb-1 uppercase tracking-widest">State</p><div className="break-all">{action.state}</div></div>}
                    {action.zswapState && <div><p className="text-muted-foreground mb-1 uppercase tracking-widest mt-2">ZSwap</p><div className="break-all">{action.zswapState}</div></div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="rounded-[4px] border-border bg-card shadow-sm p-0 overflow-hidden mb-6">
        <button
          onClick={() => setShowRawData(!showRawData)}
          className="flex items-center justify-between w-full bg-muted/50 px-4 py-3 hover:bg-muted/70 transition-colors"
        >
          <h2 className="text-sm font-semibold">Raw Transaction & Ledgers</h2>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showRawData ? 'rotate-180' : ''}`} />
        </button>
        {showRawData && (
          <div className="p-4 bg-muted/10 text-xs font-mono divide-y divide-border">
            {transaction.raw && <div className="py-2"><h4 className="font-semibold mb-1">Raw</h4><div className="break-all text-muted-foreground">{transaction.raw}</div></div>}
            {transaction.dustLedgerEvents && transaction.dustLedgerEvents.map((e, i) => <div className="py-2" key={i}><h4 className="font-semibold mb-1">Dust Event #{e.id}</h4><div className="break-all text-muted-foreground">{e.raw}</div></div>)}
            {transaction.zswapLedgerEvents && transaction.zswapLedgerEvents.map((e, i) => <div className="py-2" key={i}><h4 className="font-semibold mb-1">ZSwap Event #{e.id}</h4><div className="break-all text-muted-foreground">{e.raw}</div></div>)}
          </div>
        )}
      </Card>
    </div>
  )
}

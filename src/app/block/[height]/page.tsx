import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { blockAPI } from "@/lib/api"
import { notFound } from "next/navigation"
import { CopyButton } from "@/components/ui/copy-button"
import { BlockResponse } from "@/lib/transaction-types"
import { BlockTransactionsList } from "@/components/block-transactions-list"
import { HashLink } from "@/components/ui/hash-link"
import { formatDateTimeWithRelative } from "@/lib/utils"

interface PageProps {
  params: Promise<{ height: string }>
}

export const dynamic = "force-dynamic"

export default async function BlockPage({ params }: PageProps) {
  const { height } = await params;

  try {
    const data = await blockAPI.getBlock<BlockResponse>(height)
    if (!data.block) {
      notFound()
    }

    const { block } = data

    let ledgerParametersHex = ''
    if (block.ledgerParameters && block.ledgerParameters.type === 'Buffer') {
      const buffer = Buffer.from(block.ledgerParameters.data);
      ledgerParametersHex = '0x' + buffer.toString('hex');
    }

    return (
      <div className="container mx-auto px-4 py-8 max-w-[1400px]">
        {/* Header with Navigation */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Block <span className="text-muted-foreground">#{block.height}</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/blocks">
                <Button variant="outline" size="sm" className="rounded-sm bg-card hover:bg-muted/50 border-border">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  View Blocks
                </Button>
              </Link>
              {block.height > 0 && (
                <Link href={`/block/${block.height - 1}`}>
                  <Button variant="outline" size="icon" className="rounded-sm bg-card hover:bg-muted/50 border-border h-9 w-9">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Link href={`/block/${block.height + 1}`}>
                <Button variant="outline" size="icon" className="rounded-sm bg-card hover:bg-muted/50 border-border h-9 w-9">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Details Grid */}
            <div className="space-y-6">
              <Card className="rounded-[4px] border-border bg-card shadow-sm p-0 overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 border-b border-border">
                  <h2 className="text-sm font-semibold">Block Information</h2>
                </div>
                <div className="divide-y divide-border/50 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-4 hover:bg-muted/20 transition-colors">
                    <div className="w-1/3 text-muted-foreground font-medium">Height</div>
                    <div className="w-2/3">{block.height}</div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-4 hover:bg-muted/20 transition-colors">
                    <div className="w-1/3 text-muted-foreground font-medium">Timestamp</div>
                    <div className="w-2/3 flex items-center gap-2">
                      <span className="font-mono">{formatDateTimeWithRelative(new Date(block.timestamp))}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-4 hover:bg-muted/20 transition-colors">
                    <div className="w-1/3 text-muted-foreground font-medium">Transactions</div>
                    <div className="w-2/3">
                      <Badge variant="outline" className="font-mono text-xs bg-muted/50 text-foreground border-transparent rounded-[2px]">
                        {block.txCount} txns
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-4 hover:bg-muted/20 transition-colors">
                    <div className="w-1/3 text-muted-foreground font-medium">Block Hash</div>
                    <div className="w-2/3 flex items-center justify-between">
                      <span className="font-mono text-muted-foreground truncate w-[200px] md:w-[300px]">{block.hash}</span>
                      <CopyButton text={block.hash} className="h-4 w-4 hover:bg-muted text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-4 hover:bg-muted/20 transition-colors">
                    <div className="w-1/3 text-muted-foreground font-medium">Parent Hash</div>
                    <div className="w-2/3 flex items-center justify-between">
                      <Link href={`/block/${block.parentHash}`} className="font-mono text-primary hover:underline truncate w-[200px] md:w-[300px]">{block.parentHash}</Link>
                      <CopyButton text={block.parentHash} className="h-4 w-4 hover:bg-muted text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-4 hover:bg-muted/20 transition-colors">
                    <div className="w-1/3 text-muted-foreground font-medium">Proposer / Author</div>
                    <div className="w-2/3 flex items-center justify-between">
                      <HashLink hash={block.author} type="tx" truncate showCopy={false} />
                      <CopyButton text={block.author} className="h-4 w-4 hover:bg-muted text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-4 hover:bg-muted/20 transition-colors">
                    <div className="w-1/3 text-muted-foreground font-medium">Protocol Version</div>
                    <div className="w-2/3">v{block.protocolVersion}</div>
                  </div>
                </div>
              </Card>

              {ledgerParametersHex && (
                <Card className="rounded-[4px] border-border bg-card shadow-sm p-0 overflow-hidden">
                  <div className="bg-muted/50 px-4 py-3 border-b border-border flex justify-between items-center">
                    <h2 className="text-sm font-semibold">Ledger Parameters</h2>
                    <span className="text-xs text-muted-foreground">{Math.ceil((ledgerParametersHex.length - 2) / 2)} bytes</span>
                  </div>
                  <div className="p-4 bg-muted/10">
                    <p className="text-xs font-mono break-all text-muted-foreground leading-relaxed max-h-[120px] overflow-y-auto">
                      {ledgerParametersHex}
                    </p>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column: Transactions */}
            <div className="space-y-6">
              <Card className="rounded-[4px] border-border bg-card shadow-sm p-0 overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Block Transactions</h2>
                  {block.txCount > 0 && <span className="text-xs text-muted-foreground">{block.txCount} txns</span>}
                </div>
                <div className="p-4">
                  {block.txCount === 0 ? (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      <p>No transactions in this block</p>
                    </div>
                  ) : (
                    <BlockTransactionsList height={block.height} txCount={block.txCount} />
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (_error) {
    console.error('Error fetching block:', _error)
    notFound()
  }
}
import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/ui/copy-button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "@/lib/utils"
import { transactionAPI } from "@/lib/api"
import { notFound } from "next/navigation"
import { DetailedTransaction, BufferData } from "@/lib/transaction-types"

interface PageProps {
  params: Promise<{ hash: string }>
}

export const dynamic = "force-dynamic"

function hashToString(hash: string | BufferData): string {
  if (typeof hash === 'string') {
    return hash
  }
  if (hash.type === 'Buffer' && Array.isArray(hash.data)) {
    return '0x' + Buffer.from(hash.data).toString('hex')
  }
  return ''
}

export default async function TransactionPage({ params }: PageProps) {
  const resolvedParams = await params
  
  let transaction: DetailedTransaction
  try {
    transaction = await transactionAPI.getTransaction<DetailedTransaction>(resolvedParams.hash)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    notFound()
  }
  
  console.log('Fetched transaction:', transaction)

  const getVariantBadge = (variant?: string) => {
    switch (variant) {
      case "Regular":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Regular
          </Badge>
        )
      case "System":
        return (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            System
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 z-0">
        <Starfield />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Transaction Details
                </h1>
                <p className="text-muted-foreground text-lg">View detailed information about this transaction</p>
              </div>
              <Link
                href="/transactions"
                className="px-4 py-2 bg-card/50 hover:bg-card/70 border border-border text-foreground rounded-md transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </div>

            {/* Transaction Hash Card */}
            <Card className="p-6 bg-card/50 border-border">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-2">Transaction Hash</p>
                    <p className="text-lg font-mono break-all text-blue-400">{hashToString(transaction.hash)}</p>
                  </div>
                  <CopyButton text={hashToString(transaction.hash)} className="border-border" />
                </div>

                <div className="flex items-center gap-2">
                  {getVariantBadge(transaction.variant)}
                </div>
              </div>
            </Card>

            {/* Transaction Details */}
            <Card className="p-6 bg-card/50 border-border">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Overview</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Block</p>
                    {transaction.blockId ? (
                      <Link
                        href={`/block/${transaction.blockId}`}
                        className="text-purple-400 hover:text-purple-300 transition-colors font-mono text-lg"
                      >
                        #{transaction.blockId}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground text-lg">Pending</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Timestamp</p>
                    {transaction.timestamp ? (
                      <div className="space-y-1">
                        <p className="text-sm">{new Date(Number(transaction.timestamp)).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          ({formatDistanceToNow(new Date(Number(transaction.timestamp)))} ago)
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Pending</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Protocol Version</p>
                    <p className="text-lg font-mono">v{transaction.protocolVersion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Size</p>
                    <p className="text-lg font-mono">{transaction.size ? `${transaction.size} bytes` : "N/A"}</p>
                  </div>
                </div>

                {transaction.regularTransaction && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Start Index</p>
                      <p className="text-lg font-mono">{transaction.regularTransaction.startIndex}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Transaction Result</p>
                      <p className="text-lg font-mono">{transaction.regularTransaction.transactionResult}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Raw Transaction Data - ✅ CẬP NHẬT */}
            {transaction.raw && (
              <Card className="p-6 bg-card/50 border-border">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Raw Transaction Data</h2>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 bg-background/50 rounded-lg p-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                      <p className="text-xs font-mono break-all text-muted-foreground leading-relaxed">
                        {transaction.raw}
                      </p>
                    </div>
                    <CopyButton text={transaction.raw} className="border-border flex-shrink-0" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Size: {transaction.raw.length} characters ({Math.ceil((transaction.raw.length - 2) / 2)} bytes)</span>
                    <span className="text-muted-foreground/70">Scroll to view full data →</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Merkle Tree Root */}
            {transaction.regularTransaction?.merkleTreeRoot && (
              <Card className="p-6 bg-card/50 border-border">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Merkle Tree Root</h2>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-mono break-all text-muted-foreground flex-1">
                    {transaction.regularTransaction.merkleTreeRoot}
                  </p>
                  <CopyButton text={transaction.regularTransaction.merkleTreeRoot} className="border-border flex-shrink-0" />
                </div>
              </Card>
            )}

            {/* Identifiers */}
            {transaction.regularTransaction?.paidFees && (
              <Card className="p-6 bg-card/50 border-border">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Transaction Fees</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <span className="text-muted-foreground">Paid Fees</span>
                    <span className="font-mono text-foreground">{transaction.regularTransaction.paidFees}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <span className="text-muted-foreground">Estimated Fees</span>
                    <span className="font-mono text-foreground">{transaction.regularTransaction.estimatedFees}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Ledger Events */}
            {transaction.ledgerEvents && (
              <Card className="p-6 bg-card/50 border-border">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Ledger Events</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-border">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Variant</p>
                      <p className="font-mono text-foreground">{transaction.ledgerEvents.variant}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Grouping</p>
                      <p className="font-mono text-foreground">{transaction.ledgerEvents.grouping}</p>
                    </div>
                  </div>

                  {transaction.ledgerEvents.raw && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Raw Event Data</p>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0 bg-background/50 rounded-lg p-4 max-h-[150px] overflow-y-auto">
                          <p className="text-xs font-mono break-all text-muted-foreground leading-relaxed">
                            {transaction.ledgerEvents.raw}
                          </p>
                        </div>
                        <CopyButton text={transaction.ledgerEvents.raw} className="border-border flex-shrink-0" />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Unshielded UTXOs */}
            {transaction.unshieldedUtxos && (
              <Card className="p-6 bg-card/50 border-border">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Unshielded UTXOs</h2>
                <div className="space-y-3">
                  <div className="p-3 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Owner</p>
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-mono break-all text-foreground flex-1">
                        {transaction.unshieldedUtxos.owner}
                      </p>
                      <CopyButton text={transaction.unshieldedUtxos.owner} className="border-border flex-shrink-0" />
                    </div>
                  </div>

                  {transaction.unshieldedUtxos.tokenType && (
                    <div className="p-3 bg-background/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Token Type</p>
                      <p className="text-sm font-mono text-foreground">{transaction.unshieldedUtxos.tokenType}</p>
                    </div>
                  )}

                  {transaction.unshieldedUtxos.value && (
                    <div className="p-3 bg-background/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Value</p>
                      <p className="text-sm font-mono text-foreground">{transaction.unshieldedUtxos.value}</p>
                    </div>
                  )}

                  <div className="p-3 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Registered for Dust Generation</p>
                    <p className="text-sm font-mono text-foreground">
                      {transaction.unshieldedUtxos.registeredForDustGeneration ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Ledger Events Attributes */}
            {transaction.ledgerEvents?.attributes?.DustInitialUtxo && (
              <Card className="p-6 bg-card/50 border-border">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Dust Initial UTXO Details</h2>
                <div className="space-y-6">
                  {/* Output Section */}
                  {transaction.ledgerEvents.attributes.DustInitialUtxo.output && (
                    <div>
                      <h3 className="text-lg font-semibold text-blue-400 mb-3">Output</h3>
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-background/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Sequence</p>
                            <p className="text-sm font-mono text-foreground">{transaction.ledgerEvents.attributes.DustInitialUtxo.output.seq}</p>
                          </div>
                          <div className="p-3 bg-background/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Creation Time</p>
                            <p className="text-sm font-mono text-foreground">{transaction.ledgerEvents.attributes.DustInitialUtxo.output.ctime}</p>
                          </div>
                          <div className="p-3 bg-background/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">MT Index</p>
                            <p className="text-sm font-mono text-foreground">{transaction.ledgerEvents.attributes.DustInitialUtxo.output.mt_index}</p>
                          </div>
                          <div className="p-3 bg-background/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Initial Value</p>
                            <p className="text-sm font-mono text-foreground">{transaction.ledgerEvents.attributes.DustInitialUtxo.output.initial_value}</p>
                          </div>
                        </div>
                        <div className="p-3 bg-background/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Nonce</p>
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm font-mono break-all text-foreground flex-1">
                              {transaction.ledgerEvents.attributes.DustInitialUtxo.output.nonce}
                            </p>
                            <CopyButton text={transaction.ledgerEvents.attributes.DustInitialUtxo.output.nonce} className="border-border flex-shrink-0" />
                          </div>
                        </div>
                        <div className="p-3 bg-background/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Owner</p>
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm font-mono break-all text-foreground flex-1">
                              {transaction.ledgerEvents.attributes.DustInitialUtxo.output.owner}
                            </p>
                            <CopyButton text={transaction.ledgerEvents.attributes.DustInitialUtxo.output.owner} className="border-border flex-shrink-0" />
                          </div>
                        </div>
                        <div className="p-3 bg-background/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Backing Night</p>
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm font-mono break-all text-foreground flex-1">
                              {transaction.ledgerEvents.attributes.DustInitialUtxo.output.backing_night}
                            </p>
                            <CopyButton text={transaction.ledgerEvents.attributes.DustInitialUtxo.output.backing_night} className="border-border flex-shrink-0" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generation Info Section */}
                  {transaction.ledgerEvents.attributes.DustInitialUtxo.generation_info && (
                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-3">Generation Info</h3>
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-background/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Creation Time</p>
                            <p className="text-sm font-mono text-foreground">{transaction.ledgerEvents.attributes.DustInitialUtxo.generation_info.ctime}</p>
                          </div>
                          <div className="p-3 bg-background/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Deletion Time</p>
                            <p className="text-sm font-mono text-foreground">{transaction.ledgerEvents.attributes.DustInitialUtxo.generation_info.dtime}</p>
                          </div>
                          <div className="p-3 bg-background/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Value</p>
                            <p className="text-sm font-mono text-foreground">{transaction.ledgerEvents.attributes.DustInitialUtxo.generation_info.value}</p>
                          </div>
                        </div>
                        <div className="p-3 bg-background/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Nonce</p>
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm font-mono break-all text-foreground flex-1">
                              {transaction.ledgerEvents.attributes.DustInitialUtxo.generation_info.nonce}
                            </p>
                            <CopyButton text={transaction.ledgerEvents.attributes.DustInitialUtxo.generation_info.nonce} className="border-border flex-shrink-0" />
                          </div>
                        </div>
                        <div className="p-3 bg-background/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Owner</p>
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm font-mono break-all text-foreground flex-1">
                              {transaction.ledgerEvents.attributes.DustInitialUtxo.generation_info.owner}
                            </p>
                            <CopyButton text={transaction.ledgerEvents.attributes.DustInitialUtxo.generation_info.owner} className="border-border flex-shrink-0" />
                          </div>
                        </div>
                        <div className="p-3 bg-background/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Night UTXO Hash</p>
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm font-mono break-all text-foreground flex-1">
                              {transaction.ledgerEvents.attributes.DustInitialUtxo.generation_info.night_utxo_hash}
                            </p>
                            <CopyButton text={transaction.ledgerEvents.attributes.DustInitialUtxo.generation_info.night_utxo_hash} className="border-border flex-shrink-0" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generation Index */}
                  <div className="p-3 bg-background/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Generation Index</p>
                    <p className="text-sm font-mono text-foreground">{transaction.ledgerEvents.attributes.DustInitialUtxo.generation_index}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Additional Info */}
            <Card className="p-6 bg-card/50 border-border">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Additional Information</h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Variant</span>
                  <span className="font-medium">{getVariantBadge(transaction.variant)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Block ID</span>
                  <span className="font-mono">
                    {transaction.blockId ? `#${transaction.blockId}` : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Protocol Version</span>
                  <span className="font-mono">v{transaction.protocolVersion}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Transaction Size</span>
                  <span className="font-mono">{transaction.size ? `${transaction.size} B` : "N/A"}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-xs">{transaction.id}</span>
                </div>
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
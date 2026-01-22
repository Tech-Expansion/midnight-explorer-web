import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CopyButton } from "@/components/ui/copy-button"
import { poolAPI } from "@/lib/api"

interface PageProps {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

interface PoolDetail {
  auraPublicKey: string
  sidechainPublicKey: string
  grandpaPublicKey: string
  isValid: boolean
  type: string
  blocksMinted: number
  sidechainAccountId: string
  mainchainPubKey: string
  crossChainPublicKey: string
  sidechainSignature: string
  mainchainSignature: string
  crossChainSignature: string
  utxo?: {
    utxoId: string
    epochNumber: number
    blockNumber: number
    slotNumber: number
    txIndexWithinBlock: number
  }
  invalidReasons?: Record<string, string>
  poolOffchainData?: {
    name: string
    ticker: string
    homepage?: string
    description?: string
  }
}

export default async function PoolDetailPage({ params }: PageProps) {
  const { id } = await params
  
  let pool: PoolDetail
  
  try {
    const response = await poolAPI.getPoolDetail<PoolDetail>(id)
    if (!response) {
      notFound()
    }
    pool = response
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Pool Details
            </h1>
            <p className="text-muted-foreground text-lg">
              View stake pool information and metadata
            </p>
          </div>
          <Link href="/pool">
            <Button variant="outline" size="sm" className="border-border">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

            {/* Overview */}
            <Card className="p-6 bg-card/50 border-border">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Overview</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pool Name</p>
                    <p className="text-lg font-semibold text-blue-400">
                      {pool.poolOffchainData?.name || 'Unknown Pool'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ticker</p>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-400 border-green-500/20 text-base px-3 py-1"
                    >
                      {pool.poolOffchainData?.ticker || 'N/A'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Blocks Minted</p>
                    <Badge
                      variant="outline"
                      className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-base px-3 py-1"
                    >
                      {pool.blocksMinted.toLocaleString()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pool Status</p>
                    <Badge
                      variant="outline"
                      className={`text-base px-3 py-1 ${
                        pool.isValid
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}
                    >
                      {pool.isValid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Aura Public Key</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-mono break-all flex-1 text-blue-400">
                      {pool.auraPublicKey}
                    </p>
                    <CopyButton text={pool.auraPublicKey} />
                  </div>
                </div>

                {pool.poolOffchainData?.homepage && (
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-2">Homepage</p>
                    <a
                      href={pool.poolOffchainData.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 break-all"
                    >
                      {pool.poolOffchainData.homepage}
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}
            {pool.poolOffchainData?.description && (
              <Card className="p-6 bg-card/50 border-border">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Description</h2>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-sm leading-relaxed">
                    {pool.poolOffchainData.description}
                  </p>
                </div>
              </Card>
            )}

            {/* Pool Information */}
            <Card className="p-6 bg-card/50 border-border">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Pool Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Sidechain Public Key</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono break-all flex-1 text-blue-400">
                        {pool.sidechainPublicKey}
                      </p>
                      <CopyButton text={pool.sidechainPublicKey} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Grandpa Public Key</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono break-all flex-1 text-blue-400">
                        {pool.grandpaPublicKey}
                      </p>
                      <CopyButton text={pool.grandpaPublicKey} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Mainchain Public Key</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono break-all flex-1 text-blue-400">
                        {pool.mainchainPubKey}
                      </p>
                      <CopyButton text={pool.mainchainPubKey} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Sidechain Account ID</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono break-all flex-1 text-blue-400">
                        {pool.sidechainAccountId}
                      </p>
                      <CopyButton text={pool.sidechainAccountId} />
                    </div>
                  </div>
                </div>

                {pool.utxo && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-muted-foreground mb-3">UTXO Information</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">UTXO ID</p>
                        <p className="text-xs font-mono text-blue-400 break-all">{pool.utxo.utxoId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Epoch Number</p>
                        <p className="text-xs font-mono text-blue-400">{pool.utxo.epochNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Block Number</p>
                        <p className="text-xs font-mono text-blue-400">{pool.utxo.blockNumber.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Slot Number</p>
                        <p className="text-xs font-mono text-blue-400">{pool.utxo.slotNumber.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Signatures */}
            <Card className="p-6 bg-card/50 border-border">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Signatures</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Sidechain Signature</p>
                    <CopyButton text={pool.sidechainSignature} />
                  </div>
                  <p className="text-xs font-mono text-blue-400 break-all bg-secondary/30 p-3 rounded">
                    {pool.sidechainSignature}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Mainchain Signature</p>
                    <CopyButton text={pool.mainchainSignature} />
                  </div>
                  <p className="text-xs font-mono text-blue-400 break-all bg-secondary/30 p-3 rounded">
                    {pool.mainchainSignature}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Cross Chain Signature</p>
                    <CopyButton text={pool.crossChainSignature} />
                  </div>
                  <p className="text-xs font-mono text-blue-400 break-all bg-secondary/30 p-3 rounded">
                    {pool.crossChainSignature}
                  </p>
                </div>
              </div>
            </Card>
          </div>
    </div>
  )
}

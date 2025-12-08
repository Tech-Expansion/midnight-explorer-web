import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Waves, Globe, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CopyButton } from "@/components/ui/copy-button"
import { poolAPI } from "@/lib/api"

interface PageProps {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

interface BufferData {
  type: 'Buffer'
  data: number[]
}

interface PoolJson {
  name: string
  ticker: string
  homepage?: string
  description: string
  extended?: string
}

interface PoolApiResponse {
  pool: {
    id: number
    poolId: number
    tickerName: string
    hash: string | BufferData
    json: PoolJson
    bytes: BufferData
    pmrId: number
  }
}

function bufferToHex(hash: string | BufferData): string {
  if (typeof hash === 'string') {
    return hash.startsWith('0x') ? hash : `0x${hash}`
  }
  if (hash && typeof hash === 'object' && 'data' in hash && Array.isArray(hash.data)) {
    return '0x' + Buffer.from(hash.data).toString('hex')
  }
  return ''
}

export default async function PoolDetailPage({ params }: PageProps) {
  const { id } = await params
  
  let pool: PoolApiResponse['pool']
  
  try {
    const response = await poolAPI.getPool<PoolApiResponse>(id)
    if (!response || !response.pool) {
      notFound()
    }
    pool = response.pool
    if (!pool.json || !pool.id) {
      notFound()
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    notFound()
  }

  const poolHash = bufferToHex(pool.hash)

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 z-0">
        <Starfield />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8">
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
                    <p className="text-sm text-muted-foreground mb-1">ID</p>
                    <Badge
                      variant="outline"
                      className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-base px-3 py-1"
                    >
                      <Waves className="h-4 w-4 mr-1" />
                      #{pool.id}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ticker</p>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-400 border-green-500/20 text-base px-3 py-1"
                    >
                      {pool.json?.ticker || 'N/A'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Pool Name</p>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{pool.json?.name || 'Unknown Pool'}</h3>
                    {pool.json?.homepage && (
                      <a
                        href={pool.json?.homepage || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                      >
                        <Globe className="h-4 w-4" />
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Pool Hash</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono break-all flex-1 text-blue-400">
                      {poolHash}
                    </p>
                    <CopyButton text={poolHash} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6 bg-card/50 border-border">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Description</h2>
              <div className="bg-secondary/30 rounded-lg p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {pool.json?.description || 'No description available'}
                </p>
              </div>
            </Card>

            {/* Metadata */}
            <Card className="p-6 bg-card/50 border-border">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Pool Metadata</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">JSON Metadata</p>
                    <CopyButton text={JSON.stringify(pool.json || {}, null, 2)} />
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="text-xs font-mono whitespace-pre-wrap">
                      {JSON.stringify(pool.json || {}, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">PMR ID</p>
                    <p className="text-sm font-mono text-foreground">#{pool.pmrId}</p>
                  </div>
                  {pool.json?.homepage && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Homepage</p>
                      <a
                        href={pool.json.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors break-all"
                      >
                        {pool.json.homepage}
                      </a>
                    </div>
                  )}
                </div>

                {pool.json?.extended && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Extended Metadata URL</p>
                    <a
                      href={pool.json.extended}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors break-all"
                    >
                      {pool.json.extended}
                    </a>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

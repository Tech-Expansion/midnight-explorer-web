import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/ui/copy-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/components/ui/data-table"
import { HashLink } from "@/components/ui/hash-link"
import { AddressLink } from "@/components/ui/address-link"

export default async function AddressPage({ params }: { params: Promise<{ address: string }> }) {
  const resolvedParams = await params;
  const addressParam = resolvedParams.address;

  const address = {
    address: addressParam,
    balance: "1,234.5678 MIDNIGHT",
    balanceUSD: "$558.23",
    transactions: 1456,
    firstSeen: "2023-06-15",
    lastSeen: "2024-01-15",
  }

  const transactions = Array.from({ length: 15 }, (_, i) => ({
    hash: `0x${i}a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f`,
    type: i % 3 === 0 ? "in" : "out",
    from: i % 3 === 0 ? "0x8ba1f109551bD432803012645Ac136ddd64DBA72" : addressParam,
    to: i % 3 === 0 ? addressParam : "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    value: `${(Math.random() * 100).toFixed(4)} MIDNIGHT`,
    timestamp: `${i + 1} ${i === 0 ? "min" : "mins"} ago`,
    block: 2453678 - i,
  }))

  const columns = [
    {
      header: "Tx Hash",
      accessor: (tx: Record<string, any>) => (
        <HashLink hash={tx.hash} type="tx" truncate showCopy={false} />
      ),
      className: "w-[120px]"
    },
    {
      header: "Method",
      accessor: (tx: Record<string, any>) => (
        <Badge variant="outline" className="font-mono text-xs font-normal border-primary/20 bg-primary/5 text-primary">
          Transfer
        </Badge>
      ),
    },
    {
      header: "Block",
      accessor: (tx: Record<string, any>) => (
        <Link href={`/block/${tx.block}`} className="font-mono text-primary hover:underline">
          {tx.block}
        </Link>
      ),
    },
    {
      header: "Age",
      accessor: (tx: any) => (
        <span className="text-muted-foreground whitespace-nowrap">{tx.timestamp}</span>
      ),
    },
    {
      header: "From",
      accessor: (tx: any) => <AddressLink address={tx.from} />,
    },
    {
      header: "To",
      accessor: (tx: any) => <AddressLink address={tx.to} />,
    },
    {
      header: "Value",
      accessor: (tx: any) => (
        <span className={tx.type === "in" ? "text-emerald-600 font-medium whitespace-nowrap" : "text-foreground whitespace-nowrap"}>
          {tx.type === "in" ? "+" : "-"}{tx.value}
        </span>
      ),
      className: "text-right"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-[1400px]">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <h1 className="text-2xl font-semibold tracking-tight">Address</h1>
            <span className="font-mono bg-muted px-3 py-1 rounded-[4px] border border-border text-sm flex items-center gap-2">
              {address.address}
              <CopyButton text={address.address} className="h-4 w-4" />
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-0 bg-card rounded-[4px] border-border shadow-sm flex flex-col justify-center px-4 py-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Balance</p>
              <div>
                <span className="text-lg font-bold text-foreground font-mono">{address.balance}</span>
              </div>
            </Card>
            <Card className="p-0 bg-card rounded-[4px] border-border shadow-sm flex flex-col justify-center px-4 py-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Value (USD)</p>
              <div>
                <span className="text-lg font-bold text-foreground font-mono">{address.balanceUSD}</span>
              </div>
            </Card>
            <Card className="p-0 bg-card rounded-[4px] border-border shadow-sm flex flex-col justify-center px-4 py-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Transactions</p>
              <div>
                <span className="text-lg font-bold text-foreground font-mono">{address.transactions}</span>
              </div>
            </Card>
            <Card className="p-0 bg-card rounded-[4px] border-border shadow-sm flex flex-col justify-center px-4 py-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">First Seen</p>
              <div>
                <span className="text-lg font-bold text-foreground font-mono">{address.firstSeen}</span>
              </div>
            </Card>
          </div>

          <Card className="p-0 bg-card rounded-[4px] border-border shadow-sm">
            <Tabs defaultValue="transactions" className="w-full">
              <div className="px-4 border-b border-border bg-muted/30">
                <TabsList className="bg-transparent h-12 p-0 space-x-6">
                  <TabsTrigger value="transactions" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12 font-medium">Transactions</TabsTrigger>
                  <TabsTrigger value="tokens" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12 font-medium">Tokens</TabsTrigger>
                  <TabsTrigger value="nfts" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12 font-medium">NFTs</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="transactions" className="m-0 p-0">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Latest Transactions</h3>
                  <p className="text-xs text-muted-foreground">Showing {transactions.length} records</p>
                </div>
                <div className="overflow-x-auto relative">
                  <DataTable data={transactions} columns={columns} />
                </div>
              </TabsContent>

              <TabsContent value="tokens" className="m-0 p-8 text-center bg-muted/10">
                <p className="text-muted-foreground text-sm">No tokens found for this address</p>
              </TabsContent>

              <TabsContent value="nfts" className="m-0 p-8 text-center bg-muted/10">
                <p className="text-muted-foreground text-sm">No NFTs found for this address</p>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  )
}
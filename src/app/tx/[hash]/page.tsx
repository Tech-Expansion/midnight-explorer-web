"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Starfield } from "@/components/starfield"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CopyButton } from "@/components/ui/copy-button"
import { transactionAPI } from "@/lib/api"
import { TransactionDetail } from "@/lib/transaction-types"
import {
  formatDate,
  formatValue
} from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function TransactionPage() {
  const params = useParams()
  const hash = params.hash as string

  const [transaction, setTransaction] = useState<TransactionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedContractIndex, setExpandedContractIndex] = useState<number | null>(null)
  const [showRawData, setShowRawData] = useState(false)
  const [showBlockParams, setShowBlockParams] = useState(false)

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
      <div className="min-h-screen bg-black text-slate-50 p-6 flex items-center justify-center">
        <p className="text-slate-400">Loading transaction...</p>
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
    <div className="min-h-screen bg-black relative">
      <div className="fixed inset-0 z-0">
        <Starfield />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="space-y-2 mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Transaction Detail
            </h1>
            <p className="text-muted-foreground text-lg">
              View transaction details and information
            </p>
          </div>

          {/* Transaction Hash */}
          <Card className="bg-black border-slate-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-400 text-sm mb-2">Hash</p>
                <p className="font-mono text-sm break-all">{transaction.hash}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {transaction.transactionResult && (
                  <Badge className={`${
                    transaction.transactionResult === 'Success'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}>
                    {transaction.transactionResult}
                  </Badge>
                )}
                <CopyButton 
                  text={transaction.hash}
                  className="text-slate-400 hover:text-slate-50 hover:bg-slate-800 transition-colors"
                />
              </div>
            </div>
            {transaction.identifiers && transaction.identifiers.length > 0 && (
              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-400 text-sm mb-2">Identifiers</p>
                <div className="space-y-2">
                  {transaction.identifiers.map((identifier, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-900 rounded p-2">
                      <p className="font-mono text-xs text-slate-300 break-all flex-1">{identifier}</p>
                      <CopyButton 
                        text={identifier}
                        className="text-slate-400 hover:text-slate-50 hover:bg-slate-800 transition-colors ml-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Transaction Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Overview */}
            <Card className="bg-black border-slate-700 p-6">
              <h2 className="text-lg font-semibold mb-4">Transaction Overview</h2>
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-0">
                  <span className="text-slate-400">Block Hash</span>
                  <Link 
                    href={`/block/${transaction.block.height}`}
                    className="font-mono text-sm text-blue-400 hover:text-blue-300 hover:underline cursor-pointer break-all"
                  >
                    {transaction.block.hash}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Block Height</span>
                  <Link 
                    href={`/block/${transaction.block.height}`}
                    className="font-mono text-slate-300 hover:text-blue-300 hover:underline cursor-pointer"
                  >
                    #{transaction.block.height}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp</span>
                  <span className="text-slate-300">{formatDate(transaction.block.timestamp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Protocol Version</span>
                  <span className="font-mono text-slate-300">v{transaction.protocolVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction ID</span>
                  <span className="font-mono text-slate-300">#{transaction.id}</span>
                </div>
                {transaction.unshieldedSpentOutputs && transaction.unshieldedSpentOutputs.length > 0 && (
                  <div className="flex flex-col md:flex-row md:justify-between border-t border-slate-700 pt-3 gap-2 md:gap-0">
                    <span className="text-slate-400">From</span>
                    <span className="font-mono text-xs text-slate-300 break-all">{transaction.unshieldedSpentOutputs[0].owner}</span>
                  </div>
                )}
                {transaction.unshieldedCreatedOutputs && transaction.unshieldedCreatedOutputs.length > 0 && (
                  <div className="border-t border-slate-700 pt-3">
                    {(() => {
                      // If only 1 created output, use it directly as "To"
                      if (transaction.unshieldedCreatedOutputs.length === 1) {
                        return (
                          <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-0">
                            <span className="text-slate-400">To</span>
                            <span className="font-mono text-xs text-slate-300 break-all">{transaction.unshieldedCreatedOutputs[0].owner}</span>
                          </div>
                        );
                      }

                      // Otherwise, filter out addresses matching "From"
                      const toAddresses = transaction.unshieldedCreatedOutputs.filter(
                        output => output.owner !== transaction.unshieldedSpentOutputs?.[0]?.owner
                      );
                      
                      if (toAddresses.length === 1) {
                        return (
                          <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-0">
                            <span className="text-slate-400">To</span>
                            <span className="font-mono text-xs text-slate-300 break-all">{toAddresses[0].owner}</span>
                          </div>
                        );
                      }
                      
                      return (
                        <>
                          <p className="text-slate-400 mb-2">To</p>
                          <div className="space-y-1">
                            {toAddresses.map((output, idx) => (
                              <p key={idx} className="font-mono text-xs text-slate-300 break-all">{output.owner}</p>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </Card>

          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Assets Summary */}
            <Card className="bg-black border-slate-700 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                Transaction Summary
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Input</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image 
                        src="/images/token-night.png" 
                        alt="NIGHT" 
                        width={20} 
                        height={20}
                        className="rounded-full"
                      />
                      <span className="text-white text-sm font-semibold">NIGHT</span>
                    </div>
                    <p className="text-xl font-mono font-semibold">{totalInput}</p>
                  </div>
                </div>
                <div className="border-t border-slate-700 pt-3">
                  <p className="text-slate-400 text-sm mb-1">Total Output</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image 
                        src="/images/token-night.png" 
                        alt="NIGHT" 
                        width={20} 
                        height={20}
                        className="rounded-full"
                      />
                      <span className="text-white text-sm font-semibold">NIGHT</span>
                    </div>
                    <p className="text-xl font-mono font-semibold text-emerald-400">{totalOutput}</p>
                  </div>
                </div>
                {transaction.paidFees && (
                  <div className="border-t border-slate-700 pt-3">
                    <p className="text-slate-400 text-sm mb-1">Paid Fees</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                       
                        <span className="text-white text-sm font-semibold">DUST</span>
                      </div>
                      <p className="text-xl font-mono font-semibold text-orange-400">{formatValue(transaction.paidFees)}</p>
                    </div>
                  </div>
                )}
                {transaction.estimatedFees && (
                  <div className="border-t border-slate-700 pt-3">
                    <p className="text-slate-400 text-sm mb-1">Estimated Fees</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        
                        <span className="text-white text-sm font-semibold">DUST</span>
                      </div>
                      <p className="text-xl font-mono font-semibold text-yellow-400">{formatValue(transaction.estimatedFees)}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

          </div>
        </div>

        {/* Outputs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Spent Outputs */}
          {transaction.unshieldedSpentOutputs && transaction.unshieldedSpentOutputs.length > 0 && (
            <Card className="bg-black border-slate-700 p-6">
              <h3 className="font-semibold mb-4">Inputs ({transaction.unshieldedSpentOutputs.length})</h3>
              <div className="space-y-3">
                {transaction.unshieldedSpentOutputs.map((output, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-mono text-slate-300">#{output.outputIndex}</span>
                      {output.registeredForDustGeneration && (
                        <div className="flex items-center gap-1">
                          <Image 
                            src="/images/token-night.png" 
                            alt="NIGHT" 
                            width={16} 
                            height={16}
                            className="rounded-full"
                          />
                          NIGHT
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 break-all mb-2 font-mono text-xs">{output.owner}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image 
                          src="/images/token-night.png" 
                          alt="NIGHT" 
                          width={18} 
                          height={18}
                          className="rounded-full"
                        />
                        <span className="text-white text-xs font-semibold">NIGHT</span>
                      </div>
                      <p className="font-mono text-sm font-semibold text-orange-400">{formatValue(output.value)}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Time: {new Date(output.ctime * 1000).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Created Outputs */}
          {transaction.unshieldedCreatedOutputs && transaction.unshieldedCreatedOutputs.length > 0 && (
            <Card className="bg-black border-slate-700 p-6">
              <h3 className="font-semibold mb-4">Outputs ({transaction.unshieldedCreatedOutputs.length})</h3>
              <div className="space-y-3">
                {transaction.unshieldedCreatedOutputs.map((output, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-mono text-slate-300">#{output.outputIndex}</span>
                      {output.registeredForDustGeneration && (
                        <div className="flex items-center gap-1">
                          <Image 
                            src="/images/token-night.png" 
                            alt="NIGHT" 
                            width={16} 
                            height={16}
                            className="rounded-full"
                          />
                          NIGHT
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 break-all mb-2 font-mono text-xs">{output.owner}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image 
                          src="/images/token-night.png" 
                          alt="NIGHT" 
                          width={18} 
                          height={18}
                          className="rounded-full"
                        />
                        <span className="text-white text-xs font-semibold">NIGHT</span>
                      </div>
                      <p className="font-mono text-sm font-semibold text-emerald-400">{formatValue(output.value)}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Time: {new Date(output.ctime * 1000).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Contract Actions Section */}
        {transaction.contractActions && transaction.contractActions.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-50">Contract Actions</h2>
            <div className="space-y-4">
              {transaction.contractActions.map((action, index) => (
                <Card
                  key={index}
                  className="bg-black border-slate-700 p-6 cursor-pointer hover:border-slate-600 transition-colors"
                  onClick={() => setExpandedContractIndex(expandedContractIndex === index ? null : index)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-purple-600 hover:bg-purple-700">Smart Contract</Badge>
                        <span className="text-xs text-slate-400">Action #{index + 1}</span>
                      </div>
                      <p className="text-slate-400 text-sm mb-1">Contract Address</p>
                      <p className="font-mono text-sm break-all text-slate-200">{action.address}</p>
                    </div>
                    <CopyButton 
                      text={action.address}
                      className="text-slate-400 hover:text-slate-50 flex-shrink-0"
                    />
                  </div>

                  {/* Expandable Content */}
                  {expandedContractIndex === index && (
                    <div className="space-y-4 border-t border-slate-700 pt-4">
                      {/* Contract State */}
                      {action.state && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-slate-400 text-sm font-semibold">Contract State</p>
                            <span className="text-xs text-slate-500">{action.state.length} characters</span>
                          </div>
                          <div className="bg-slate-900 rounded p-3 border border-slate-700">
                            <p className="font-mono text-xs text-slate-300 break-all leading-relaxed">{action.state}</p>
                          </div>
                        </div>
                      )}

                      {/* ZSwap State */}
                      {action.zswapState && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-slate-400 text-sm font-semibold">ZSwap Ledger State</p>
                            <span className="text-xs text-slate-500">{action.zswapState.length} characters</span>
                          </div>
                          <div className="bg-slate-900 rounded p-3 border border-slate-700">
                            <p className="font-mono text-xs text-slate-300 break-all leading-relaxed">
                              {action.zswapState}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Unshielded Balances */}
                      {action.unshieldedBalances && action.unshieldedBalances.length > 0 ? (
                        <div>
                          <p className="text-slate-400 text-sm font-semibold mb-2">
                            Unshielded Balances ({action.unshieldedBalances.length})
                          </p>
                          <div className="space-y-2">
                            {action.unshieldedBalances.map((balance, bidx) => (
                              <div key={bidx} className="bg-slate-900 rounded p-3 border border-slate-700">
                                <p className="text-sm font-semibold text-slate-300 mb-1">{balance.tokenType}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-white text-xs font-semibold">NIGHT</span>
                                  <p className="font-mono text-sm text-slate-400">{formatValue(balance.amount)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-900 rounded p-3 border border-slate-700">
                          <p className="text-slate-400 text-sm">No unshielded balances</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Collapse/Expand Indicator */}
                  {expandedContractIndex !== index && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                      <span className="text-xs text-slate-500">Click to view contract state details</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Ledger Events Section */}
        {transaction.zswapLedgerEvents && transaction.zswapLedgerEvents.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-50">ZSwap Ledger Events</h2>
            <div className="space-y-3">
              {transaction.zswapLedgerEvents.map((event, index) => (
                <Card key={index} className="bg-black border-slate-700 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-slate-400 text-sm">Event ID: {event.id}</p>
                      <p className="text-slate-400 text-sm">Max ID: {event.maxId}</p>
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded p-3 border border-slate-700 max-h-[150px] overflow-y-auto">
                    <p className="font-mono text-xs text-slate-300 break-all">{event.raw}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {transaction.dustLedgerEvents && transaction.dustLedgerEvents.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-50">Dust Ledger Events</h2>
            <div className="space-y-3">
              {transaction.dustLedgerEvents.map((event, index) => (
                <Card key={index} className="bg-black border-slate-700 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-slate-400 text-sm">Event ID: {event.id}</p>
                      <p className="text-slate-400 text-sm">Max ID: {event.maxId}</p>
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded p-3 border border-slate-700 max-h-[150px] overflow-y-auto">
                    <p className="font-mono text-xs text-slate-300 break-all">{event.raw}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Raw Data Section */}
        <Card className="bg-black border-slate-700 p-6 mb-6">
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="flex items-center justify-between w-full"
          >
            <h2 className="text-lg font-semibold">Raw Transaction Data</h2>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showRawData ? 'rotate-180' : ''}`} />
          </button>
          {showRawData && (
            <div className="mt-4">
              {transaction.raw ? (
                <div className="bg-slate-900 rounded p-3 border border-slate-700 max-h-[300px] overflow-y-auto">
                  <p className="font-mono text-xs text-slate-300 break-all leading-relaxed">{transaction.raw}</p>
                </div>
              ) : (
                <p className="text-slate-400">No raw data available.</p>
              )}
            </div>
          )}
        </Card>

        {/* Block Parameters Section */}
        <Card className="bg-black border-slate-700 p-6">
          <button
            onClick={() => setShowBlockParams(!showBlockParams)}
            className="flex items-center justify-between w-full"
          >
            <h2 className="text-lg font-semibold">Block Ledger Parameters</h2>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showBlockParams ? 'rotate-180' : ''}`} />
          </button>
          {showBlockParams && (
            <div className="mt-4">
              <div className="bg-slate-900 rounded p-3 border border-slate-700">
                <p className="font-mono text-xs text-slate-300 break-all">
                  {typeof transaction.block.ledgerParameters === 'string'
                    ? transaction.block.ledgerParameters
                    : JSON.stringify(transaction.block.ledgerParameters)}
                </p>
              </div>
            </div>
          )}
        </Card>
        </main>

        <Footer />
      </div>
    </div>
  )
}

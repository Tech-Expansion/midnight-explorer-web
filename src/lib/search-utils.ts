// Shared types for search functionality
export interface PoolResult {
  auraPublicKey: string
  blocksMinted: number
  mainchainPubKey?: string
  poolOffchainData?: {
    name: string
    ticker: string
    homepage?: string
    description?: string
  }
}

export interface BlockResult {
  hash: string
  height: number
  timestamp?: number
  txCount?: number
}

export interface TransactionResult {
  hash: string
  blockHeight?: number
  status?: string
}

export interface ContractResult {
  id: string | number
  address: string
  variant?: string
}

const DEFAULT_TIMEOUT_MS = 15000

/**
 * Check if a block exists by height or hash
 */
export async function checkBlock(query: string): Promise<{
  found: boolean
  height?: string
  data?: BlockResult
}> {
  try {
    const { blockAPI } = await import('@/lib/api')
    const { block } = await blockAPI.getBlock<{block: BlockResult}>(query)
    
    if (block) {
      return {
        found: true,
        height: String(block.height),
        data: {
          hash: block.hash || query,
          height: Number(block.height),
          timestamp: block.timestamp,
        }
      }
    }
    return { found: false }
  } catch {
    return { found: false }
  }
}

/**
 * Verify if a transaction exists by hash (fast verification)
 * Uses transactionAPI.verifyTransaction from api.ts
 */
export async function verifyTransaction(query: string): Promise<{
  found: boolean
  type?: string
  txHash?: string
  txId?: string
}> {
  try {
    const { transactionAPI } = await import('@/lib/api')
    
    const { transaction } = await transactionAPI.getTransactionById<{transaction: TransactionResult}>(query)

    if (transaction) {
      return {
        found: true,
        type: 'Transaction',
        txHash: transaction.hash,
        txId: transaction.hash
      }
    }

    return { found: false }
  } catch {
    return { found: false }
  }
}

/**
 * Check if a transaction exists by hash (full search)
 * Uses /api/transactions/search endpoint for detailed results
 */
export async function checkTransaction(query: string): Promise<{
  found: boolean
  data?: TransactionResult
  count?: number
  results?: TransactionResult[]
}> {
  try {
    const { transactionAPI } = await import('@/lib/api')
    
    const { transaction } = await transactionAPI.getTransactionById<{transaction: TransactionResult}>(query)

    if (transaction) {
      const tx = {
        hash: transaction.hash || query,
        blockHeight: transaction.blockHeight,
        status: transaction.status ?? 'success'
      }

      return {
        found: true,
        data: tx,
        count: 1,
        results: [tx]
      }
    }

    return { found: false }
  } catch {
    return { found: false }
  }
}

/**
 * Search for pools by query (hash, ticker, or name)
 * Returns pools matching the query
 */
export async function searchPool(_query: string): Promise<{
  found: boolean
  value?: string
  count?: number
  results?: Array<{
    auraPublicKey: string
    blocksMinted: number
    mainchainPubKey?: string
    poolOffchainData?: {
      name: string
      ticker: string
      homepage?: string
      description?: string
    }
  }>
}> {
  // Pools are not supported in Mainnet Lite
  return { found: false }
}

/**
 * Check if a contract exists by address
 */
export async function checkContract(query: string): Promise<{
  found: boolean
  data?: ContractResult
}> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

    const response = await fetch(`/api/contracts/${encodeURIComponent(query)}`, {
      signal: controller.signal,
      cache: 'no-store'
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return { found: false }
    }

    const data = await response.json()

    if (data.contract || data.address) {
      return {
        found: true,
        data: {
          address: data.contract?.address ?? data.address ?? query,
          variant: data.contract?.variant ?? data.variant,
          id: data.contract?.id ??data.id??null
        }
      }
    }

    return { found: false }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      //console.log('⏱️ Contract check timeout')
    }
    return { found: false }
  }
}

/**
 * Helper function to determine if a string is a contract address (64 hex chars without 0x, or 66 with 0x)
 */
export function isContractAddress(query: string): boolean {
  const cleanHash = query.startsWith("0x") ? query.slice(2) : query
  return /^[a-fA-F0-9]{64}$/.test(cleanHash)
}

/**
 * Helper function to determine if a string is a hex hash
 * Transaction hash: 64 or 66 hex chars (without 0x), or 68 chars (with 0x)
 * Block/Pool hash: 64 hex chars
 */
export function isHexHash(query: string): boolean {
  // With 0x prefix: total length should be 66 (block) or 68 (tx identifier)
  if (query.startsWith("0x") || query.startsWith("0X")) {
    return /^0[xX][a-fA-F0-9]{64}$/.test(query) || /^0[xX][a-fA-F0-9]{66}$/.test(query)
  }
  // Without prefix: should be 64 chars (block/pool) or 66 chars (tx identifier)
  return /^[a-fA-F0-9]{64}$/.test(query) || /^[a-fA-F0-9]{66}$/.test(query)
}

/**
 * Helper function to determine if a string is a block height (numeric)
 */
export function isBlockHeight(query: string): boolean {
  return /^\d+$/.test(query)
}

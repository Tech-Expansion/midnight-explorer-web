/**
 * Shared transaction types used across components
 */

export interface BufferData {
  type: 'Buffer'
  data: number[]
}

export interface RegularTransaction {
  transactionResult: string
  merkleTreeRoot: string
  startIndex: number
  paidFees: string
  estimatedFees: string
}

export interface LedgerEventAttribute {
  DustInitialUtxo?: {
    output: {
      seq: number
      ctime: number
      nonce: string
      owner: string
      mt_index: number
      backing_night: string
      initial_value: number
    }
    generation_info: {
      ctime: number
      dtime: number
      nonce: string
      owner: string
      value: number
      night_utxo_hash: string
    }
    generation_index: number
  }
}

export interface LedgerEvent {
  variant: string
  grouping: string
  raw?: string
  attributes?: LedgerEventAttribute
}

export interface UnshieldedUtxo {
  owner: string
  tokenType?: string
  value?: string
  registeredForDustGeneration?: boolean
}

/**
 * Raw transaction from API response
 */
export interface RawTransaction {
  id: string
  hash: string | BufferData
  variant: 'System' | 'Regular'
  blockId?: string
  blockHeight?: number | null
  protocolVersion?: number
  timestamp?: number | string
  size?: number
  raw?: string
  regularTransaction?: RegularTransaction
  ledgerEvents?: LedgerEvent
  unshieldedUtxos?: UnshieldedUtxo
}

/**
 * Normalized transaction for UI display (list views)
 */
export interface Transaction {
  id: string
  hash: string
  variant: 'System' | 'Regular'
  transactionResult?: string
  blockHeight?: number
  blockId?: string
  timestamp?: number
  protocolVersion?: number
  size?: number
}

/**
 * Detailed transaction for detail page
 */
export type DetailedTransaction = RawTransaction

/**
 * Block types
 */
export interface BlockBuffer {
  type: 'Buffer'
  data: number[]
}

export interface Block {
  height: number
  hash: string
  parent_hash: string
  author: string
  timestamp: number | string
  protocol_version: number
  ledger_parameters: BlockBuffer
  txCount: number
}

export interface BlockResponse {
  block: Block
}

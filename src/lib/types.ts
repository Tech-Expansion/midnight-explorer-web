/**
 * Type definitions for Midnight Explorer
 * 
 * This file contains the core domain types used throughout the explorer
 * to represent blockchain data structures.
 */

/**
 * Represents a block in the Midnight blockchain
 */
export interface Block {
  height: number
  hash: string
  author: string
  timestamp: string
  txCount: number
}

/**
 * Represents a transaction in the Midnight blockchain
 */
export interface Transaction {
  /** Transaction ID */
  id?: string;
  /** Transaction hash identifier */
  hash: string;
  /** Current status of the transaction */
  status: 'success' | 'failed' | 'pending';
  /** Height of the block containing this transaction (if confirmed) */
  blockHeight?: number;
  /** Block ID */
  blockId?: string;
  /** ISO timestamp when the transaction was included in a block (if confirmed) */
  timestamp?: string | number;
  /** Size of the transaction in bytes */
  size?: number;
  /** Protocol version */
  protocolVersion?: number;
  /** Raw transaction data */
  raw?: string;
  /** Merkle tree root */
  merkleTreeRoot?: string;
  /** Start index */
  startIndex?: number;
  /** End index */
  endIndex?: number;
  /** Identifiers */
  identifiers?: string[];
}

/**
 * Represents a contract on the Midnight blockchain
 */
export interface Contract {
  id: string;
  /** Contract address */
  address: string;
  /** Transaction ID that deployed the contract */
  transactionId: string;
  /** Transaction hash (if fetched) */
  transactionHash?: string;
  /** Contract variant (Deploy or Call) */
  variant: 'Deploy' | 'Call' | string;
  /** Contract state */
  state?: string;
  /** ZSwap state */
  zswapState?: string;
  /** Additional attributes */
  attributes?: Record<string, unknown> | string;
}

/**
 * Summary information about an address on the Midnight blockchain
 */
export interface AddressSummary {
  /** The address in bech32m format */
  address: string;
  /** Current balance (if available) */
  balance?: string;
  /** Number of transactions associated with this address */
  txCount?: number;
}

/**
 * Generic pagination wrapper for API responses
 */
export interface Page<T> {
  /** Array of items for the current page */
  items: T[];
  /** Optional cursor for fetching the next page of results */
  nextCursor?: string;
}

/**
 * Pool offchain data (name, ticker, homepage, description)
 */
export interface PoolOffchainData {
  name: string;
  ticker: string;
  homepage?: string;
  description?: string;
}

/**
 * Represents a stake pool on the Midnight blockchain
 */
export interface Pool {
  /** Aura public key identifier for the pool */
  auraPublicKey: string;
  /** Number of blocks minted by this pool */
  blocksMinted: number;
  /** Mainchain public key (optional) */
  mainchainPubKey?: string;
  /** Offchain pool metadata (optional) */
  poolOffchainData?: PoolOffchainData;
}

/**
 * Pool list API response
 */
export interface PoolsResponse {
  pools: Pool[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

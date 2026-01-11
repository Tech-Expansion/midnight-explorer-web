/**
 * Shared transaction types used across components
 */

export interface BufferData {
  type: "Buffer";
  data: number[];
}

export interface RegularTransaction {
  transactionResult: string;
  merkleTreeRoot: string;
  startIndex: number;
  paidFees: string;
  estimatedFees: string;
  identifiers?: string[];
}

export interface MerklePathNode {
  goesLeft: boolean;
  siblingHash: number[];
}

export interface GenerationInfo {
  ctime: number;
  dtime: number;
  nonce: string;
  owner: string;
  value: number;
  nightUtxoHash: string;
}

export interface DustGenerationDtimeUpdate {
  merklePath: MerklePathNode[];
  generationInfo: GenerationInfo;
  generationIndex: number;
}

export interface DustInitialUtxo {
  output: {
    seq: number;
    ctime: number;
    nonce: string;
    owner: string;
    mtIndex: number;
    backingNight: string;
    initialValue: number;
  };
  generationInfo: GenerationInfo;
  generationIndex: number;
}

export interface LedgerEventAttribute {
  DustInitialUtxo?: DustInitialUtxo;
  DustGenerationDtimeUpdate?: DustGenerationDtimeUpdate;
}

export interface LedgerEvent {
  variant: string;
  grouping: string;
  raw?: string;
  attributes?: LedgerEventAttribute;
}

export interface UnshieldedUtxo {
  owner: string;
  tokenType?: string;
  value?: string;
  registeredForDustGeneration?: boolean;
}

export interface ContractCall {
  address: string;
  function: string;
  args?: unknown[];
  result?: unknown;
}

export interface ContractDeploy {
  address: string;
  bytecode?: string;
  constructor?: unknown;
  result?: unknown;
}

export type ContractAction =
  | { variant: "Call"; data: ContractCall }
  | { variant: "Deploy"; data: ContractDeploy };

/**
 * Raw transaction from API response
 */
export interface RawTransaction {
  hash: string | BufferData;
  blockHeight: number | null;
  protocolVersion: number;
  variant: "System" | "Regular";
  timestamp: number | string;
  size: number;
}

/**
 * Normalized transaction for UI display (list views)
 */
export interface Transaction {
  id: string;
  hash: string;
  variant: "System" | "Regular";
  transactionResult?: string;
  blockHeight?: number;
  blockId?: string;
  timestamp?: number;
  protocolVersion?: number;
  size?: number;
}

/**
 * Detailed transaction for detail page
 */
export type DetailedTransaction = RawTransaction;

export interface BlockInfo {
  hash: string;
  height: number;
  timestamp: number | string;
  ledgerParameters: string | BufferData;
}

export interface UnshieldedBalance {
  tokenType: string;
  amount: string;
}

export interface ContractActionDetail {
  address: string;
  state?: string;
  zswapState?: string;
  unshieldedBalances?: UnshieldedBalance[];
}

export interface UnshieldedOutput {
  owner: string;
  tokenType: string;
  value: string;
  outputIndex: number;
  intentHash: string;
  ctime: number;
  initialNonce: string;
  registeredForDustGeneration: boolean;
}

export interface ZswapLedgerEvent {
  id: string;
  raw: string;
  maxId: string;
}

export interface DustLedgerEvent {
  id: string;
  raw: string;
  maxId: string;
}

export interface TransactionDetail {
  id: string;
  hash: string;
  protocolVersion: number;
  raw: string;
  block: BlockInfo;
  contractActions?: ContractActionDetail[];
  unshieldedCreatedOutputs?: UnshieldedOutput[];
  unshieldedSpentOutputs?: UnshieldedOutput[];
  zswapLedgerEvents?: ZswapLedgerEvent[];
  dustLedgerEvents?: DustLedgerEvent[];
  transactionResult?: string | "Success";
  paidFees: string;
  estimatedFees: string;
  identifiers?: string[];
}
/**
 * Block types
 */
export interface BlockBuffer {
  type: "Buffer";
  data: number[];
}

export interface Block {
  height: number;
  hash: string;
  parentHash: string;
  author: string;
  timestamp: number | string;
  protocolVersion: number;
  ledgerParameters: BlockBuffer;
  txCount: number;
}

export interface BlockResponse {
  block: Block;
}

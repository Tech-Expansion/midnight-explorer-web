/**
 * Search-related constants
 * Centralized constants for search functionality to avoid magic strings
 */

// Search type constants
export const SEARCH_TYPE_ALL = 'all' as const
export const SEARCH_TYPE_BLOCK = 'block' as const
export const SEARCH_TYPE_TRANSACTION = 'transaction' as const
export const SEARCH_TYPE_CONTRACT = 'contract' as const
export const SEARCH_TYPE_POOL = 'pool' as const

export const SEARCH_TYPES = {
  ALL: SEARCH_TYPE_ALL,
  BLOCK: SEARCH_TYPE_BLOCK,
  TRANSACTION: SEARCH_TYPE_TRANSACTION,
  CONTRACT: SEARCH_TYPE_CONTRACT,
  POOL: SEARCH_TYPE_POOL
} as const

// Result type constants
export const RESULT_TYPE_BLOCK = 'block' as const
export const RESULT_TYPE_TRANSACTION = 'transaction' as const
export const RESULT_TYPE_CONTRACT = 'contract' as const
export const RESULT_TYPE_POOL = 'pool' as const
export const RESULT_TYPE_VIEW_ALL = 'viewAll' as const

export const RESULT_TYPES = {
  BLOCK: RESULT_TYPE_BLOCK,
  TRANSACTION: RESULT_TYPE_TRANSACTION,
  CONTRACT: RESULT_TYPE_CONTRACT,
  POOL: RESULT_TYPE_POOL,
  VIEW_ALL: RESULT_TYPE_VIEW_ALL
} as const

// Type definitions
export type SearchType = typeof SEARCH_TYPES[keyof typeof SEARCH_TYPES]
export type ResultType = typeof RESULT_TYPES[keyof typeof RESULT_TYPES]

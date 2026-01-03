/**
 * Network chart-related constants
 * Centralized constants for network chart functionality to avoid magic strings
 */

// Time range constants
export const TIME_RANGE_1D = '1D' as const
export const TIME_RANGE_7D = '7D' as const
export const TIME_RANGE_1M = '1M' as const

export const TIME_RANGES = {
  ONE_DAY: TIME_RANGE_1D,
  SEVEN_DAYS: TIME_RANGE_7D,
  ONE_MONTH: TIME_RANGE_1M
} as const

// Data type constants
export const DATA_TYPE_REGULAR = 'regular' as const
export const DATA_TYPE_SYSTEM = 'system' as const
export const DATA_TYPE_TRANSACTIONS = 'transactions' as const

export const DATA_TYPES = {
  REGULAR: DATA_TYPE_REGULAR,
  SYSTEM: DATA_TYPE_SYSTEM,
  TRANSACTIONS: DATA_TYPE_TRANSACTIONS
} as const

// Color constants
export const COLOR_REGULAR = '#10b981' // green
export const COLOR_TRANSACTIONS = '#3b82f6' // blue
export const COLOR_SYSTEM = '#ef4444' // red

export const CHART_COLORS = {
  REGULAR: COLOR_REGULAR,
  TRANSACTIONS: COLOR_TRANSACTIONS,
  SYSTEM: COLOR_SYSTEM
} as const

// Label constants - Time range labels
export const TIME_LABELS = {
  [TIME_RANGE_1D]: '24 hours',
  [TIME_RANGE_7D]: '7 days',
  [TIME_RANGE_1M]: '30 days'
} as const

// Axis interval constants - How many labels to show on X-axis
export const X_AXIS_INTERVALS = {
  [TIME_RANGE_1D]: 1,  // Show every 2 hours
  [TIME_RANGE_7D]: 0,  // Show all
  [TIME_RANGE_1M]: 2   // Show every 3 days
} as const

// Chart height constants - Responsive heights
export const CHART_HEIGHTS = {
  [TIME_RANGE_1D]: 300,
  [TIME_RANGE_7D]: 300,
  [TIME_RANGE_1M]: 360
} as const

// Type definitions
export type TimeRange = typeof TIME_RANGES[keyof typeof TIME_RANGES]
export type DataType = typeof DATA_TYPES[keyof typeof DATA_TYPES]

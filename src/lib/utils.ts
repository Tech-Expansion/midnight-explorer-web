import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Utility functions for Midnight Explorer
 */

/**
 * Formats a date to a human-friendly relative time string
 * Returns values like '2m', '3h', '1d' ago
 * 
 * @param date The date to format
 * @returns A human-friendly relative time string
 */
// Helper to decode hex string to readable text
export function decodeHex(hex: string): string {
  try {
    if (!hex.startsWith('0x')) return hex
    const hexString = hex.slice(2)
    let result = ''
    for (let i = 0; i < hexString.length; i += 2) {
      result += String.fromCharCode(parseInt(hexString.substr(i, 2), 16))
    }
    return result
  } catch {
    return hex
  }
}
export function formatAttributes(attributes: unknown): unknown {
  if (typeof attributes === 'string') {
    return decodeHex(attributes)
  }
  
  if (Array.isArray(attributes)) {
    return attributes.map(formatAttributes)
  }
  
  if (attributes && typeof attributes === 'object') {
    const formatted: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(attributes)) {
      if (typeof value === 'string' && value.startsWith('0x')) {
        formatted[key] = decodeHex(value)
      } else {
        formatted[key] = formatAttributes(value)
      }
    }
    return formatted
  }
  
  return attributes
}

export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000);
  
  // Less than a minute
  if (diffSec < 60) {
    return diffSec < 10 ? 'just now' : `${diffSec}s`;
  }
  
  // Less than an hour
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin}m`;
  }
  
  // Less than a day
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return `${diffHour}h`;
  }
  
  // Less than a week
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) {
    return `${diffDay}d`;
  }
  
  // Less than a month (approximated as 30 days)
  const diffWeek = Math.floor(diffDay / 7);
  if (diffDay < 30) {
    return `${diffWeek}w`;
  }
  
  // Months and years
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) {
    return `${diffMonth}mo`;
  }
  
  // Years
  const diffYear = Math.floor(diffMonth / 12);
  return `${diffYear}y`;
}

/**
 * Get status color and badge styling based on transaction result
 */
export function getTransactionStatusColor(status?: string): { bg: string; text: string; border: string } {
  switch (status?.toLowerCase()) {
    case 'success':
      return {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        border: 'border-green-500/30'
      }
    case 'failed':
    case 'failure':
      return {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        border: 'border-red-500/30'
      }
    case 'pending':
      return {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500/30'
      }
    default:
      return {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        border: 'border-gray-500/30'
      }
  }
}

  
/**
 * Formats a date to show either relative time for recent dates or full datetime for older dates
 * Returns "a few seconds ago", "2 minutes ago" for recent times
 * Returns "Nov 26, 2025 7:47:59 PM" format for older times
 * 
 * @param date The date to format
 * @returns A formatted time string
 */
export function formatDateTimeWithRelative(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  
  // For very recent times (less than 1 hour), show relative time
  if (diffSec < 3600) {
    if (diffSec < 10) {
      return 'a few seconds ago';
    } else if (diffSec < 60) {
      return `${diffSec} seconds ago`;
    } else {
      const minutes = Math.floor(diffSec / 60);
      return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;
    }
  }
  
  // For older times, show full date and time
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

/**
 * Formats a date to standard datetime format
 * Returns "Oct 3, 2025, 2:40:00 AM" format
 * 
 * @param date The date to format
 * @returns A formatted datetime string
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

/**
 * Converts a Buffer object or hex string to a hex string with 0x prefix
 * Handles PostgreSQL Buffer format: { type: 'Buffer', data: [numbers] }
 * 
 * @param buffer Buffer object, hex string, null, or undefined
 * @returns Hex string with 0x prefix, or empty string if invalid
 */
export function bufferToHex(buffer: { type: 'Buffer'; data: number[] } | string | null | undefined): string {
  // If already a string, ensure 0x prefix
  if (typeof buffer === 'string') {
    return buffer.startsWith('0x') ? buffer : `0x${buffer}`
  }
  
  // If it's a Buffer object from PostgreSQL
  if (buffer && typeof buffer === 'object' && buffer.type === 'Buffer' && Array.isArray(buffer.data)) {
    return '0x' + buffer.data.map(byte => byte.toString(16).padStart(2, '0')).join('')
  }
  
  // Invalid or null
  return ''
}

/**
 * Converts hex string (like token amount) to readable decimal format
 * @param hexValue Hex string starting with 0x
 * @returns Readable decimal value
 */
export function hexToDecimal(hexValue: string | undefined): string {
  if (!hexValue) return '0'
  try {
    if (!hexValue.startsWith('0x')) return hexValue
    const decimal = BigInt(hexValue).toString()
    return decimal
  } catch {
    return hexValue
  }
}

/**
 * Formats token/amount values with commas and optional decimals
 * @param value Decimal string value
 * @param decimals Number of decimal places (default 18)
 * @returns Formatted value
 */
export function formatTokenValue(value: string, decimals: number = 18): string {
  try {
    const num = BigInt(value)
    if (num === BigInt(0)) return '0'
    
    // Convert to decimal with specified decimals
    const divisor = BigInt(10 ** decimals)
    const wholeNumber = num / divisor
    const remainder = num % divisor
    
    if (remainder === BigInt(0)) {
      return wholeNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    
    const remainderStr = remainder.toString().padStart(decimals, '0').replace(/0+$/, '')
    return `${wholeNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${remainderStr}`
  } catch {
    return value
  }
}

/**
 * Copy text to clipboard
 */
export function copyToClipboard(text: string) {
  if (typeof window !== 'undefined') {
    navigator.clipboard.writeText(text)
  }
}

/**
 * Format blockchain address for display
 */
export function formatAddress(address: string) {
  if (address.length > 20) {
    return address.slice(0, 10) + "..." + address.slice(-10)
  }
  return address
}

/**
 * Format transaction value with decimals
 */
export function formatValue(value: string) {
  const num = BigInt(value)
  const decimals = 6
  const divisor = BigInt(10 ** decimals)
  const integerPart = num / divisor
  const fractionalPart = num % divisor

  return `${integerPart}.${fractionalPart.toString().padStart(decimals, "0")}`
}

/**
 * Format date/timestamp
 */
export function formatDate(timestamp: number | string) {
  const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp
  return new Date(ts).toLocaleString()
}

/**
 * Truncate hex string
 */
export function truncateHex(hex: string, length = 20) {
  if (hex.length <= length) return hex
  return hex.slice(0, Math.floor(length / 2)) + "..." + hex.slice(-Math.floor(length / 2))
}

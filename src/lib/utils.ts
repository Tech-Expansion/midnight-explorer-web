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

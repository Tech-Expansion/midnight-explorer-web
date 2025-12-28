import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

/**
 * GET /api/transactions/search?hash=xxx&page=1&pageSize=20
 * Search transactions by hash (partial or full)
 * Returns list with basic info and pagination
 * Used by search bar when showing multiple matching transactions
 */
export async function GET(request: NextRequest) {
  // Forward all query parameters (hash, page, pageSize) to backend
  // Backend /transactions/search returns { data: [...], pagination: {...} }
  return proxyToExternalAPI(request, '/transactions/search')
}

import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

/**
 * GET /api/transactions/:hash
 * Returns single transaction with full detail
 * Requires full 64-character hash
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params
  
  // This calls backend /transactions/:hash which returns full transaction detail
  // Backend expects full 64-char hash, returns single transaction object
  return proxyToExternalAPI(request, `/transactions/${hash}`)
}

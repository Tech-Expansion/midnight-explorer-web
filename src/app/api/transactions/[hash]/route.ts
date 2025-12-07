import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params
  return proxyToExternalAPI(request, `/transactions/${hash}`)
}

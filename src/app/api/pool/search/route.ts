import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get('q') || ''

  return proxyToExternalAPI(
    request,
    `/pool/search?q=${encodeURIComponent(q)}`
  )
}

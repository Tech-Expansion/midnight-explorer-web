import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const range = (searchParams.get('range') || '1D').toUpperCase()

  const endpoint = `/networks/chart?range=${range}`

  // Chart data is aggregated – safe to cache 60s
  return proxyToExternalAPI(request, endpoint, { revalidate: 60 })
}


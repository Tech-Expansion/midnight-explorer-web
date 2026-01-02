import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const range = (searchParams.get('range') || '1D').toUpperCase()

  const endpoint = `/networks/chart?range=${range}`

  return proxyToExternalAPI(request, endpoint)
}

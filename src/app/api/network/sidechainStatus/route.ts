import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(request: NextRequest) {
  const endpoint = `/networks/sidechainStatus`

  // Sidechain status changes infrequently – cache 30s
  return proxyToExternalAPI(request, endpoint, { revalidate: 30 })
}


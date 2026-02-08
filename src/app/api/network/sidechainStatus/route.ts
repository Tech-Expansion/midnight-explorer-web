import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(request: NextRequest) {
 
  const endpoint = `/networks/sidechainStatus`;

  return proxyToExternalAPI(request, endpoint)
}

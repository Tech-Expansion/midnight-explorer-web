import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(request: NextRequest) {
  // Token data changes infrequently – cache 30s
  return proxyToExternalAPI(request, '/tokens', {
    forwardRequestHeaders: ['x-mek'],
    forwardResponseHeaders: ['x-ect'],
    revalidate: 30,
  })
}


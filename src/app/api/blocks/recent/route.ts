import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(request: NextRequest) {
  return proxyToExternalAPI(request, '/blocks/recent')
}

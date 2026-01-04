import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const hash = searchParams.get('hash')
  
  if (!hash) {
    return Response.json(
      { error: 'hash parameter is required' },
      { status: 400 }
    )
  }

  return proxyToExternalAPI(request, `/blocks/verify?hash=${encodeURIComponent(hash)}`)
}

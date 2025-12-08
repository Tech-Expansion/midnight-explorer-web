import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const page = searchParams.get('page') || '1'
  const pageSize = searchParams.get('pageSize') || '20'
  const query = searchParams.get('q') || ''
  
  const params = new URLSearchParams()
  params.set('page', page)
  params.set('pageSize', pageSize)
  if (query) params.set('q', query)

  return proxyToExternalAPI(
    request,
    `/pool?${params.toString()}`
  )
}



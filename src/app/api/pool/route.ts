import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const page = searchParams.get('page') || '1'
  const pageSize = searchParams.get('pageSize') || '20'

  return proxyToExternalAPI(
    request,
    `/pool?page=${page}&pageSize=${pageSize}`
  )
}

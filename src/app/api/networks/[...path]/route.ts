import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const searchParams = request.nextUrl.searchParams.toString()
  const endpoint = `/networks/${path.join('/')}${searchParams ? `?${searchParams}` : ''}`
  return proxyToExternalAPI(request, endpoint, { revalidate: 60 })
}

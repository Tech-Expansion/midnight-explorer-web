import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // Await the params to resolve them correctly in Next 15+
  const resolvedParams = await params
  const path = resolvedParams.path.join('/')
  return proxyToExternalAPI(request, `/lite/${path}`)
}

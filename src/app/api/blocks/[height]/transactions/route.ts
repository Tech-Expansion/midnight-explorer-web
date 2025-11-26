import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ height: string }> }
) {
  const { height } = await params
  return proxyToExternalAPI(request, `/blocks/${height}/transactions`)
}

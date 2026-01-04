import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auraPublicKey: string }> }
) {
  const { auraPublicKey } = await params

  return proxyToExternalAPI(
    request,
    `/pools/detail/${auraPublicKey}`
  )
}

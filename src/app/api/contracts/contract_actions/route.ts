import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  
  if (!address) {
    return new Response('Address parameter is required', { status: 400 })
  }
  
  return proxyToExternalAPI(request, `/contracts/contract_actions?address=${encodeURIComponent(address)}`)
}

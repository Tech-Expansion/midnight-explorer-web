import { NextRequest, NextResponse } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json(
      { found: false, error: 'Address parameter is required' },
      { status: 400 }
    )
  }

  try {
    const response = await proxyToExternalAPI(request, `/contracts/${address}`)
    const data = await response.json()

    if (response.ok && data.contract) {
      return NextResponse.json({
        found: true,
        type: 'contract',
        address: address,
        data: data.contract
      })
    }

    return NextResponse.json({ found: false })
  } catch (error) {
    console.error('Contract verification error:', error)
    return NextResponse.json({ found: false })
  }
}

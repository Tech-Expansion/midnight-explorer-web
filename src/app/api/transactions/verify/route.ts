import { getProvider } from '@/lib/data'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const hash = searchParams.get('hash')

  if (!hash) {
    return NextResponse.json({ found: false, error: 'Hash required' }, { status: 400 })
  }

  try {
    const provider = getProvider()
    const tx = await provider.getTransactionByHash(hash)
    
    if (tx) {
      return NextResponse.json({ 
        found: true, 
        hash: tx.hash 
      })
    }
    
    return NextResponse.json({ found: false })
  } catch (error) {
    console.error('Error verifying transaction:', error)
    return NextResponse.json({ found: false })
  }
}
import { getProvider } from '@/lib/data'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const hash = searchParams.get('hash')

  if (!hash) {
    return NextResponse.json({ found: false, error: 'Hash or height required' }, { status: 400 })
  }

  try {
    const provider = getProvider()
    const block = await provider.getBlockByHashOrHeight(hash)
    
    if (block) {
      return NextResponse.json({ 
        found: true, 
        height: block.height,
        hash: block.hash 
      })
    }
    
    return NextResponse.json({ found: false })
  } catch (error) {
    console.error('Error verifying block:', error)
    return NextResponse.json({ found: false })
  }
}
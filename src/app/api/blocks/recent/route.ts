import { getProvider } from '@/lib/data'
import { NextResponse } from 'next/server'

// Disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const provider = getProvider()
    const blocks = await provider.getLatestBlocks(20)
    
    return NextResponse.json(
      { blocks },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching blocks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blocks', blocks: [] },
      { status: 500 }
    )
  }
}
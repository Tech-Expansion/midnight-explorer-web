import { getTipInfo } from '@/lib/polkadot'
//import { getProvider } from '@/lib/data'

import { NextResponse } from 'next/server'

// Disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const { height } = await getTipInfo()
    
    return NextResponse.json(
      { 
        blockHeight: height,
        status: 'online',
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching network stats:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch network stats',
        blockHeight: 0,
        status: 'offline'
      },
      { status: 500 }
    )
  }
}
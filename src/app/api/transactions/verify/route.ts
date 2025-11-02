import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const hash = searchParams.get('hash')

    if (!hash) {
      return NextResponse.json({ found: false, error: 'Hash parameter required' }, { status: 400 })
    }

    let cleanHash = hash.trim()

    // Strip '0x' if present
    if (cleanHash.startsWith('0x')) {
      cleanHash = cleanHash.slice(2)
    }

    // Validate hex format (tx hash is 32 bytes = 64 hex chars)
    if (!/^[0-9a-fA-F]{64}$/.test(cleanHash)) {
      return NextResponse.json({ found: false, error: 'Invalid hash format' })
    }

    // Convert to Buffer for database query
    const hashBuf = Buffer.from(cleanHash, 'hex')

    // Check if it's a transaction hash
    const query = `SELECT hash FROM transactions WHERE hash = $1 LIMIT 1`
    const result = await pool.query(query, [hashBuf])

    return NextResponse.json({
      found: result.rows.length > 0,
      type: 'tx',
      value: '0x' + cleanHash
    })
  } catch (error) {
    console.error('Error verifying transaction:', error)
    return NextResponse.json({ found: false, error: 'Server error' }, { status: 500 })
  }
}
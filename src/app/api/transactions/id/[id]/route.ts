import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

function bufferToHex(buffer: Buffer | null): string | null {
  return buffer ? '0x' + buffer.toString('hex') : null
}

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validate ID is numeric
    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      )
    }

    // Query transaction by ID
    const result = await pool.query(
      'SELECT hash FROM transactions WHERE id = $1 LIMIT 1',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    const hash = bufferToHex(result.rows[0].hash)

    return NextResponse.json({ 
      id,
      hash 
    })
  } catch (error) {
    console.error('❌ Error fetching transaction hash:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    )
  }
}
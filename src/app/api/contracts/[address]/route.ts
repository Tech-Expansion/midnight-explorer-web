import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

function bufferToHex(buffer: Buffer | null): string | null {
  return buffer ? '0x' + buffer.toString('hex') : null
}

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params

    // Convert hex address to Buffer
    const cleanAddress = address.startsWith('0x') ? address.slice(2) : address
    if (!/^[0-9a-fA-F]+$/.test(cleanAddress)) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      )
    }

    const addressBuffer = Buffer.from(cleanAddress, 'hex')

    // Query contract by address
    const result = await pool.query(
      `SELECT 
        id,
        transaction_id,
        address,
        state,
        zswap_state,
        variant,
        attributes
      FROM contract_actions
      WHERE address = $1
      LIMIT 1`,
      [addressBuffer]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      )
    }

    const row = result.rows[0]
    const contract = {
      id: row.id,
      transactionId: row.transaction_id,
      address: bufferToHex(row.address),
      state: bufferToHex(row.state),
      zswapState: bufferToHex(row.zswap_state),
      variant: row.variant,
      attributes: row.attributes
    }

    return NextResponse.json({ contract })
  } catch (error) {
    console.error('❌ Error fetching contract:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contract' },
      { status: 500 }
    )
  }
}
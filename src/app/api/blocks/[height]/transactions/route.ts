import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

function bufferToHex(buffer: Buffer): string {
  return '0x' + buffer.toString('hex')
}

// ✅ FIXED: params must be Promise<{ height: string }>
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ height: string }> }
) {
  const { height } = await params
  const { searchParams } = request.nextUrl
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  // Verify block exists
  const blockRes = await pool.query(
    'SELECT height FROM blocks WHERE CAST(height AS TEXT) = $1',
    [height]
  )
  if (blockRes.rows.length === 0) {
    return NextResponse.json({ error: 'Block not found' }, { status: 404 })
  }

  const query = `
    SELECT t.*, b.timestamp 
    FROM transactions t 
    JOIN blocks b ON CAST(b.height AS TEXT) = t.block_id 
    WHERE CAST(t.block_id AS TEXT) = $1 
    ORDER BY t.id ASC 
    LIMIT $2 OFFSET $3
  `
  const { rows } = await pool.query(query, [height, limit, offset])

  const transactions = rows.map((tx) => ({
    hash: bufferToHex(tx.hash),
    status: (tx.apply_stage || '').toLowerCase(),
    timestamp: parseInt(tx.timestamp || '0'),
    size: tx.raw ? tx.raw.length : 0,
    protocol_version: parseInt(tx.protocol_version || '0'),
  }))

  const nextCursor = rows.length === limit ? (offset + limit).toString() : null

  return NextResponse.json({ transactions, nextCursor })
}
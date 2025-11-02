import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

function bufferToHex(buffer: Buffer): string {
  return '0x' + buffer.toString('hex')
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ height: string }> }
) {
  const { height: id } = await params
  let block

  try {
    // Try by height if it's a number
    if (!isNaN(parseInt(id))) {
      const { rows } = await pool.query(
        'SELECT * FROM blocks WHERE CAST(height AS TEXT) = $1',
        [id]
      )
      block = rows[0]
    } else {
      // Try by hash
      const hashStr = id.startsWith('0x') ? id.slice(2) : id
      if (hashStr.length !== 64 || !/^[0-9a-fA-F]+$/.test(hashStr)) {
        return NextResponse.json({ error: 'Invalid hash' }, { status: 400 })
      }
      const hashBuf = Buffer.from(hashStr, 'hex')
      const { rows } = await pool.query('SELECT * FROM blocks WHERE hash = $1', [hashBuf])
      block = rows[0]
    }

    if (!block) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 })
    }

    const countRes = await pool.query(
      'SELECT COUNT(*) FROM transactions WHERE block_id = CAST($1 AS TEXT)',
      [block.height]
    )
    const txCount = parseInt(countRes.rows[0].count)

    const formattedBlock = {
      height: parseInt(block.height),
      hash: bufferToHex(block.hash),
      parent_hash: bufferToHex(block.parent_hash),
      author: bufferToHex(block.author),
      timestamp: parseInt(block.timestamp),
      protocol_version: parseInt(block.protocol_version),
      txCount,
    }

    console.log('Formatted Block:', formattedBlock)

    return NextResponse.json({ block: formattedBlock })
  } catch (error) {
    console.error('Error fetching block:', error)
    return NextResponse.json(
      { error: 'Failed to fetch block' },
      { status: 500 }
    )
  }
}
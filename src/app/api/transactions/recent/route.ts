import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const query = `
      SELECT 
        t.id,
        t.hash,
        t.block_id,
        t.protocol_version,
        t.apply_stage as status,
        t.identifiers,
        t.merkle_tree_root,
        t.start_index,
        t.end_index,
        b.height as block_height,
        b.timestamp,
        LENGTH(t.raw) as size
      FROM transactions t
      LEFT JOIN blocks b ON t.block_id = b.id
      ORDER BY t.id DESC
      LIMIT 10
    `

    const result = await pool.query(query)
    const transactions = result.rows

    // Format transactions
    const formattedTransactions = transactions.map(tx => ({
      id: tx.id,
      hash: tx.hash,
      blockId: tx.block_id,
      blockHeight: tx.block_height ? parseInt(tx.block_height) : null,
      protocolVersion: tx.protocol_version,
      status: tx.status?.toLowerCase() || 'pending',
      identifiers: tx.identifiers,
      merkleTreeRoot: tx.merkle_tree_root,
      startIndex: tx.start_index,
      endIndex: tx.end_index,
      timestamp: tx.timestamp,
      size: tx.size
    }))

    return NextResponse.json(formattedTransactions)
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent transactions' },
      { status: 500 }
    )
  }
}
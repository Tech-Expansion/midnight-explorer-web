import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cursor = searchParams.get('cursor')
    const limit = 20

    let query = `
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
      LIMIT $1
    `
    
    const params = [limit + 1]
    
    if (cursor) {
      const cursorId = Number(cursor)
      if (Number.isNaN(cursorId)) {
        return NextResponse.json({ error: 'Invalid cursor' }, { status: 400 })
      }
      query = `
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
        WHERE t.id < $2
        ORDER BY t.id DESC
        LIMIT $1
      `
      params.push(cursorId)
    }

    const result = await pool.query(query, params)
    const transactions = result.rows

    let nextCursor = null
    if (transactions.length > limit) {
      const lastItem = transactions[limit - 1]
      nextCursor = lastItem.id
      transactions.pop()
    }

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

    return NextResponse.json({
      items: formattedTransactions,
      nextCursor
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}
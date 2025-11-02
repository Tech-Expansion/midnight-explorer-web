import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

function bufferToHex(buffer: Buffer | null): string | null {
  return buffer ? '0x' + buffer.toString('hex') : null
}

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const limit = 20

    let query: string
    // ✅ FIXED: Use (string | number)[] instead of any[]
    let queryParams: (string | number)[]

    if (cursor) {
      // Pagination: get contracts after cursor (older contracts)
      query = `
        SELECT 
          id,
          transaction_id,
          address,
          variant,
          attributes
        FROM contract_actions
        WHERE CAST(id AS BIGINT) < $1
        ORDER BY CAST(id AS BIGINT) DESC
        LIMIT $2
      `
      queryParams = [cursor, limit]
    } else {
      // First page: get latest contracts
      query = `
        SELECT 
          id,
          transaction_id,
          address,
          variant,
          attributes
        FROM contract_actions
        ORDER BY CAST(id AS BIGINT) DESC
        LIMIT $1
      `
      queryParams = [limit]
    }

    const result = await pool.query(query, queryParams)

    const contracts = result.rows.map(row => ({
      id: row.id,
      transactionId: row.transaction_id,
      address: bufferToHex(row.address),
      variant: row.variant,
      attributes: row.attributes
    }))

    // Get next cursor (ID of last contract)
    const nextCursor = contracts.length === limit 
      ? contracts[contracts.length - 1].id 
      : null

    return NextResponse.json({
      items: contracts,
      nextCursor
    })
  } catch (error) {
    console.error('❌ Error fetching contracts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    )
  }
}
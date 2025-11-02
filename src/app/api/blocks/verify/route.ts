import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

function bufferToHex(buffer: Buffer | null): string | null {
  return buffer ? '0x' + buffer.toString('hex') : null
}

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hash = searchParams.get('hash')

    if (!hash) {
      return NextResponse.json({ found: false, error: 'Missing hash parameter' }, { status: 400 })
    }

    console.log('🔍 Received block identifier:', hash)

    let query: string
    // ✅ FIXED: Use (string | Buffer)[] instead of any[]
    let queryParams: (string | Buffer)[]

    // ✅ Search by height (number)
    if (/^\d+$/.test(hash)) {
      console.log('📊 Searching by height:', hash)
      
      // ✅ FIX: Cast both sides to TEXT for comparison
      query = `
        SELECT 
          b.id,
          b.hash,
          b.height,
          b.protocol_version,
          b.parent_hash,
          b.author,
          b.timestamp
        FROM blocks b
        WHERE CAST(b.height AS TEXT) = $1
        LIMIT 1
      `
      queryParams = [hash]  // Pass as string
    } else {
      // ✅ Search by hash (Buffer)
      const cleanHash = hash.startsWith('0x') ? hash.slice(2) : hash
      
      if (!/^[0-9a-fA-F]{64}$/.test(cleanHash)) {
        console.log('❌ Invalid hash format:', cleanHash)
        return NextResponse.json({ found: false, error: 'Invalid hash format' }, { status: 400 })
      }

      console.log('🔑 Searching by hash:', cleanHash)
      const hashBuffer = Buffer.from(cleanHash, 'hex')

      query = `
        SELECT 
          b.id,
          b.hash,
          b.height,
          b.protocol_version,
          b.parent_hash,
          b.author,
          b.timestamp
        FROM blocks b
        WHERE b.hash = $1
        LIMIT 1
      `
      queryParams = [hashBuffer]
    }

    console.log('🔍 Executing query...')
    const result = await pool.query(query, queryParams)
    console.log('✅ Query returned rows:', result.rows.length)

    if (result.rows.length === 0) {
      console.log('❌ Block not found')
      return NextResponse.json({ found: false })
    }

    const block = result.rows[0]
    console.log('✅ Found block:', {
      height: block.height,
      hash: block.hash?.length
    })

    return NextResponse.json({
      found: true,
      type: 'block',
      value: block.height.toString(),  // ✅ Always return as string
      hash: bufferToHex(block.hash)
    })
  } catch (error) {
    console.error('❌ Error verifying block:', error)
    return NextResponse.json({ 
      found: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
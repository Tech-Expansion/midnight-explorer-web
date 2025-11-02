import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

function bufferToHex(buffer: Buffer | null): string | null {
  return buffer ? '0x' + buffer.toString('hex') : null;
}

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: Promise<{ hash: string }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    let { hash } = await context.params;
    console.log('Received transaction hash:', hash);

    // Strip '0x' prefix if present
    if (hash.startsWith('0x')) {
      hash = hash.slice(2);
    }

    // Validate hex format
    if (!/^[0-9a-fA-F]+$/.test(hash)) {
      return NextResponse.json({ error: 'Invalid hash format' }, { status: 400 });
    }

    // Convert hex string to Buffer
    let hashBuf: Buffer;
    try {
      hashBuf = Buffer.from(hash, 'hex');
      console.log('Hash buffer length:', hashBuf.length);
    } catch (error) {
      console.error('Buffer conversion error:', error);
      return NextResponse.json({ error: 'Invalid hash format' }, { status: 400 });
    }

    // Query with correct JOIN - block_id is a string representing height
    const query = `
      SELECT 
        t.id,
        t.hash,
        t.block_id,
        t.protocol_version,
        t.apply_stage as status,
        t.identifiers,
        t.raw,
        t.merkle_tree_root,
        t.start_index,
        t.end_index,
        b.height as block_height,
        b.timestamp,
        LENGTH(t.raw) as size
      FROM transactions t
      LEFT JOIN blocks b ON b.height = CAST(t.block_id AS INTEGER)
      WHERE t.hash = $1
      LIMIT 1
    `;

    console.log('Executing query...');
    const result = await pool.query(query, [hashBuf]);
    console.log('Query returned rows:', result.rows.length);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const tx = result.rows[0];
    console.log('Raw transaction data:', {
      id: tx.id,
      hash: tx.hash?.length,
      block_id: tx.block_id,
      block_height: tx.block_height,
      raw_size: tx.raw?.length
    });

    const formattedTransaction = {
      id: tx.id,
      hash: bufferToHex(tx.hash),
      blockId: tx.block_id,
      blockHeight: tx.block_height ? parseInt(tx.block_height) : null,
      protocolVersion: parseInt(tx.protocol_version),
      status: tx.status?.toLowerCase() || 'pending',
      identifiers: tx.identifiers ? tx.identifiers.map(bufferToHex) : [],
      merkleTreeRoot: bufferToHex(tx.merkle_tree_root),
      startIndex: parseInt(tx.start_index),
      endIndex: parseInt(tx.end_index),
      timestamp: tx.timestamp ? parseInt(tx.timestamp) : null,
      size: tx.size ? parseInt(tx.size) : null,
      raw: bufferToHex(tx.raw), // ✅ Thêm raw data
    };
    
    console.log('Formatted transaction:', {
      id: formattedTransaction.id,
      hash: formattedTransaction.hash,
      blockHeight: formattedTransaction.blockHeight,
      status: formattedTransaction.status,
      rawLength: formattedTransaction.raw?.length
    });

    return NextResponse.json(formattedTransaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction', details: String(error) },
      { status: 500 }
    );
  }
}
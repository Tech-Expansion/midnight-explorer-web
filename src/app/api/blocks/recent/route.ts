import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

function bufferToHex(buffer: Buffer): string {
  return '0x' + buffer.toString('hex');
}

export async function GET() {
  const limit = 10;
  const { rows } = await pool.query('SELECT * FROM blocks ORDER BY height DESC LIMIT $1', [limit]);

  const blocksPromises = rows.map(async (block) => {
    const countRes = await pool.query('SELECT COUNT(*) FROM transactions WHERE block_id = $1', [block.height]);
    const txCount = parseInt(countRes.rows[0].count);

    return {
      height: parseInt(block.height),
      hash: bufferToHex(block.hash),
      timestamp: parseInt(block.timestamp),
      txCount,
    };
  });

  const blocks = await Promise.all(blocksPromises);

  return NextResponse.json({ blocks });
}
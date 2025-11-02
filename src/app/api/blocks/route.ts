import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

function bufferToHex(buffer: Buffer): string {
  return '0x' + buffer.toString('hex');
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const cursor = searchParams.get('cursor');
  const limit = parseInt(searchParams.get('limit') || '20');

  let query = 'SELECT * FROM blocks ORDER BY height DESC LIMIT $1';
  let values: number[] = [limit];

  if (cursor) {
    query = 'SELECT * FROM blocks WHERE height < $1 ORDER BY height DESC LIMIT $2';
    values = [parseInt(cursor), limit];
  }

  const { rows } = await pool.query(query, values);

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

  const items = await Promise.all(blocksPromises);
  const nextCursor = rows.length === limit ? rows[rows.length - 1].height : null;

  return NextResponse.json({ items, nextCursor });
}
import { pool } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest){
    try{
        const result = await pool.query('select count(*) as count from transactions');
        const count = result.rows[0]?.count;
        return NextResponse.json({ count: parseInt(count, 10) });
        
    }
    catch(error){
        return NextResponse.json({ error: 'Failed to fetch transaction count' }, { status: 500 });
    }
}
import { NextRequest } from "next/server";
export async function GET(request: NextRequest) {
    const res = await fetch("https://www.okx.com/api/v5/market/ticker?instId=NIGHT-USDT");
    const json = await res.json();
    const item = json.data[0];
    const last = parseFloat(item.last);
    const open24h = parseFloat(item.open24h);
    const percentChange = ((last - open24h) / open24h) * 100;
    return new Response(JSON.stringify({
        price: last,
        percentChange: percentChange.toFixed(2) + "%"
    }));
}
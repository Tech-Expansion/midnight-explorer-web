import { NextRequest, NextResponse } from 'next/server'
import dotenv from 'dotenv'
import path from 'path'
//add path dir_name
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=NIGHT",
      {
        method: 'GET',
        headers: {
          'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY || '',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      console.error(`CoinMarketCap API error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: 'Failed to fetch token data', status: response.status },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Token API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch token data', message: String(error) },
      { status: 500 }
    )
  }
}

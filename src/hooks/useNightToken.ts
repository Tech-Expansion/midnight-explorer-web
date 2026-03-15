"use client"

import { useQuery } from "@tanstack/react-query"
import { generateAesKey, decryptAesGcm } from "@/lib/crypto"

interface TokenQuote {
  price: number
  volume_24h: number
  volume_change_24h: number
  percent_change_1h: number
  percent_change_24h: number
  percent_change_7d: number
  percent_change_30d: number
  market_cap: number
  market_cap_dominance: number
  fully_diluted_market_cap: number
  last_updated: string
}

interface TokenData {
  id: number
  name: string
  symbol: string
  slug: string
  cmc_rank: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  quote: {
    USD: TokenQuote
  }
}

interface TokenResponse {
  data: {
    NIGHT: TokenData
  }
}

async function fetchNightToken(): Promise<TokenData> {
  const { key, keyB64 } = await generateAesKey()

  const response = await fetch("/api/token-night-v2", {
    headers: { "x-mek": keyB64 },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Token API error: ${response.status}`)
  }

  const body = await response.json()
  const isEncrypted = response.headers.get("x-ect") === "1"

  let tokenResponse: TokenResponse
  if (isEncrypted && body.data) {
    tokenResponse = (await decryptAesGcm(body.data as string, key)) as TokenResponse
  } else {
    tokenResponse = body
  }

  return tokenResponse.data.NIGHT
}

/**
 * Fetch NIGHT token price.
 * Key is generated per-request in browser, response is encrypted in transit.
 */
export function useNightToken() {
  return useQuery<TokenData>({
    queryKey: ["nightToken"],
    queryFn: fetchNightToken,
    refetchInterval: 120000,
    staleTime: 60000,
  })
}

"use client"

import { useQuery } from "@tanstack/react-query"
import { tokenAPI } from "@/lib/api"

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

/**
 * Fetch NIGHT token price
 * Token is automatically handled by TokenProvider
 */
export function useNightToken() {
  return useQuery<TokenData>({
    queryKey: ['nightToken'],
    queryFn: async () => {
      const response = await tokenAPI.getNightToken<TokenResponse>()
      return response.data.NIGHT
    },
    refetchInterval: 120000, // Refresh every 2 minutes (matches BE cache TTL)
    staleTime: 60000, // Fresh for 1 minute
  })
}

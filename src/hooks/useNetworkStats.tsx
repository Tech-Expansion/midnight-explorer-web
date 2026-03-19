import { useQuery } from '@tanstack/react-query'
import { networkAPI } from '@/lib/api'

interface SideChainStatus {
  sidechainCurrentEpoch: number
  sidechainSlot: number
  nextEpochTimestamp: number
}

interface Block {
  height: number
}

interface OverviewResponse {
  latestBlock: Block | null
  totalTransactions: number
}

/**
 * Fetch network stats (sidechain status, latest block, tx count).
 * All 3 data sources are fetched in parallel:
 *   - networkAPI.getOverview()     → latestBlock + totalTransactions (single BE call, 2 concurrent DB queries)
 *   - networkAPI.getSidechainStatus() → RPC sidechain status
 */
export function useNetworkOverview() {
  return useQuery<OverviewResponse>({
    queryKey: ['networkOverview'],
    queryFn: () => networkAPI.getOverview<OverviewResponse>(),
    refetchInterval: 60000,
    staleTime: 10000,
  })
}

export function useSidechainStatus() {
  return useQuery<SideChainStatus>({
    queryKey: ['sidechainStatus'],
    queryFn: () => networkAPI.getSidechainStatus<SideChainStatus>(),
    refetchInterval: 60000,
    staleTime: 10000,
  })
}

/**
 * Fetch network stats (sidechain status, latest block, tx count).
 * Combined hook for components that need both (e.g. Home page).
 */
export function useNetworkStats() {
  const overview = useNetworkOverview();
  const sidechain = useSidechainStatus();

  return {
    data: {
      sidechainStatus: sidechain.data ?? null,
      latestBlock: overview.data?.latestBlock ?? null,
      totalTransactions: overview.data?.totalTransactions ?? null,
    },
    isLoading: overview.isLoading || sidechain.isLoading,
    error: overview.error || sidechain.error,
  };
}
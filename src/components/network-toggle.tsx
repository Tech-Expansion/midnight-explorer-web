"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Globe, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NetworkType, NETWORKS } from "@/lib/constants/common.constants"

// Helper function to detect network from domain
function getNetworkFromDomain(): NetworkType {
  if (typeof window === "undefined") return NetworkType.PREPROD
  
  const hostname = window.location.hostname
  
  // Check each network's domains array
  for (const [networkType, config] of Object.entries(NETWORKS)) {
    if (config.domains.some(domain => hostname.includes(domain))) {
      return networkType as NetworkType
    }
  }
  
  // Default for localhost and other domains. eg:
  // - localhost:8080 -> PREPROD
  // - midnightexplorer.com -> MAINNET (but current is PREPROD)
  return NetworkType.PREPROD
}

export function NetworkToggle() {
  const [network, setNetwork] = useState<NetworkType>(NetworkType.PREPROD)
  
  // Detect network on mount based on domain
  useEffect(() => {
    setNetwork(getNetworkFromDomain())
  }, [])

  const currentDisplay = NETWORKS[network]

  // Get all available networks in order
  const networks = Object.values(NetworkType)

  return (
    <DropdownMenu>
      {/* Nút chính hiển thị mạng hiện tại */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-border hover:bg-accent transition-colors bg-transparent"
        >
          <Globe className={`h-4 w-4 ${currentDisplay.iconColor}`} />
          <span className={`font-medium ${currentDisplay.color}`}>{currentDisplay.label}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      {/* Menu xổ xuống */}
      <DropdownMenuContent align="end" className="w-[210px]">
        {networks.map((networkType) => {
          const config = NETWORKS[networkType]
          const isCurrentNetwork = network === networkType

          return (
            <DropdownMenuItem
              key={networkType}
              onClick={() => config.enabled && window.open(`https://${config.domain}`, '_blank')}
              disabled={!config.enabled}
              className={
                config.enabled
                  ? "cursor-pointer flex flex-col items-start"
                  : "opacity-50 cursor-not-allowed flex flex-col items-start"
              }
            >
              <div className="flex items-center">
                <Globe className={`h-4 w-4 mr-2 ${config.iconColor}`} />
                <span className={`${config.color} font-medium`}>
                  {config.label}
                </span>
                {isCurrentNetwork && <span className="ml-2 text-xs">✓</span>}
              </div>
              <span className="text-xs text-muted-foreground ml-6">
                {config.enabled ? config.domain : config.message || "Coming soon"}
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

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
import { NetworkType, NETWORK_DOMAINS, NETWORK_DISPLAY } from "@/lib/constants/common.constants"

// Helper function to detect network from domain
function getNetworkFromDomain(): NetworkType {
  if (typeof window === "undefined") return NetworkType.TESTNET
  
  const hostname = window.location.hostname
  
  if (hostname.includes(NETWORK_DOMAINS[NetworkType.PREVIEW])) {
    return NetworkType.PREVIEW
  } else if (hostname.includes(NETWORK_DOMAINS[NetworkType.TESTNET])) {
    return NetworkType.TESTNET
  } else if (hostname.includes(NETWORK_DOMAINS[NetworkType.PREPROD])) {
    return NetworkType.PREPROD
  } else if (hostname.includes(NETWORK_DOMAINS[NetworkType.MAINNET])) {
    // mainnet domain -> default to testnet since mainnet doesn't exist yet
    return NetworkType.TESTNET
  }
  
  // Default for localhost and other domains
  return NetworkType.PREVIEW
}

export function NetworkToggle() {
  const [network, setNetwork] = useState<NetworkType>(NetworkType.TESTNET)
  
  // Detect network on mount based on domain
  useEffect(() => {
    setNetwork(getNetworkFromDomain())
  }, [])

  const currentDisplay = NETWORK_DISPLAY[network]

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
        {/* Preview item */}
        <DropdownMenuItem
          onClick={() => window.open(`https://${NETWORK_DOMAINS[NetworkType.PREVIEW]}`, '_blank')}
          className="cursor-pointer flex flex-col items-start"
        >
          <div className="flex items-center">
            <Globe className={`h-4 w-4 mr-2 ${NETWORK_DISPLAY[NetworkType.PREVIEW].iconColor}`} />
            <span className={`${NETWORK_DISPLAY[NetworkType.PREVIEW].color} font-medium`}>
              {NETWORK_DISPLAY[NetworkType.PREVIEW].label}
            </span>
            {network === NetworkType.PREVIEW && <span className="ml-2 text-xs">✓</span>}
          </div>
          <span className="text-xs text-muted-foreground ml-6">
            {NETWORK_DOMAINS[NetworkType.PREVIEW]}
          </span>
        </DropdownMenuItem>

        {/* Testnet item */}
        <DropdownMenuItem
          onClick={() => window.open(`https://${NETWORK_DOMAINS[NetworkType.TESTNET]}`, '_blank')}
          className="cursor-pointer flex flex-col items-start"
        >
          <div className="flex items-center">
            <Globe className={`h-4 w-4 mr-2 ${NETWORK_DISPLAY[NetworkType.TESTNET].iconColor}`} />
            <span className={`${NETWORK_DISPLAY[NetworkType.TESTNET].color} font-medium`}>
              {NETWORK_DISPLAY[NetworkType.TESTNET].label}
            </span>
            {network === NetworkType.TESTNET && <span className="ml-2 text-xs">✓</span>}
          </div>
          <span className="text-xs text-muted-foreground ml-6">
            {NETWORK_DOMAINS[NetworkType.TESTNET]}
          </span>
        </DropdownMenuItem>

        
        {/* Preprod item */}
        <DropdownMenuItem
          onClick={() => window.open(`https://${NETWORK_DOMAINS[NetworkType.PREPROD]}`, '_blank')}
          className="cursor-pointer flex flex-col items-start"
        >
          <div className="flex items-center">
            <Globe className={`h-4 w-4 mr-2 ${NETWORK_DISPLAY[NetworkType.PREPROD].iconColor}`} />
            <span className={`${NETWORK_DISPLAY[NetworkType.PREPROD].color} font-medium`}>
              {NETWORK_DISPLAY[NetworkType.PREPROD].label}
            </span>
            {network === NetworkType.PREPROD && <span className="ml-2 text-xs">✓</span>}
          </div>
          <span className="text-xs text-muted-foreground ml-6">
            {NETWORK_DOMAINS[NetworkType.PREPROD]}
          </span>
        </DropdownMenuItem>

        {/* Mainnet item */}
        <DropdownMenuItem
          disabled
          className="opacity-50 cursor-not-allowed flex flex-col items-start"
        >
          <div className="flex items-center">
            <Globe className={`h-4 w-4 mr-2 ${NETWORK_DISPLAY[NetworkType.MAINNET].iconColor}`} />
            <span className={`${NETWORK_DISPLAY[NetworkType.MAINNET].color} font-medium`}>
              {NETWORK_DISPLAY[NetworkType.MAINNET].label}
            </span>
          </div>
          <span className="text-xs text-muted-foreground ml-6">Upcoming</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

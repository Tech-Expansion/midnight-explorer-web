"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NetworkToggle() {
  const [network, setNetwork] = useState<"mainnet" | "preview">("preview")

  return (
    <DropdownMenu>
      {/* Nút chính hiển thị Preview */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-border hover:bg-accent transition-colors bg-transparent"
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium text-amber-400">Preview</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      {/* Menu xổ xuống */}
      <DropdownMenuContent align="end" className="w-[210px]">
        {/* Preview item */}
        <DropdownMenuItem
          onClick={() => setNetwork("preview")}
          className="cursor-pointer flex flex-col items-start"
        >
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2 text-amber-400" />
            <span className="text-amber-400 font-medium">Preview</span>
          </div>
          <a
            href="https://preview.midnightexplorer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground underline ml-6 hover:text-primary transition-colors"
          >
            preview.midnightexplorer.com
          </a>
        </DropdownMenuItem>

        {/* Mainnet item */}
        <DropdownMenuItem
          disabled
          className="opacity-50 cursor-not-allowed flex flex-col items-start"
        >
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2 text-green-400" />
            <span className="text-green-400 font-medium">Mainnet</span>
          </div>
          <span className="text-xs text-muted-foreground ml-6">Upcoming</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

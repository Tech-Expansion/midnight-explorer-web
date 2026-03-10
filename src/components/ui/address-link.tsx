import Link from "next/link"
import { CopyButton } from "@/components/ui/copy-button"
import { cn } from "@/lib/utils"

interface AddressLinkProps {
    address: string
    truncate?: boolean
    showCopy?: boolean
    className?: string
}

export function AddressLink({ address, truncate = true, showCopy = true, className = "" }: AddressLinkProps) {
    if (!address || address === "-" || address === "N/A") return <span className="text-muted-foreground">-</span>

    const displayAddress = truncate && address.length > 16 ? `${address.slice(0, 8)}...${address.slice(-8)}` : address
    const href = `/address/${address}`

    return (
        <div className={cn("flex items-center gap-1.5 group", className)}>
            <Link href={href} className="font-mono text-primary hover:text-primary/80 hover:underline transition-colors text-sm">
                {displayAddress}
            </Link>
            {showCopy && (
                <div className="opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity focus-within:opacity-100">
                    <CopyButton text={address} className="h-4 w-4" />
                </div>
            )}
        </div>
    )
}

import Link from "next/link"
import { CopyButton } from "@/components/ui/copy-button"
import { cn } from "@/lib/utils"

interface HashLinkProps {
    hash: string
    type?: 'tx' | 'block'
    truncate?: boolean
    showCopy?: boolean
    className?: string
}

export function HashLink({
    hash,
    type = 'tx',
    truncate = true,
    showCopy = true,
    className = ""
}: HashLinkProps) {

    const displayHash =
        truncate && hash.length > 20
            ? `${hash.slice(0, 10)}...${hash.slice(-10)}`
            : hash

    const href = type === 'tx'
        ? `/tx/${hash}`
        : `/block/${hash}`

    return (
        <div className={cn("group flex items-center gap-1.5", className)}>
            <Link
                href={href}
                className="font-mono text-primary hover:text-primary/80 hover:underline transition-colors text-sm"
            >
                {displayHash}
            </Link>

            {showCopy && (
                <div className="opacity-0 group-hover:opacity-100 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <CopyButton text={hash} className="h-4 w-4" />
                </div>
            )}
        </div>
    )
}
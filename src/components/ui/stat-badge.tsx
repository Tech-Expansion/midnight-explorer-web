import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatBadgeProps {
    label?: string
    value?: ReactNode
    children?: ReactNode
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
    className?: string
}

export function StatBadge({
    label,
    value,
    children,
    variant = "outline",
    className
}: StatBadgeProps) {

    let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline"
    let colorClass = ""

    if (variant === "success") {
        colorClass = "bg-green-500/10 text-green-600 border-green-500/20"
    } else if (variant === "warning") {
        colorClass = "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
    } else if (variant === "outline") {
        badgeVariant = "outline"
        colorClass = "border-border text-muted-foreground bg-accent/20"
    } else {
        badgeVariant = variant as "default" | "secondary" | "destructive" | "outline"
    }

    return (
        <Badge
            variant={badgeVariant}
            className={cn("font-mono text-xs font-normal", colorClass, className)}
        >
            {label && (
                <span className="opacity-70 mr-1">
                    {label}:
                </span>
            )}

            <span className="font-medium">
                {children || value || "-"}
            </span>
        </Badge>
    )
}
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/clsxUtils"
import { LucideIcon } from "lucide-react"

const badgeVariants = cva(
    "inline-flex items-center gap-2 rounded-full border px-3 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                primary: "border-transparent bg-primary text-white hover:bg-primary/80",
                "primary-outline": "border-primary bg-primary/10 text-primary hover:bg-primary/20",

                secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
                emerald: "bg-emerald-100 border-emerald-200 text-emerald-700",
                purple: "bg-purple-100 border-purple-200 text-purple-700",
                blue: "bg-blue-100 border-blue-200 text-blue-700",
                red: "bg-red-100 border-red-200 text-red-700",
                pink: "bg-pink-50 text-pink-700 border-pink-200",
                amber: "bg-amber-100 border-amber-200 text-amber-700",
                solid: "bg-emerald-600 border-emerald-600 text-white",
            },
            severity: {
                low: "bg-emerald-50 border-emerald-200 text-emerald-600",
                medium: "bg-blue-50 border-blue-200 text-blue-600",
                high: "bg-red-50 border-red-200 text-red-600",
            },
        },
        defaultVariants: {
            variant: "primary",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    variant?: "primary" | "primary-outline" | "secondary" | "destructive" | "outline" | "emerald" | "purple" | "blue" | "amber" | "solid" | "red" | "pink"
    severity?: "low" | "medium" | "high"
    label?: string
    icon?: LucideIcon
}

function Badge({ className, variant, severity, label, icon, ...props }: BadgeProps) {
    const BadgeIcon = icon
    const BadgeLabel = label

    return (
        <div
            className={cn(
                badgeVariants({ variant, severity }),
                "text-[13px] font-medium mb-2",
                className
            )}
            {...props}
        >
            {BadgeIcon && <BadgeIcon size={16} />}
            {BadgeLabel && <span>{BadgeLabel}</span>}
        </div>
    )
}

export { Badge, badgeVariants }
import React from "react";
import { cn } from "@/lib/utils/clsxUtils";

interface ChipProps {
    readonly label: string;
    readonly icon?: React.ReactNode;
    readonly variant?: "primary" | "neutral" | "success";
    readonly className?: string;
}

const variantClasses: Record<NonNullable<ChipProps["variant"]>, string> = {
    primary: "border-blue-200 bg-white/80 text-neutral-600",
    neutral: "border-neutral-200 bg-neutral-50 text-neutral-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export const Chip = ({ label, icon, variant = "neutral", className }: ChipProps) => {
    return (
        <span
            className={cn(
                "mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm backdrop-blur",
                variantClasses[variant],
                className,
            )}
        >
            {icon}
            {label}
        </span>
    );
};

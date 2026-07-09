"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils/clsxUtils"

export type FilterOption = {
    value: string | number
    label: string
    icon?: LucideIcon
    iconNode?: ReactNode
    metaLabel?: string
}

interface FilterDropdownProps {
    options: FilterOption[]
    value: string | number
    onChange: (value: string | number) => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
    placeholder?: string
    triggerIcon?: LucideIcon
    triggerIconNode?: ReactNode
    theme?: "primary" | "emerald" | "amber" | "blue" | "purple" | "slate"
    contentClassName?: string
    classNames?: {
        trigger?: string;
        triggerButton?: string;
        content?: string;
    }
}

const THEME_CLASS = {
    primary: {
        triggerIcon: "text-primary-600",
        triggerFocus:
            "focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100/90",
        selectedItem: "bg-primary-50 text-primary-900 hover:bg-primary-100 data-[highlighted]:bg-primary-100",
        selectedIcon: "text-primary-700",
    },
    emerald: {
        triggerIcon: "text-emerald-600",
        triggerFocus:
            "focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100/90",
        selectedItem: "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 data-[highlighted]:bg-emerald-100",
        selectedIcon: "text-emerald-700",
    },
    amber: {
        triggerIcon: "text-amber-600",
        triggerFocus:
            "focus-within:border-amber-300 focus-within:ring-2 focus-within:ring-amber-100/90",
        selectedItem: "bg-amber-50 text-amber-950 hover:bg-amber-100 data-[highlighted]:bg-amber-100",
        selectedIcon: "text-amber-700",
    },
    blue: {
        triggerIcon: "text-blue-600",
        triggerFocus: "focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100/90",
        selectedItem: "bg-blue-50 text-blue-900 hover:bg-blue-100 data-[highlighted]:bg-blue-100",
        selectedIcon: "text-blue-700",
    },
    purple: {
        triggerIcon: "text-purple-600",
        triggerFocus:
            "focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-100/90",
        selectedItem: "bg-purple-50 text-purple-900 hover:bg-purple-100 data-[highlighted]:bg-purple-100",
        selectedIcon: "text-purple-700",
    },
    slate: {
        triggerIcon: "text-gray-600",
        triggerFocus: "focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-gray-100/90",
        selectedItem: "bg-gray-100 text-gray-900 hover:bg-gray-200 data-[highlighted]:bg-gray-200",
        selectedIcon: "text-gray-700",
    },
} as const

const FilterDropdown = ({
    options,
    value,
    onChange,
    open: controlledOpen,
    onOpenChange,
    placeholder = "Filter",
    triggerIcon: TriggerIconFallback,
    triggerIconNode,
    theme = "primary",
    classNames,
}: FilterDropdownProps) => {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = controlledOpen ?? internalOpen

    const setOpen = (nextOpen: boolean) => {
        if (controlledOpen === undefined) {
            setInternalOpen(nextOpen)
        }
        onOpenChange?.(nextOpen)
    }
    const selected = options.find((o) => o.value === value)
    const label = selected?.label ?? placeholder
    const TriggerIcon = selected?.icon ?? TriggerIconFallback
    const selectedIconNode = selected?.iconNode ?? triggerIconNode

    const t = THEME_CLASS[theme]

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
                asChild
                className="w-full min-w-0 outline-none focus:outline-none 
                focus-visible:outline-none select-none cursor-pointer"
            >
                <button
                    type="button"
                    className={cn(
                        "flex w-full min-w-0 cursor-pointer items-center justify-between gap-2",
                        "rounded-md border border-gray-200 bg-white px-3",
                        "text-sm font-medium text-gray-700 transition-[color,box-shadow,border-color]",
                        "outline-none hover:bg-gray-50",
                        t.triggerFocus,
                        "h-10",
                        classNames?.triggerButton
                    )}
                    aria-expanded={open}
                >
                    <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
                        {selectedIconNode ? (
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
                                {selectedIconNode}
                            </span>
                        ) : TriggerIcon ? (
                            <TriggerIcon
                                className={cn("h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4", t.triggerIcon)}
                                aria-hidden
                            />
                        ) : null}
                        <span className="truncate text-left">{label}</span>
                    </span>
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
                            open ? "rotate-180" : ""
                        )}
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                sideOffset={6}
                className={cn(
                    "w-[var(--radix-dropdown-menu-trigger-width)] min-w-[var(--radix-dropdown-menu-trigger-width)] scrollbar-thin",
                    "max-h-80 overflow-y-auto border border-gray-200 bg-white p-1 text-sm shadow-md select-none",
                    classNames?.content
                )}
            >
                {options.map((opt) => {
                    const RowIcon = opt.icon
                    return (
                        <DropdownMenuItem
                            key={String(opt.value)}
                            onClick={() => {
                                onChange(opt.value)
                                setOpen(false)
                            }}
                            className={cn(
                                "relative flex cursor-pointer items-center justify-between gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none",
                                "mb-0.5 last:mb-0 transition-colors",
                                value === opt.value
                                    ? t.selectedItem
                                    : "text-gray-700 hover:bg-gray-50 data-[highlighted]:bg-gray-50"
                            )}
                        >
                            <p className="flex min-w-0 flex-1 items-center gap-2 truncate">
                                {opt.iconNode ? (
                                    <span className="flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
                                        {opt.iconNode}
                                    </span>
                                ) : RowIcon ? (
                                    <RowIcon
                                        className={cn(
                                            "h-4 w-4 shrink-0",
                                            value === opt.value ? t.selectedIcon : "text-gray-500"
                                        )}
                                        aria-hidden
                                    />
                                ) : null}
                                <span className="truncate text-sm font-medium">{opt.label}</span>
                                {opt.metaLabel ? (
                                    <span className="ml-1 rounded-full border border-gray-200 bg-gray-50 text-[10px] leading-none py-1
                                    font-medium tabular-nums text-gray-600 flex items-center justify-center w-max h-max px-1.5 truncate">
                                        {opt.metaLabel}
                                    </span>
                                ) : null}
                            </p>

                            {value === opt.value && (
                                <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                    <Check className="h-4 w-4 shrink-0" strokeWidth={2} />
                                </span>
                            )}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


export default FilterDropdown
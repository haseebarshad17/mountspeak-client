'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function SeatStepper({
    label,
    value,
    onChange,
    min = 0,
    max = 50,
    className,
}: {
    label: string
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    className?: string
}) {
    return (
        <div
            className={cn(
                'flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-[#EBE8E3]',
                className
            )}
        >
            <span className="text-sm font-medium text-[#4B5563]">{label}</span>
            <div className="flex shrink-0 items-center gap-1.5">
                <button
                    type="button"
                    aria-label={`Decrease ${label}`}
                    disabled={value <= min}
                    onClick={() => onChange(Math.max(min, value - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F3F0] text-[#1A1F2C] transition hover:bg-[#EBE8E3] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[1.5rem] text-center text-base font-semibold tabular-nums text-[#1A1F2C]">
                    {value}
                </span>
                <button
                    type="button"
                    aria-label={`Increase ${label}`}
                    disabled={value >= max}
                    onClick={() => onChange(Math.min(max, value + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F3F0] text-[#1A1F2C] transition hover:bg-[#EBE8E3] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Plus className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    )
}

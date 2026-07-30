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
                'flex h-11 items-center justify-between gap-3 rounded-xl border border-black/10 bg-white px-3.5',
                className
            )}
        >
            <span className="shrink-0 text-sm text-[#555]">{label}</span>
            <div className="flex shrink-0 items-center gap-1.5">
                <button
                    type="button"
                    aria-label={`Decrease ${label}`}
                    disabled={value <= min}
                    onClick={() => onChange(Math.max(min, value - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-[#111] transition hover:bg-[#F7F3EE] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Minus className="h-3 w-3" />
                </button>
                <span className="w-5 text-center text-sm font-semibold tabular-nums text-[#111]">
                    {value}
                </span>
                <button
                    type="button"
                    aria-label={`Increase ${label}`}
                    disabled={value >= max}
                    onClick={() => onChange(Math.min(max, value + 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-[#111] transition hover:bg-[#F7F3EE] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Plus className="h-3 w-3" />
                </button>
            </div>
        </div>
    )
}

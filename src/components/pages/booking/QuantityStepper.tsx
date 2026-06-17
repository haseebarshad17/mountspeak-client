'use client'

import { Minus, Plus } from 'lucide-react'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { cn } from '@/lib/utils/clsxUtils'

export type QuantityStepperHandle = {
    commit: () => number
}

type QuantityStepperProps = {
    label: string
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    className?: string
}

function clampSeatValue(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}

export const QuantityStepper = forwardRef<QuantityStepperHandle, QuantityStepperProps>(
    function QuantityStepper(
        { label, value, onChange, min = 0, max = Number.MAX_SAFE_INTEGER, className },
        ref,
    ) {
        const [draft, setDraft] = useState(String(value))

        useEffect(() => {
            setDraft(String(value))
        }, [value])

        const applyDraft = useCallback((raw: string): number => {
            const digits = raw.replace(/\D/g, '')
            if (!digits) {
                onChange(min)
                setDraft(String(min))
                return min
            }

            const parsed = Number.parseInt(digits, 10)
            const next = clampSeatValue(parsed, min, max)
            onChange(next)
            setDraft(String(next))
            return next
        }, [max, min, onChange])

        useImperativeHandle(
            ref,
            () => ({
                commit: () => applyDraft(draft),
            }),
            [applyDraft, draft],
        )

        const decrement = () => onChange(clampSeatValue(value - 1, min, max))
        const increment = () => onChange(clampSeatValue(value + 1, min, max))

        return (
            <div className={cn('flex items-center justify-between gap-4', className)}>
                <span className='text-sm font-semibold text-neutral-800'>{label}</span>

                <div className='flex shrink-0 items-center gap-2'>
                    <button
                        type='button'
                        onClick={decrement}
                        disabled={value <= min}
                        aria-label={`Decrease ${label}`}
                        className='flex h-9 w-9 items-center justify-center rounded-full border border-primary-700 text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40'
                    >
                        <Minus className='h-4 w-4' strokeWidth={2.5} />
                    </button>

                    <input
                        type='text'
                        inputMode='numeric'
                        pattern='[0-9]*'
                        value={draft}
                        aria-label={label}
                        onChange={(event) => {
                            const digits = event.target.value.replace(/\D/g, '')
                            setDraft(digits)
                        }}
                        onBlur={() => {
                            applyDraft(draft)
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault()
                                applyDraft(draft)
                            }
                        }}
                        className='flex h-11 w-[72px] items-center justify-center rounded-sm border border-gray-300 bg-neutral-100 px-2 text-center text-sm font-medium text-neutral-800 outline-none focus:ring-2 focus:ring-primary-700/30'
                    />

                    <button
                        type='button'
                        onClick={increment}
                        disabled={value >= max}
                        aria-label={`Increase ${label}`}
                        className='flex h-9 w-9 items-center justify-center rounded-full border border-primary-700 text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40'
                    >
                        <Plus className='h-4 w-4' strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        )
    },
)

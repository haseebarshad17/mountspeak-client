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
    variant?: 'default' | 'field'
}

function clampSeatValue(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}

export const QuantityStepper = forwardRef<QuantityStepperHandle, QuantityStepperProps>(
    function QuantityStepper(
        { label, value, onChange, min = 0, max = Number.MAX_SAFE_INTEGER, className, variant = 'default' },
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

        const isFieldVariant = variant === 'field'
        const labelClassName = isFieldVariant
            ? 'min-w-0 flex-1 truncate text-sm font-normal leading-6 tracking-normal text-neutral-400 sm:text-base'
            : 'text-sm font-semibold text-neutral-800'
        const buttonClassName = isFieldVariant
            ? 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary-700 text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9'
            : 'flex h-9 w-9 items-center justify-center rounded-full border border-primary-700 text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40'
        const inputClassName = isFieldVariant
            ? 'flex h-8 w-10 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 px-1 text-center text-sm font-normal leading-6 tracking-normal text-neutral-900 outline-none focus:ring-2 focus:ring-primary-700/30 sm:h-9 sm:w-11 sm:text-base'
            : 'flex h-11 w-[72px] items-center justify-center rounded-sm border border-gray-300 bg-neutral-100 px-2 text-center text-sm font-medium text-neutral-800 outline-none focus:ring-2 focus:ring-primary-700/30'

        return (
            <div
                className={cn(
                    'flex items-center justify-between gap-2',
                    isFieldVariant &&
                        'box-border h-12 w-full min-w-0 max-w-full rounded-[10px] bg-white px-3 font-roboto shadow-sm sm:h-[58px] sm:gap-3 sm:px-4',
                    className,
                )}
            >
                <span className={labelClassName}>{label}</span>

                <div className='flex shrink-0 items-center gap-1.5 sm:gap-2'>
                    <button
                        type='button'
                        onClick={decrement}
                        disabled={value <= min}
                        aria-label={`Decrease ${label}`}
                        className={buttonClassName}
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
                        className={inputClassName}
                    />

                    <button
                        type='button'
                        onClick={increment}
                        disabled={value >= max}
                        aria-label={`Increase ${label}`}
                        className={buttonClassName}
                    >
                        <Plus className='h-4 w-4' strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        )
    },
)

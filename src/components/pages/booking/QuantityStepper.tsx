'use client'

import { Minus, Plus } from 'lucide-react'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { HP_THEME_BORDER_CLASS } from '@/data/homepage'
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
            ? 'min-w-0 flex-1 truncate text-sm font-normal leading-6 tracking-normal text-neutral-500 sm:text-base'
            : cn('text-sm font-semibold', 'text-[var(--hp-color-primary)]')
        const buttonClassName = isFieldVariant
            ? cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition hover:bg-[color-mix(in_srgb,var(--hp-color-primary)_8%,white)] disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9',
                HP_THEME_BORDER_CLASS,
                'text-[var(--hp-color-primary)]',
            )
            : cn(
                'flex h-9 w-9 items-center justify-center rounded-full border transition hover:bg-[color-mix(in_srgb,var(--hp-color-primary)_8%,white)] disabled:cursor-not-allowed disabled:opacity-40',
                HP_THEME_BORDER_CLASS,
                'text-[var(--hp-color-primary)]',
            )
        const inputClassName = isFieldVariant
            ? 'flex h-8 w-10 shrink-0 items-center justify-center rounded-md border border-[#D5DADD] bg-white px-1 text-center text-sm font-normal leading-6 tracking-normal text-neutral-900 outline-none focus:ring-2 focus:ring-[var(--hp-color-primary)]/25 sm:h-9 sm:w-11 sm:text-base'
            : 'flex h-11 w-[72px] items-center justify-center rounded-[10px] border border-[#D5DADD] bg-white px-2 text-center text-sm font-medium text-neutral-800 outline-none focus:ring-2 focus:ring-[var(--hp-color-primary)]/25'

        return (
            <div
                className={cn(
                    'flex items-center justify-between gap-2',
                    isFieldVariant &&
                        'box-border h-11 w-full min-w-0 max-w-full rounded-[10px] bg-white px-3 font-roboto shadow-sm sm:gap-3 sm:px-4',
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

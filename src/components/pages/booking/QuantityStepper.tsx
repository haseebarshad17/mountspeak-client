'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils/clsxUtils'

type QuantityStepperProps = {
    label: string
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    className?: string
}

export function QuantityStepper({
    label,
    value,
    onChange,
    min = 0,
    max = 10,
    className,
}: QuantityStepperProps) {
    const decrement = () => onChange(Math.max(min, value - 1))
    const increment = () => onChange(Math.min(max, value + 1))

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

                <span
                    className='flex h-11 min-w-[52px] items-center justify-center rounded-sm border border-gray-300 bg-neutral-100 px-3 text-sm font-medium text-neutral-800'
                    aria-live='polite'
                >
                    {value}
                </span>

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
}

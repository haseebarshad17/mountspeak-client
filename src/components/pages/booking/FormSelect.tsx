'use client'

import FilterDropdown from '@/components/generic/FilterDropdown'
import { cn } from '@/lib/utils/clsxUtils'
import type { ChangeEvent } from 'react'
import { useState } from 'react'

import { bookingFieldInputClassName, bookingFieldLabelClassName } from './booking-form-ui'

type FormSelectProps = {
    label: string
    required?: boolean
    className?: string
    placeholder?: string
    defaultValue?: string
    value?: string
    options: { value: string; label: string }[]
    error?: string
    /** UI-only — dropdown not interactive */
    staticField?: boolean
    onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
}

export function FormSelect({
    label,
    required,
    className,
    placeholder = 'Select an option',
    defaultValue = '',
    value,
    options,
    error,
    staticField = true,
    onChange,
}: FormSelectProps) {
    const invalid = !!error
    const [internalValue, setInternalValue] = useState(defaultValue)
    const selectedValue = value ?? internalValue

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <label className={bookingFieldLabelClassName}>
                {label}
                {required && <span className='text-red-400'> *</span>}
            </label>

            <div className={cn(staticField && 'pointer-events-none')}>
                <FilterDropdown
                    options={options}
                    value={selectedValue}
                    onChange={(next) => {
                        if (staticField) return
                        const nextValue = String(next)
                        setInternalValue(nextValue)
                        onChange?.({
                            target: { value: nextValue },
                        } as ChangeEvent<HTMLSelectElement>)
                    }}
                    placeholder={placeholder}
                    theme='slate'
                    classNames={{
                        triggerButton: cn(
                            bookingFieldInputClassName,
                            'h-auto min-h-10',
                            selectedValue ? 'text-neutral-800' : 'text-neutral-400',
                            invalid && 'border-red-400 focus:ring-red-200',
                            staticField && 'cursor-default',
                        ),
                    }}
                />
            </div>

            {error ? <p className='text-xs text-red-500'>{error}</p> : null}
        </div>
    )
}

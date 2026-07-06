import { cn } from '@/lib/utils/clsxUtils'
import type { ChangeEvent } from 'react'

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
    const selectedValue = value ?? defaultValue ?? ''
    const hasSelection = selectedValue !== ''

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <label className={bookingFieldLabelClassName}>
                {label}
                {required && <span className='text-red-400'> *</span>}
            </label>

            <select
                defaultValue={value === undefined ? defaultValue : undefined}
                value={value}
                onChange={staticField ? undefined : onChange}
                tabIndex={staticField ? -1 : undefined}
                aria-readonly={staticField || undefined}
                aria-invalid={invalid || undefined}
                className={cn(
                    bookingFieldInputClassName,
                    'appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10',
                    hasSelection ? 'text-neutral-800' : 'text-neutral-400',
                    invalid && 'border-red-400 focus:ring-red-200',
                    staticField && 'pointer-events-none cursor-default',
                )}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                }}
            >
                <option value='' disabled className='text-neutral-400'>
                    {placeholder}
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className='text-neutral-800'>
                        {opt.label}
                    </option>
                ))}
            </select>

            {error ? <p className='text-xs text-red-500'>{error}</p> : null}
        </div>
    )
}

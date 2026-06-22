import { cn } from '@/lib/utils/clsxUtils'
import type { ChangeEvent } from 'react'

const chevronBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`

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
            <label className='block text-sm font-medium text-neutral-700'>
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
                    'h-10 w-full appearance-none rounded-sm border border-gray-300 bg-neutral-50 bg-[length:16px] bg-[right_12px_center] bg-no-repeat px-3 pr-10 text-sm outline-none transition focus:border-primary-600 focus:ring-1 focus:ring-primary-600 sm:h-11',
                    hasSelection ? 'text-neutral-800' : 'text-neutral-400',
                    invalid && 'border-red-400 focus:border-red-500 focus:ring-0',
                    staticField && 'pointer-events-none cursor-default',
                )}
                style={{
                    backgroundImage: chevronBg,
                    color: hasSelection ? '#262626' : '#a3a3a3',
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

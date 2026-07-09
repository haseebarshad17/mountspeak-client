'use client'

import FilterDropdown from '@/components/generic/FilterDropdown'
import { cn } from '@/lib/utils/clsxUtils'

export const BOOKING_FORM_TRIGGER_CLASS =
    'box-border flex h-11 w-full min-w-0 max-w-full items-center justify-between gap-2 rounded-[10px] border-0 bg-white px-4 font-roboto text-sm font-normal leading-6 tracking-normal text-neutral-900 shadow-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base'

export type BookingFormSelectOption = {
    value: string
    label: string
}

type BookingFormSelectProps = {
    name: string
    value: string
    onChange: (value: string) => void
    placeholder: string
    options: BookingFormSelectOption[]
    disabled?: boolean
    searchable?: boolean
    searchPlaceholder?: string
    noResultsMessage?: string
    'aria-label': string
}

export function BookingFormSelect({
    name,
    value,
    onChange,
    placeholder,
    options,
    disabled = false,
    'aria-label': ariaLabel,
}: BookingFormSelectProps) {
    return (
        <>
            <input type='hidden' name={name} value={value} />
            <div
                className={cn(disabled && 'pointer-events-none opacity-60')}
                aria-label={ariaLabel}
            >
                <FilterDropdown
                    options={options}
                    value={value}
                    onChange={(next) => onChange(String(next))}
                    placeholder={placeholder}
                    theme='slate'
                    classNames={{ triggerButton: BOOKING_FORM_TRIGGER_CLASS }}
                />
            </div>
        </>
    )
}

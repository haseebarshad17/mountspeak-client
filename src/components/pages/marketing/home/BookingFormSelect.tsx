'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils/clsxUtils'
import { ChevronDown, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

export const BOOKING_FORM_TRIGGER_CLASS =
    'box-border flex h-12 w-full min-w-0 max-w-full items-center justify-between gap-2 rounded-[10px] border-0 bg-white px-4 font-roboto text-sm font-normal leading-6 tracking-normal text-neutral-900 shadow-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-60 sm:h-[58px] sm:text-base'

const popoverPanelClass =
    'z-[110] w-[var(--radix-popover-trigger-width)] max-w-[min(var(--radix-popover-trigger-width),calc(100vw-2rem))] min-w-0 overflow-hidden rounded-[10px] border border-neutral-200 bg-white p-0 shadow-lg'

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
    searchable = false,
    searchPlaceholder = 'Search...',
    noResultsMessage = 'No results found',
    'aria-label': ariaLabel,
}: BookingFormSelectProps) {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const searchRef = useRef<HTMLInputElement>(null)

    const selectedLabel = options.find((option) => option.value === value)?.label

    const filteredOptions = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase()
        if (!normalizedQuery) return options
        return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery))
    }, [options, query])

    useEffect(() => {
        if (!open) {
            setQuery('')
            return
        }

        if (!searchable) return

        const frame = requestAnimationFrame(() => searchRef.current?.focus())
        return () => cancelAnimationFrame(frame)
    }, [open, searchable])

    const handleSelect = (nextValue: string) => {
        onChange(nextValue)
        setOpen(false)
    }

    return (
        <>
            <input type='hidden' name={name} value={value} />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild disabled={disabled}>
                    <button
                        type='button'
                        className={BOOKING_FORM_TRIGGER_CLASS}
                        aria-label={ariaLabel}
                        aria-haspopup='listbox'
                        aria-expanded={open}
                    >
                        <span
                            className={cn(
                                'min-w-0 flex-1 truncate text-left',
                                !value && 'text-neutral-400',
                            )}
                        >
                            {selectedLabel ?? placeholder}
                        </span>
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 shrink-0 text-neutral-400 transition-transform',
                                open && 'rotate-180',
                            )}
                            aria-hidden
                        />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    align='start'
                    collisionPadding={12}
                    className={cn(popoverPanelClass, 'max-h-60')}
                >
                    {searchable ? (
                        <div className='sticky top-0 z-10 border-b border-neutral-100 bg-white p-2'>
                            <div className='relative min-w-0'>
                                <Search
                                    className='pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400'
                                    aria-hidden
                                />
                                <input
                                    ref={searchRef}
                                    type='text'
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') event.preventDefault()
                                    }}
                                    placeholder={searchPlaceholder}
                                    className='h-9 w-full min-w-0 rounded-md border border-neutral-200 bg-neutral-50 pl-8 pr-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white'
                                />
                            </div>
                        </div>
                    ) : null}
                    <ul
                        role='listbox'
                        aria-label={ariaLabel}
                        className='max-h-52 overflow-x-hidden overflow-y-auto p-1'
                    >
                        {filteredOptions.length === 0 ? (
                            <li className='px-3 py-2.5 text-sm text-neutral-500'>{noResultsMessage}</li>
                        ) : (
                            filteredOptions.map((option) => (
                                <li key={option.value} role='option' aria-selected={value === option.value}>
                                    <button
                                        type='button'
                                        onClick={() => handleSelect(option.value)}
                                        className={cn(
                                            'w-full min-w-0 truncate rounded-md px-3 py-2.5 text-left text-sm font-normal leading-6 text-neutral-900 transition-colors hover:bg-neutral-100',
                                            value === option.value && 'bg-neutral-100 font-medium',
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </PopoverContent>
            </Popover>
        </>
    )
}

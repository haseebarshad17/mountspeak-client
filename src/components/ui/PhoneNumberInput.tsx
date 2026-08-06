'use client'

import * as Popover from '@radix-ui/react-popover'
import { Check, ChevronDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
    getCountries,
    getCountryCallingCode,
    type CountryCode,
} from 'libphonenumber-js'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { isClassicTemplate } from '@/lib/templates/chrome'
import { cn } from '@/lib/utils/cn'

const FLAG_URL =
    'https://purecatamphetamine.github.io/country-flag-icons/3x2/{XX}.svg'

function CountryFlag({ code }: { code: string }) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={FLAG_URL.replace('{XX}', code)}
            alt=""
            width={21}
            height={14}
            className="h-3.5 w-[21px] shrink-0 object-cover"
            aria-hidden
        />
    )
}

export function PhoneNumberInput({
    label,
    required,
    className,
    placeholder = '300 1234567',
    value = '',
    onChange,
    error,
    disabled,
    defaultCountry = 'PK',
    labelClassName,
    inputClassName,
}: {
    label?: string
    required?: boolean
    className?: string
    placeholder?: string
    value?: string
    onChange?: (value: string) => void
    error?: string
    disabled?: boolean
    defaultCountry?: CountryCode
    labelClassName?: string
    inputClassName?: string
}) {
    const variant = useTemplateVariant()
    const classic = isClassicTemplate(variant)
    const [country, setCountry] = useState<CountryCode>(defaultCountry)
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')

    const countryOptions = useMemo(() => {
        const displayNames =
            typeof Intl !== 'undefined' && 'DisplayNames' in Intl
                ? new Intl.DisplayNames(['en'], { type: 'region' })
                : null

        return getCountries()
            .slice()
            .sort()
            .map((code) => {
                const callingCode = getCountryCallingCode(code)
                return {
                    value: code,
                    label: displayNames?.of(code) ?? code,
                    metaLabel: `+${callingCode}`,
                }
            })
    }, [])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return countryOptions
        return countryOptions.filter(
            (opt) =>
                opt.label.toLowerCase().includes(q) ||
                opt.value.toLowerCase().includes(q) ||
                opt.metaLabel.includes(q)
        )
    }, [countryOptions, query])

    const callingCode = `+${getCountryCallingCode(country)}`
    const nationalValue = useMemo(() => {
        const raw = value.trim()
        if (!raw) return ''
        if (!raw.startsWith('+')) return raw.replace(/\D/g, '')
        if (raw.startsWith(callingCode)) {
            return raw.slice(callingCode.length).replace(/\D/g, '')
        }
        return raw.replace(/\D/g, '')
    }, [callingCode, value])

    function handleCountryChange(nextCountry: CountryCode) {
        setCountry(nextCountry)
        setOpen(false)
        setQuery('')
        const nextCode = `+${getCountryCallingCode(nextCountry)}`
        const digits = nationalValue.replace(/\D/g, '')
        onChange?.(digits ? `${nextCode}${digits}` : '')
    }

    function handleInputChange(next: string) {
        const digits = next.replace(/\D/g, '')
        onChange?.(digits ? `${callingCode}${digits}` : '')
    }

    return (
        <div className={cn('min-w-0', className)}>
            {label ? (
                <span
                    className={cn(
                        'mb-2 block text-xs font-medium uppercase tracking-wide text-[#888]',
                        labelClassName
                    )}
                >
                    {label}
                    {required ? <span className="text-red-500"> *</span> : null}
                </span>
            ) : null}

            <div
                className={cn(
                    'flex h-12 w-full min-w-0 items-stretch overflow-hidden rounded-lg bg-[#F5F3F0] text-base text-[#1A1F2C] ring-1 ring-[#E8E4DE] sm:h-11 sm:text-sm',
                    'transition focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/30',
                    error && 'ring-red-400 focus-within:ring-red-300',
                    disabled && 'cursor-not-allowed opacity-60'
                )}
            >
                <Popover.Root open={open} onOpenChange={setOpen}>
                    <Popover.Trigger asChild disabled={disabled}>
                        <button
                            type="button"
                            aria-label="Select country"
                            className="flex w-[58px] shrink-0 items-center justify-center gap-0.5 border-r border-[#E8E4DE] bg-transparent px-1.5 outline-none transition hover:bg-[#EBE8E3]/60"
                        >
                            <CountryFlag code={country} />
                            <ChevronDown className="h-3.5 w-3.5 text-[#666]" />
                        </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Content
                            align="start"
                            sideOffset={8}
                            className="z-50 w-[min(100vw-2rem,280px)] overflow-hidden rounded-xl border border-black/5 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
                        >
                            <div className="border-b border-black/5 p-2">
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search country"
                                    className="h-9 w-full rounded-lg border border-black/10 bg-[#FAF7F2] px-3 text-sm outline-none"
                                />
                            </div>
                            <div className="max-h-56 overflow-auto p-1.5">
                                {filtered.length === 0 ? (
                                    <p className="px-3 py-2 text-sm text-[#666]">
                                        No countries found
                                    </p>
                                ) : (
                                    filtered.map((option) => {
                                        const active = option.value === country
                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() =>
                                                    handleCountryChange(
                                                        option.value as CountryCode
                                                    )
                                                }
                                                className={cn(
                                                    'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition',
                                                    active
                                                        ? classic
                                                            ? 'bg-brand'
                                                            : 'bg-[#111] text-white'
                                                        : classic
                                                          ? 'text-[#222] hover:bg-black/[0.04]'
                                                          : 'text-[#222] hover:bg-[#F7F3EE]'
                                                )}
                                            >
                                                <CountryFlag code={option.value} />
                                                <span className="min-w-0 flex-1 truncate">
                                                    {option.label}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'shrink-0 text-xs',
                                                        active
                                                            ? 'text-white/70'
                                                            : 'text-[#888]'
                                                    )}
                                                >
                                                    {option.metaLabel}
                                                </span>
                                                {active ? (
                                                    <Check className="h-3.5 w-3.5 shrink-0" />
                                                ) : null}
                                            </button>
                                        )
                                    })
                                )}
                            </div>
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>

                <div className="flex min-w-0 flex-1 items-center px-3">
                    <span className="shrink-0 text-[#666]">{callingCode}</span>
                    <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        value={nationalValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        disabled={disabled}
                        placeholder={placeholder}
                        className={cn(
                            'min-w-0 flex-1 bg-transparent pl-2 outline-none placeholder:text-[#9CA3AF]',
                            inputClassName
                        )}
                        aria-label={label || 'Phone number'}
                    />
                </div>
            </div>

            {error ? <p className="mt-1.5 text-sm text-red-600">{error}</p> : null}
        </div>
    )
}

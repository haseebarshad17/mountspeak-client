"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils/clsxUtils"
import { usePakistanCities } from "@/services/cities/cities.queries"
import { usePreviewRouter } from "@/hooks/useAgencyPreviewBase"
import { buildTourSearchPath } from "@/services/tours/tours.search.utils"
import { Calendar, MapPin, Navigation, Search } from "lucide-react"
import type { HomepagePage } from '@/data/homepage'
import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE } from '@/data/homepage'
import { DEFAULT_HERO_SEARCH_FILTERS } from '@/components/pages/marketing/home/hero-search.defaults'
import { useEffect, useMemo, useRef, useState, useTransition, type ChangeEvent } from "react"

type LocationDropdownListProps = {
    options: string[]
    selected: string
    isOpen: boolean
    searchPlaceholder: string
    noResultsMessage: string
    onSelect: (city: string) => void
    itemClassName: string
}

function LocationDropdownList({
    options,
    selected,
    isOpen,
    searchPlaceholder,
    noResultsMessage,
    onSelect,
    itemClassName,
}: LocationDropdownListProps) {
    const [query, setQuery] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!isOpen) {
            setQuery("")
            return
        }
        const frame = requestAnimationFrame(() => inputRef.current?.focus())
        return () => cancelAnimationFrame(frame)
    }, [isOpen])

    const filteredOptions = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase()
        if (!normalizedQuery) return options
        return options.filter((city) => city.toLowerCase().includes(normalizedQuery))
    }, [options, query])

    return (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="sticky top-0 z-10 min-w-0 shrink-0 bg-white pb-2">
                <div className="relative min-w-0">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") event.preventDefault()
                        }}
                        placeholder={searchPlaceholder}
                        className="h-9 w-full min-w-0 rounded-md border border-neutral-200 bg-neutral-50 pl-8 pr-3 text-sm outline-none focus:border-neutral-300 focus:bg-white"
                    />
                </div>
            </div>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-0.5 overflow-x-hidden overflow-y-auto">
                {filteredOptions.length === 0 ? (
                    <p className="truncate px-3 py-2 text-sm text-neutral-500">{noResultsMessage}</p>
                ) : (
                    filteredOptions.map((city) => (
                        <Button
                            key={city}
                            type="button"
                            variant="ghost"
                            size="max"
                            className={cn(itemClassName, selected === city && "bg-neutral-100")}
                            onClick={() => onSelect(city)}
                        >
                            <span className="block min-w-0 flex-1 truncate text-left">{city}</span>
                        </Button>
                    ))
                )}
            </div>
        </div>
    )
}

type DateFieldProps = {
    id: string
    label: string
    placeholder: string
    value: string
    min: string
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    className?: string
    fieldClassName?: string
}

function formatHeroDisplayDate(isoDate: string): string {
    const date = new Date(`${isoDate}T12:00:00`)
    if (Number.isNaN(date.getTime())) return isoDate

    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date)
}

function DateField({
    id,
    label,
    placeholder,
    value,
    min,
    onChange,
    className,
    fieldClassName,
}: DateFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    const openDatePicker = () => {
        const input = inputRef.current
        if (!input) return

        if (typeof input.showPicker === 'function') {
            try {
                input.showPicker()
                return
            } catch {
                // showPicker can throw if not triggered by a user gesture in some browsers
            }
        }

        input.focus()
        input.click()
    }

    return (
        <div className={cn('min-w-0 w-full', className)}>
            <button
                type="button"
                onClick={openDatePicker}
                className={cn(
                    'relative flex h-12 w-full min-w-0 cursor-pointer items-center gap-2 overflow-hidden rounded-md border border-layout-separator bg-neutral-50 px-3 text-left transition hover:bg-neutral-100',
                    'xs:gap-2.5 xs:px-4',
                    'xl:h-full xl:rounded-none xl:border-0 xl:border-r xl:border-[#D6D9DC] xl:bg-transparent xl:px-4 xl:hover:bg-[#F8FAFB]',
                    fieldClassName,
                )}
            >
                <Calendar className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
                <span
                    className={cn(
                        'min-w-0 flex-1 truncate text-left text-xs font-medium xs:text-sm',
                        value ? 'text-neutral-700' : 'text-neutral-500',
                    )}
                >
                    {value ? formatHeroDisplayDate(value) : placeholder}
                </span>
            </button>
            <input
                ref={inputRef}
                id={id}
                type="date"
                value={value}
                min={min}
                onChange={onChange}
                aria-label={label}
                tabIndex={-1}
                className="sr-only"
            />
        </div>
    )
}

export type HeroFiltersValues = {
    from?: string
    to?: string
    start_date?: string
    end_date?: string
}

type HeroStandardFiltersProps = {
    page?: HomepagePage | null
    initialValues?: HeroFiltersValues
    tourLocations?: string[]
}

export default function HeroStandardFilters({
    page,
    initialValues,
    tourLocations = [],
}: HeroStandardFiltersProps) {
    const router = usePreviewRouter()
    const [isSearching, startSearchTransition] = useTransition()
    const { data: pakistanCities = [], isLoading: isCitiesLoading } = usePakistanCities()
    const [from, setFrom] = useState(initialValues?.from ?? "")
    const [to, setTo] = useState(initialValues?.to ?? "")
    const [startDate, setStartDate] = useState(initialValues?.start_date ?? "")
    const [endDate, setEndDate] = useState(initialValues?.end_date ?? "")
    const [open, setOpen] = useState<"from" | "to" | null>(null)

    useEffect(() => {
        setFrom(initialValues?.from ?? "")
        setTo(initialValues?.to ?? "")
        setStartDate(initialValues?.start_date ?? "")
        setEndDate(initialValues?.end_date ?? "")
    }, [initialValues?.from, initialValues?.to, initialValues?.start_date, initialValues?.end_date])

    const cityOptions = useMemo(() => {
        const merged = new Set<string>([...pakistanCities, ...tourLocations])
        return [...merged].sort((a, b) => a.localeCompare(b))
    }, [pakistanCities, tourLocations])

    const toOptions = useMemo(
        () => cityOptions.filter((city) => city !== from),
        [cityOptions, from],
    )

    const minTravelDate = new Date().toISOString().slice(0, 10)

    const handleSearch = () => {
        startSearchTransition(() => {
            router.push(
                buildTourSearchPath({
                    from,
                    to,
                    start_date: startDate || undefined,
                    end_date: endDate || undefined,
                }),
            )
        })
    }

    const triggerCls = cn(
        "!justify-start flex !h-12 !w-full min-w-0 items-center gap-2 overflow-hidden px-3 !text-xs !font-medium !normal-case !tracking-normal",
        "xs:gap-2.5 xs:px-4 xs:!text-sm",
        "bg-neutral-50 text-neutral-700 transition hover:bg-neutral-100 text-left rounded-md border border-layout-separator",
        "xl:rounded-none xl:border-0 xl:border-r xl:border-[#D6D9DC] xl:bg-transparent xl:px-4 xl:hover:bg-[#F8FAFB] xl:!h-full",
    )

    const popCls = cn(
        "w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] min-w-0",
        "rounded-xl border border-neutral-200 bg-white p-2 shadow-xl",
        "flex flex-col overflow-hidden",
    )

    const dropdownItemCls =
        "!flex !h-auto !w-full !max-w-full min-w-0 justify-start overflow-hidden rounded-md !px-3 py-2.5 text-left"

    const heroSearch = page?.sections.hero.searchFilters ?? DEFAULT_HERO_SEARCH_FILTERS
    const startDateLabel = heroSearch.startDateLabel ?? DEFAULT_HERO_SEARCH_FILTERS.startDateLabel
    const endDateLabel = heroSearch.endDateLabel ?? DEFAULT_HERO_SEARCH_FILTERS.endDateLabel
    const startDatePlaceholder = startDateLabel ?? 'Start date'
    const endDatePlaceholder = endDateLabel ?? 'End date'

    return (
        <form
            className="w-full max-w-full min-w-0 overflow-hidden rounded-lg border border-neutral-200 bg-white p-2 shadow-md xs:p-2.5 sm:p-3 xl:mx-auto xl:max-w-[900px] xl:rounded-[6px] xl:border-[#D6D9DC] xl:p-0"
            onSubmit={(event) => {
                event.preventDefault()
                handleSearch()
            }}
        >
            <div
                className={cn(
                    "grid min-w-0 grid-cols-1 gap-2",
                    "xs:grid-cols-2",
                    "xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(140px,170px)] xl:items-stretch xl:gap-0 xl:h-12",
                )}
            >
                <div className="min-w-0 w-full">
                    <Popover open={open === "from"} onOpenChange={(isOpen) => setOpen(isOpen ? "from" : null)}>
                        <PopoverTrigger asChild>
                            <Button type="button" variant="ghost" size="max" className={triggerCls}>
                                <MapPin className="h-4 w-4 shrink-0 text-neutral-500" />
                                <span
                                    className={cn(
                                        'min-w-0 flex-1 truncate text-left',
                                        !from && 'text-neutral-500',
                                    )}
                                >
                                    {from || heroSearch.fromPlaceholder}
                                </span>
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className={cn(popCls, "max-h-60")} align="start" collisionPadding={8}>
                            {isCitiesLoading ? (
                                <p className="truncate px-3 py-2 text-sm text-neutral-500">{heroSearch.loadingCities}</p>
                            ) : cityOptions.length === 0 ? (
                                <p className="truncate px-3 py-2 text-sm text-neutral-500">{heroSearch.noCities}</p>
                            ) : (
                                <LocationDropdownList
                                    options={cityOptions}
                                    selected={from}
                                    isOpen={open === "from"}
                                    searchPlaceholder={
                                        heroSearch.searchCitiesPlaceholder
                                        ?? DEFAULT_HERO_SEARCH_FILTERS.searchCitiesPlaceholder
                                    }
                                    noResultsMessage={
                                        heroSearch.noMatchingCities
                                        ?? DEFAULT_HERO_SEARCH_FILTERS.noMatchingCities
                                    }
                                    itemClassName={dropdownItemCls}
                                    onSelect={(city) => {
                                        setFrom(city)
                                        if (to === city) setTo("")
                                        setOpen(null)
                                    }}
                                />
                            )}
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="min-w-0 w-full">
                    <Popover open={open === "to"} onOpenChange={(isOpen) => setOpen(isOpen ? "to" : null)}>
                        <PopoverTrigger asChild>
                            <Button type="button" variant="ghost" size="max" className={triggerCls}>
                                <Navigation className="h-4 w-4 shrink-0 text-neutral-500" />
                                <span
                                    className={cn(
                                        'min-w-0 flex-1 truncate text-left',
                                        !to && 'text-neutral-500',
                                    )}
                                >
                                    {to || heroSearch.toPlaceholder}
                                </span>
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className={cn(popCls, "max-h-60")} align="start" collisionPadding={8}>
                            {isCitiesLoading ? (
                                <p className="truncate px-3 py-2 text-sm text-neutral-500">{heroSearch.loadingCities}</p>
                            ) : toOptions.length === 0 ? (
                                <p className="truncate px-3 py-2 text-sm text-neutral-500">{heroSearch.noCities}</p>
                            ) : (
                                <LocationDropdownList
                                    options={toOptions}
                                    selected={to}
                                    isOpen={open === "to"}
                                    searchPlaceholder={
                                        heroSearch.searchCitiesPlaceholder
                                        ?? DEFAULT_HERO_SEARCH_FILTERS.searchCitiesPlaceholder
                                    }
                                    noResultsMessage={
                                        heroSearch.noMatchingCities
                                        ?? DEFAULT_HERO_SEARCH_FILTERS.noMatchingCities
                                    }
                                    itemClassName={dropdownItemCls}
                                    onSelect={(city) => {
                                        setTo(city)
                                        setOpen(null)
                                    }}
                                />
                            )}
                        </PopoverContent>
                    </Popover>
                </div>

                <DateField
                    id="hero-start-date"
                    label={startDateLabel ?? 'Start date'}
                    placeholder={startDatePlaceholder}
                    value={startDate}
                    min={minTravelDate}
                    onChange={(event) => {
                        const nextStart = event.target.value
                        setStartDate(nextStart)
                        if (endDate && nextStart && endDate < nextStart) {
                            setEndDate(nextStart)
                        }
                    }}
                />

                <DateField
                    id="hero-end-date"
                    label={endDateLabel ?? 'End date'}
                    placeholder={endDatePlaceholder}
                    value={endDate}
                    min={startDate || minTravelDate}
                    onChange={(event) => setEndDate(event.target.value)}
                />

                <div className="min-w-0 w-full xs:col-span-2 xl:col-span-1">
                    <Button
                        type="submit"
                        size="max"
                        loading={isSearching}
                        loadingText={heroSearch.searchingButtonLabel ?? 'Searching...'}
                        style={HP_THEME_BTN_STYLE}
                        className={cn(
                            HP_THEME_BTN_CLASS,
                            '!h-12 w-full min-w-0 !rounded-xl !font-medium !normal-case !tracking-normal !text-sm',
                            'xl:!h-full xl:!rounded-[3px] xl:!px-4',
                        )}
                    >
                        <span className="truncate">{heroSearch.searchButtonLabel}</span>
                        {!isSearching ? <Search className="ml-2 h-4 w-4 shrink-0" /> : null}
                    </Button>
                </div>
            </div>
        </form>
    )
}

"use client"

import FilterDropdown from "@/components/generic/FilterDropdown"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/clsxUtils"
import { usePakistanCities } from "@/services/cities/cities.queries"
import { usePreviewRouter } from "@/hooks/useAgencyPreviewBase"
import { buildTourSearchPath } from "@/services/tours/tours.search.utils"
import { Calendar, Loader2, MapPin, Navigation, Search } from "lucide-react"
import type { HomepagePage } from '@/data/homepage'
import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE } from '@/data/homepage'
import { DEFAULT_HERO_SEARCH_FILTERS } from '@/components/pages/marketing/home/hero-search.defaults'
import { useEffect, useMemo, useRef, useState, useTransition, type ChangeEvent } from "react"

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

const heroTriggerButtonClass = cn(
    "!justify-start flex !h-12 !w-full min-w-0 items-center gap-2 overflow-hidden px-3 !text-xs !font-medium !normal-case !tracking-normal",
    "xs:gap-2.5 xs:px-4 xs:!text-sm",
    "bg-neutral-50 text-neutral-700 transition hover:bg-neutral-100 text-left rounded-md border border-layout-separator",
    "xl:rounded-none xl:border-0 xl:border-r xl:border-[#D6D9DC] xl:bg-transparent xl:px-4 xl:hover:bg-[#F8FAFB] xl:!h-full",
)

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

    const cityFilterOptions = useMemo(
        () => cityOptions.map((city) => ({ value: city, label: city })),
        [cityOptions],
    )

    const toFilterOptions = useMemo(
        () => cityOptions.filter((city) => city !== from).map((city) => ({ value: city, label: city })),
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
                    {isCitiesLoading ? (
                        <div className={cn(heroTriggerButtonClass, 'flex items-center')}>
                            <MapPin className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
                            <span className="truncate text-neutral-500">{heroSearch.loadingCities}</span>
                        </div>
                    ) : cityOptions.length === 0 ? (
                        <div className={cn(heroTriggerButtonClass, 'flex items-center')}>
                            <MapPin className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
                            <span className="truncate text-neutral-500">{heroSearch.noCities}</span>
                        </div>
                    ) : (
                        <FilterDropdown
                            options={cityFilterOptions}
                            value={from}
                            onChange={(value) => {
                                const nextFrom = String(value)
                                setFrom(nextFrom)
                                if (to === nextFrom) setTo("")
                            }}
                            placeholder={heroSearch.fromPlaceholder}
                            triggerIcon={MapPin}
                            theme="slate"
                            open={open === "from"}
                            onOpenChange={(isOpen) => setOpen(isOpen ? "from" : null)}
                            classNames={{ triggerButton: heroTriggerButtonClass }}
                        />
                    )}
                </div>

                <div className="min-w-0 w-full">
                    {isCitiesLoading ? (
                        <div className={cn(heroTriggerButtonClass, 'flex items-center')}>
                            <Navigation className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
                            <span className="truncate text-neutral-500">{heroSearch.loadingCities}</span>
                        </div>
                    ) : toFilterOptions.length === 0 ? (
                        <div className={cn(heroTriggerButtonClass, 'flex items-center')}>
                            <Navigation className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
                            <span className="truncate text-neutral-500">{heroSearch.noCities}</span>
                        </div>
                    ) : (
                        <FilterDropdown
                            options={toFilterOptions}
                            value={to}
                            onChange={(value) => setTo(String(value))}
                            placeholder={heroSearch.toPlaceholder}
                            triggerIcon={Navigation}
                            theme="slate"
                            open={open === "to"}
                            onOpenChange={(isOpen) => setOpen(isOpen ? "to" : null)}
                            classNames={{ triggerButton: heroTriggerButtonClass }}
                        />
                    )}
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
                        disabled={isSearching}
                        aria-busy={isSearching}
                        style={HP_THEME_BTN_STYLE}
                        className={cn(
                            HP_THEME_BTN_CLASS,
                            '!h-12 w-full min-w-0 !rounded-xl !font-medium !normal-case !tracking-normal !text-sm',
                            'xl:!h-full xl:!rounded-[3px] xl:!px-4',
                        )}
                    >
                        {isSearching ? (
                            <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                        ) : (
                            <>
                                <span className="truncate">{heroSearch.searchButtonLabel}</span>
                                <Search className="ml-2 h-4 w-4 shrink-0" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}

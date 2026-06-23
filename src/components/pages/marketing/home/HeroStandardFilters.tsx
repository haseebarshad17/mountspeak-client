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
import { useEffect, useMemo, useRef, useState, useTransition } from "react"

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
        <>
            <div className="sticky top-0 z-10 shrink-0 bg-white pb-2">
                <div className="relative">
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
                        className="h-9 w-full rounded-md border border-neutral-200 bg-neutral-50 pl-8 pr-3 text-sm outline-none focus:border-neutral-300 focus:bg-white"
                    />
                </div>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-neutral-500">{noResultsMessage}</p>
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
                            {city}
                        </Button>
                    ))
                )}
            </div>
        </>
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
    const [open, setOpen] = useState<string | null>(null)

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

    const travelDatesLabel = useMemo(() => {
        const formatLabel = (value: string) =>
            new Date(`${value}T00:00:00`).toLocaleDateString('en-PK', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            })

        if (startDate && endDate) {
            return `${formatLabel(startDate)} – ${formatLabel(endDate)}`
        }

        if (startDate) return formatLabel(startDate)
        if (endDate) return formatLabel(endDate)

        return ''
    }, [endDate, startDate])

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
        "!justify-start flex h-11 !w-full min-w-0 items-center gap-2.5 overflow-hidden px-4 !text-sm !font-medium !normal-case !tracking-normal sm:h-14",
        "bg-neutral-50 text-neutral-700 transition hover:bg-neutral-100 text-left rounded-md border border-layout-separator",
        "xl:h-[56px] xl:rounded-none xl:border-0 xl:bg-transparent xl:px-5 xl:hover:bg-[#F8FAFB]"
    )

    const popCls = cn(
        "w-[min(92vw,22rem)] rounded-xl border bg-white p-2 shadow-xl",
        "border-neutral-200 flex flex-col"
    )

    const dropdownItemCls =
        "!flex !h-auto !w-full min-w-0 justify-start rounded-md !px-3 py-2.5 text-left sm:!flex sm:!w-full"

    const heroSearch = page?.sections.hero.searchFilters ?? DEFAULT_HERO_SEARCH_FILTERS

    return (
        <form
            className="overflow-hidden rounded-lg border border-neutral-200 bg-white p-2 shadow-md sm:p-3 xl:mx-auto xl:max-w-[760px] xl:rounded-[6px] xl:border-[#D6D9DC] xl:p-0"
            onSubmit={(event) => {
                event.preventDefault()
                handleSearch()
            }}
        >
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_170px] xl:gap-0">
                <Popover open={open === "from"} onOpenChange={(v) => setOpen(v ? "from" : null)}>
                    <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="max" className={cn(triggerCls, "xl:border-r xl:border-[#D6D9DC]")}>
                            <MapPin className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                            <span className="truncate min-w-0 w-full">{from || heroSearch.fromPlaceholder}</span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className={cn(popCls, "max-h-60 overflow-hidden")} align="start">
                        {isCitiesLoading ? (
                            <p className="px-3 py-2 text-sm text-neutral-500">{heroSearch.loadingCities}</p>
                        ) : cityOptions.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-neutral-500">{heroSearch.noCities}</p>
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

                <Popover open={open === "to"} onOpenChange={(v) => setOpen(v ? "to" : null)}>
                    <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="max" className={cn(triggerCls, "xl:border-r xl:border-[#D6D9DC]")}>
                            <Navigation className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                            <span className="truncate min-w-0 w-full">{to || heroSearch.toPlaceholder}</span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className={cn(popCls, "max-h-60 overflow-hidden")} align="start">
                        {isCitiesLoading ? (
                            <p className="px-3 py-2 text-sm text-neutral-500">{heroSearch.loadingCities}</p>
                        ) : !from ? (
                            <p className="px-3 py-2 text-sm text-neutral-500">{heroSearch.pickDepartureFirst}</p>
                        ) : toOptions.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-neutral-500">{heroSearch.noCities}</p>
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

                <Popover open={open === "date"} onOpenChange={(v) => setOpen(v ? "date" : null)}>
                    <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="max" className={cn(triggerCls, "xl:border-r xl:border-[#D6D9DC]")}>
                            <Calendar className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                            <span className="truncate min-w-0 w-full">
                                {travelDatesLabel || heroSearch.datePlaceholder}
                            </span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className={popCls} align="start">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-neutral-700">
                                {heroSearch.startDateLabel ?? DEFAULT_HERO_SEARCH_FILTERS.startDateLabel}
                                <input
                                    type="date"
                                    value={startDate}
                                    min={minTravelDate}
                                    onChange={(event) => {
                                        const nextStart = event.target.value
                                        setStartDate(nextStart)
                                        if (endDate && nextStart && endDate < nextStart) {
                                            setEndDate(nextStart)
                                        }
                                    }}
                                    className="mt-1 w-full h-10 border rounded-md px-2"
                                />
                            </label>
                            <label className="block text-sm font-medium text-neutral-700">
                                {heroSearch.endDateLabel ?? DEFAULT_HERO_SEARCH_FILTERS.endDateLabel}
                                <input
                                    type="date"
                                    value={endDate}
                                    min={startDate || minTravelDate}
                                    onChange={(event) => setEndDate(event.target.value)}
                                    className="mt-1 w-full h-10 border rounded-md px-2"
                                />
                            </label>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setStartDate("")
                                    setEndDate("")
                                }}
                            >
                                {heroSearch.clearDate}
                            </Button>
                            <Button type="button" size="sm" onClick={() => setOpen(null)}>
                                {heroSearch.doneDate}
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <div className="xl:col-span-1 xl:flex xl:items-center xl:px-[6px]">
                    <Button
                        type="submit"
                        size="max"
                        loading={isSearching}
                        loadingText={heroSearch.searchingButtonLabel ?? 'Searching...'}
                        style={HP_THEME_BTN_STYLE}
                        className={cn(
                            HP_THEME_BTN_CLASS,
                            '!h-11 w-full !rounded-xl !font-medium !normal-case !tracking-normal sm:!h-14 xl:!h-[44px] xl:!w-full xl:!rounded-[3px] xl:!px-4 xl:!text-sm',
                        )}
                    >
                        {heroSearch.searchButtonLabel}
                        {!isSearching ? <Search className="ml-2 w-4 h-4 flex-shrink-0" /> : null}
                    </Button>
                </div>
            </div>
        </form>
    )
}

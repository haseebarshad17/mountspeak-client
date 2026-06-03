"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils/clsxUtils"
import { usePakistanCities } from "@/services/cities/cities.queries"
import { buildTourSearchPath } from "@/services/tours/tours.search.utils"
import { Calendar, MapPin, Navigation, Search } from "lucide-react"
import { homepage } from "@/data/homepage"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

const heroSearch = homepage.sections.hero.searchFilters
const heroSearchButton = homepage.theme.buttons.heroSearch

export type HeroFiltersValues = {
    from?: string
    to?: string
    date?: string
}

type HeroFiltersProps = {
    initialValues?: HeroFiltersValues
    tourLocations?: string[]
}

export default function HeroFilters({ initialValues, tourLocations = [] }: HeroFiltersProps) {
    const router = useRouter()
    const { data: pakistanCities = [], isLoading: isCitiesLoading } = usePakistanCities()
    const [from, setFrom] = useState(initialValues?.from ?? "")
    const [to, setTo] = useState(initialValues?.to ?? "")
    const [date, setDate] = useState(initialValues?.date ?? "")

    const [open, setOpen] = useState<string | null>(null)

    useEffect(() => {
        setFrom(initialValues?.from ?? "")
        setTo(initialValues?.to ?? "")
        setDate(initialValues?.date ?? "")
    }, [initialValues?.from, initialValues?.to, initialValues?.date])

    const cityOptions = useMemo(() => {
        const merged = new Set<string>([...pakistanCities, ...tourLocations])
        return [...merged].sort((a, b) => a.localeCompare(b))
    }, [pakistanCities, tourLocations])

    const toOptions = useMemo(
        () => cityOptions.filter((city) => city !== from),
        [cityOptions, from],
    )

    const searchHref = buildTourSearchPath({ from, to, date })

    const handleSearch = () => {
        router.push(searchHref)
    }

    const triggerCls = cn(
        "flex h-14 !w-full min-w-0 items-center justify-start gap-2.5 overflow-hidden px-4 text-sm font-medium",
        "bg-neutral-50 text-neutral-700 transition hover:bg-neutral-100 text-left rounded-md border border-layout-separator",
        "xl:h-[56px] xl:rounded-none xl:border-0 xl:bg-transparent xl:px-5 xl:hover:bg-[#F8FAFB]"
    )

    const popCls = cn(
        "w-[min(92vw,22rem)] rounded-xl border bg-white p-2 shadow-xl",
        "border-neutral-200 flex flex-col"
    )

    const dropdownItemCls =
        "!flex !h-auto !w-full min-w-0 justify-start rounded-md !px-3 py-2.5 text-left sm:!flex sm:!w-full"

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
                        <Button type="button" variant="ghost" className={`${triggerCls} xl:border-r xl:border-[#D6D9DC]`}>
                            <MapPin className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                            <span className="truncate min-w-0 w-full">{from || heroSearch.fromPlaceholder}</span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className={cn(popCls, "max-h-60 overflow-y-auto")} align="start">
                        {isCitiesLoading ? (
                            <p className="px-3 py-2 text-sm text-neutral-500">{heroSearch.loadingCities}</p>
                        ) : cityOptions.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-neutral-500">{heroSearch.noCities}</p>
                        ) : (
                            <div className="flex flex-col gap-0.5">
                                {cityOptions.map((city) => (
                                    <Button
                                        key={city}
                                        type="button"
                                        variant="ghost"
                                        className={cn(
                                            dropdownItemCls,
                                            from === city && "bg-neutral-100",
                                        )}
                                        onClick={() => {
                                            setFrom(city)
                                            if (to === city) setTo("")
                                            setOpen(null)
                                        }}
                                    >
                                        {city}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </PopoverContent>
                </Popover>

                <Popover open={open === "to"} onOpenChange={(v) => setOpen(v ? "to" : null)}>
                    <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" className={`${triggerCls} xl:border-r xl:border-[#D6D9DC]`}>
                            <Navigation className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                            <span className="truncate min-w-0 w-full">{to || heroSearch.toPlaceholder}</span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className={cn(popCls, "max-h-60 overflow-y-auto")} align="start">
                        {isCitiesLoading ? (
                            <p className="px-3 py-2 text-sm text-neutral-500">{heroSearch.loadingCities}</p>
                        ) : !from ? (
                            <p className="px-3 py-2 text-sm text-neutral-500">{heroSearch.pickDepartureFirst}</p>
                        ) : toOptions.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-neutral-500">{heroSearch.noCities}</p>
                        ) : (
                            <div className="flex flex-col gap-0.5">
                                {toOptions.map((city) => (
                                    <Button
                                        key={city}
                                        type="button"
                                        variant="ghost"
                                        className={cn(
                                            dropdownItemCls,
                                            to === city && "bg-neutral-100",
                                        )}
                                        onClick={() => {
                                            setTo(city)
                                            setOpen(null)
                                        }}
                                    >
                                        {city}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </PopoverContent>
                </Popover>

                <Popover open={open === "date"} onOpenChange={(v) => setOpen(v ? "date" : null)}>
                    <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" className={`${triggerCls} xl:border-r xl:border-[#D6D9DC]`}>
                            <Calendar className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                            <span className="truncate min-w-0 w-full">{date || heroSearch.datePlaceholder}</span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className={popCls} align="start">
                        <input
                            type="date"
                            value={date}
                            min={new Date().toISOString().slice(0, 10)}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full h-10 border rounded-md px-2"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <Button type="button" size="sm" variant="outline" onClick={() => setDate("")}>
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
                        className="h-14 w-full rounded-xl xl:h-[44px] xl:w-full xl:rounded-[3px] xl:px-4 xl:text-[14px] xl:font-medium xl:whitespace-nowrap"
                        style={{
                            backgroundColor: heroSearchButton.background,
                            color: heroSearchButton.text,
                        }}
                    >
                        {heroSearch.searchButtonLabel} <Search className="ml-2 w-4 h-4 flex-shrink-0" />
                    </Button>
                </div>

            </div>
        </form>
    )
}

"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils/clsxUtils"
import { usePakistanCities } from "@/services/cities/cities.queries"
import { Calendar, MapPin, Navigation, Search } from "lucide-react"
import { useMemo, useState } from "react"

// const TRAVEL_CLASSES = ["Economy", "Premium economy", "Business", "First class"] as const

export default function HeroFilters() {
    const { data: pakistanCities = [], isLoading: isCitiesLoading } = usePakistanCities()
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [date, setDate] = useState("")
    // const [travelers, setTravelers] = useState(1)
    // const [travelClass, setTravelClass] = useState("Economy")

    const [open, setOpen] = useState<string | null>(null)

    const toOptions = useMemo(
        () => pakistanCities.filter((city) => city !== from),
        [pakistanCities, from],
    )

    const triggerCls = cn(
        "flex h-14 !w-full min-w-0 items-center justify-start gap-2.5 overflow-hidden px-4 text-sm font-medium",
        "bg-neutral-50 text-neutral-700 transition hover:bg-neutral-100 text-left rounded-md border border-layout-separator",
        "xl:h-[56px] xl:rounded-none xl:border-0 xl:bg-transparent xl:px-5 xl:hover:bg-[#F8FAFB]"
    )

    const popCls = cn(
        "w-[min(92vw,22rem)] rounded-xl border bg-white p-2 shadow-xl",
        "border-neutral-200"
    )

    return (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white p-2 shadow-md sm:p-3 xl:mx-auto xl:max-w-[760px] xl:rounded-[6px] xl:border-[#D6D9DC] xl:p-0">
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_170px] xl:gap-0">

                {/* FROM */}
                <Popover open={open === "from"} onOpenChange={(v) => setOpen(v ? "from" : null)}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className={`${triggerCls} xl:border-r xl:border-[#D6D9DC]`}>
                            <MapPin className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                            <span className="truncate min-w-0 w-full">{from || "From"}</span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className={cn(popCls, "max-h-60 overflow-y-auto")} align="start">
                        {isCitiesLoading ? (
                            <p className="px-3 py-2 text-sm text-neutral-500">Loading cities...</p>
                        ) : pakistanCities.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-neutral-500">No cities available</p>
                        ) : (
                            pakistanCities.map((city) => (
                                <Button
                                    key={city}
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start",
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
                            ))
                        )}
                    </PopoverContent>
                </Popover>

                {/* TO */}
                <Popover open={open === "to"} onOpenChange={(v) => setOpen(v ? "to" : null)}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className={`${triggerCls} xl:border-r xl:border-[#D6D9DC]`}>
                            <Navigation className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                            <span className="truncate min-w-0 w-full">{to || "To"}</span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className={cn(popCls, "max-h-60 overflow-y-auto")} align="start">
                        {isCitiesLoading ? (
                            <p className="px-3 py-2 text-sm text-neutral-500">Loading cities...</p>
                        ) : !from ? (
                            <p className="px-3 py-2 text-sm text-neutral-500">Pick a departure first</p>
                            ) : toOptions.length === 0 ? (
                                <p className="px-3 py-2 text-sm text-neutral-500">No cities available</p>
                        ) : (
                                        toOptions.map((city) => (
                                <Button
                                    key={city}
                                    variant="ghost"
                                    className={cn("w-full justify-start", to === city && "bg-neutral-100")}
                                    onClick={() => {
                                        setTo(city)
                                        setOpen(null)
                                    }}
                                >
                                    {city}
                                </Button>
                            ))
                        )}
                    </PopoverContent>
                </Popover>

                {/* DATE */}
                <Popover open={open === "date"} onOpenChange={(v) => setOpen(v ? "date" : null)}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className={`${triggerCls} xl:border-r xl:border-[#D6D9DC]`}>
                            <Calendar className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                            <span className="truncate min-w-0 w-full">{date || "Date of stay"}</span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className={popCls} align="start">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full h-10 border rounded-md px-2"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => setDate("")}>Clear</Button>
                            <Button size="sm" onClick={() => setOpen(null)}>Done</Button>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* TRAVELERS */}
                {/* <Popover open={open === "trav"} onOpenChange={(v) => setOpen(v ? "trav" : null)}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className={triggerCls}>
                            <User className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                            <span className="truncate min-w-0 w-full">{travelers > 1 || travelClass !== "Economy" ? `${travelers} · ${travelClass}` : "Traveler - Class"}</span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className={popCls} align="start">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm">Travelers</span>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="!h-8 !w-8 rounded-full p-0"
                                    onClick={() => setTravelers(n => Math.max(1, n - 1))}
                                >
                                    <Minus className="w-3 h-3" />
                                </Button>
                                <span className="min-w-5 text-center text-sm font-semibold">{travelers}</span>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="!h-8 !w-8 rounded-full p-0"
                                    onClick={() => setTravelers(n => Math.min(9, n + 1))}
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            {TRAVEL_CLASSES.map(c => (
                                <Button
                                    key={c}
                                    variant="ghost"
                                    className={cn("w-full justify-start", travelClass === c && "bg-neutral-100")}
                                    onClick={() => setTravelClass(c)}
                                >
                                    {c}
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover> */}

                {/* SEARCH */}
                <div className="xl:col-span-1 xl:flex xl:items-center xl:px-[6px]">
                    <Button
                        href="/search"
                        className="h-14 w-full rounded-xl bg-[#2D6A6A] text-white hover:bg-[#255a5a] xl:h-[44px] xl:w-full xl:rounded-[3px] xl:px-4 xl:text-[14px] xl:font-medium xl:whitespace-nowrap"
                    >
                        Find trip now <Search className="ml-2 w-4 h-4 flex-shrink-0" />
                    </Button>
                </div>

            </div>
        </div>
    )
}
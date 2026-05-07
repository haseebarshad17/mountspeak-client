"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils/clsxUtils"
import { Calendar, MapPin, Minus, Navigation, Plus, Search, User } from "lucide-react"
import { useMemo, useState } from "react"

const LOCATIONS = ["Islamabad", "Lahore", "Karachi", "Peshawar", "Gilgit", "Skardu", "Hunza", "Swat", "Murree", "Naran"]
const TRAVEL_CLASSES = ["Economy", "Premium economy", "Business", "First class"] as const

export default function HeroFilters() {
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [date, setDate] = useState("")
    const [travelers, setTravelers] = useState(1)
    const [travelClass, setTravelClass] = useState("Economy")

    const [open, setOpen] = useState<string | null>(null)

    const toOptions = useMemo(() => LOCATIONS.filter(c => c !== from), [from])

    const triggerCls = cn(
        "flex h-14 !w-full items-center justify-start gap-2.5 px-4 text-sm font-medium",
        "bg-neutral-50 text-neutral-700 transition hover:bg-neutral-100",
        "rounded-none xl:bg-transparent xl:hover:bg-neutral-50/80",
        "border border-layout-separator rounded-md xl:border-y-0 xl:border-l-0 xl:rounded-none"
    )

    const popCls = cn(
        "w-[min(92vw,22rem)] rounded-xl border bg-white p-2 shadow-xl",
        "border-neutral-200"
    )

    return (
        <div className="overflow-hidden xl:rounded-2xl rounded-lg border border-neutral-200 bg-white p-2 shadow-md sm:p-3 xl:p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 xl:gap-0 gap-1">

                {/* FROM */}
                <Popover open={open === "from"} onOpenChange={(v) => setOpen(v ? "from" : null)}>
                    <PopoverTrigger>
                        <Button variant="ghost" className={triggerCls} asChild>
                            <MapPin className="w-4 h-4 text-neutral-500" />
                            {from || "From"}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className={popCls} align="start">
                        {LOCATIONS.map(city => (
                            <Button
                                key={city}
                                variant="ghost"
                                className={cn("w-full justify-start", from === city && "bg-neutral-100")}
                                onClick={() => {
                                    setFrom(city)
                                    if (to === city) setTo("")
                                    setOpen(null)
                                }}
                            >
                                {city}
                            </Button>
                        ))}
                    </PopoverContent>
                </Popover>

                {/* TO */}
                <Popover open={open === "to"} onOpenChange={(v) => setOpen(v ? "to" : null)}>
                    <PopoverTrigger>
                        <Button variant="ghost" className={triggerCls} asChild>
                            <Navigation className="w-4 h-4 text-neutral-500" />
                            {to || "To"}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className={popCls} align="start">
                        {toOptions.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-neutral-500">Pick a departure first</p>
                        ) : (
                            toOptions.map(city => (
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
                    <PopoverTrigger>
                        <Button variant="ghost" className={triggerCls} asChild>
                            <Calendar className="w-4 h-4 text-neutral-500" />
                            {date || "Date"}
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
                <Popover open={open === "trav"} onOpenChange={(v) => setOpen(v ? "trav" : null)}>
                    <PopoverTrigger>
                        <Button variant="ghost" className={triggerCls} asChild>
                            <User className="w-4 h-4 text-neutral-500" />
                            {travelers} · {travelClass}
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
                </Popover>

                {/* SEARCH */}
                <div className="sm:col-span-2 xl:col-span-1 xl:p-2">
                    <Button className="h-14 w-full rounded-xl bg-[#2D6A6A] text-white hover:bg-[#255a5a] xl:h-[64px] xl:rounded-lg">
                        Find Trip <Search className="ml-2 w-4 h-4" />
                    </Button>
                </div>

            </div>
        </div>
    )
}
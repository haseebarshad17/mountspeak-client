'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search as SearchIcon } from 'lucide-react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ListingCard } from '@/components/listings/ListingCard'
import { DateField } from '@/components/ui/DateField'
import { EmptyState } from '@/components/ui/EmptyState'
import { Select } from '@/components/ui/Select'
import type { HomepagePage } from '@/services/agency/agency.types'
import type { ListingItem } from '@/services/listings/listings.types'
import type {
    AgencySpecializationCapabilities,
    SpecializationKind,
} from '@/services/specialization/specialization.types'
import { cn } from '@/lib/utils/cn'

function isKind(value: string | null): value is SpecializationKind {
    return value === 'tours' || value === 'packages' || value === 'international'
}

export function SearchPageContent({
    page,
    capabilities,
    listingsByKind,
    destinationsByKind,
    agencyId,
}: {
    page: HomepagePage
    capabilities: AgencySpecializationCapabilities
    listingsByKind: Record<SpecializationKind, ListingItem[]>
    destinationsByKind: Record<SpecializationKind, string[]>
    agencyId: string
}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const kindParam = searchParams.get('kind')
    const appliedKind: SpecializationKind = isKind(kindParam)
        ? kindParam
        : capabilities.defaultKind
    const appliedDestination = searchParams.get('destination') ?? ''
    const appliedDate = searchParams.get('date') ?? ''
    const appliedTravelers = searchParams.get('travelers') ?? ''

    const [draftKind, setDraftKind] = useState<SpecializationKind>(appliedKind)
    const [destination, setDestination] = useState(appliedDestination)
    const [departureDate, setDepartureDate] = useState(appliedDate)
    const [travelers, setTravelers] = useState(appliedTravelers)

    useEffect(() => {
        setDraftKind(appliedKind)
        setDestination(appliedDestination)
        setDepartureDate(appliedDate)
        setTravelers(appliedTravelers)
    }, [appliedKind, appliedDestination, appliedDate, appliedTravelers])

    const destinationOptions = useMemo(
        () =>
            (destinationsByKind[draftKind] ?? []).map((value) => ({
                value,
                label: value,
            })),
        [draftKind, destinationsByKind]
    )

    const filtered = useMemo(() => {
        const travelersCount = Number(appliedTravelers)
        return (listingsByKind[appliedKind] ?? []).filter((item) => {
            if (
                appliedDestination &&
                !item.location
                    .toLowerCase()
                    .includes(appliedDestination.toLowerCase()) &&
                !item.title.toLowerCase().includes(appliedDestination.toLowerCase())
            ) {
                return false
            }
            if (appliedDate && item.departureDate && item.departureDate < appliedDate) {
                return false
            }
            if (
                travelersCount > 0 &&
                item.travelersCapacity != null &&
                item.travelersCapacity < travelersCount
            ) {
                return false
            }
            return true
        })
    }, [
        appliedDate,
        appliedDestination,
        appliedKind,
        appliedTravelers,
        listingsByKind,
    ])

    function applyFilters(next?: {
        kind?: SpecializationKind
        destination?: string
        date?: string
        travelers?: string
    }) {
        const kind = next?.kind ?? draftKind
        const dest = next?.destination ?? destination
        const date = next?.date ?? departureDate
        const people = next?.travelers ?? travelers
        const params = new URLSearchParams()
        params.set('kind', kind)
        if (dest) params.set('destination', dest)
        if (date) params.set('date', date)
        if (people) params.set('travelers', people)
        const host = searchParams.get('host')
        if (host) params.set('host', host)
        router.push(`/search?${params.toString()}`)
    }

    return (
        <>
            <SiteHeader page={page} capabilities={capabilities} />
            <main className="bg-[#FCF8F3]">
                <section className="border-b border-black/5 bg-[linear-gradient(180deg,#F7F1E8_0%,#FCF8F3_100%)] pb-10 pt-14 md:pb-12 md:pt-20">
                    <div className="site-container">
                        <p className="text-sm capitalize text-[#777]">Search</p>
                        <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight text-[#111] md:text-5xl">
                            Find your next trip
                        </h1>
                        <p className="mt-3 max-w-2xl text-[#333]/70">
                            Filter by destination, departure date, and party size. Results stay
                            scoped to this agency&apos;s specializations.
                        </p>

                        <div className="mt-8 rounded-[24px] border border-black/5 bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] md:p-5">
                            {capabilities.showTabs ? (
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {capabilities.tabs.map((tab) => (
                                        <button
                                            key={tab.kind}
                                            type="button"
                                            onClick={() => {
                                                setDraftKind(tab.kind)
                                                setDestination('')
                                            }}
                                            className={cn(
                                                'rounded-full px-4 py-2 text-sm',
                                                draftKind === tab.kind
                                                    ? 'bg-[#111] text-white'
                                                    : 'bg-[#F2EEE8] text-[#333]'
                                            )}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            ) : null}

                            <form
                                className="grid gap-3 md:grid-cols-[1.2fr_1.2fr_0.9fr_auto]"
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    applyFilters()
                                }}
                            >
                                <label className="block">
                                    <span className="mb-1.5 block px-1 text-[11px] font-medium uppercase tracking-wide text-[#666]">
                                        Destination
                                    </span>
                                    <Select
                                        value={destination}
                                        onChange={setDestination}
                                        options={destinationOptions}
                                        placeholder="Anywhere"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-1.5 block px-1 text-[11px] font-medium uppercase tracking-wide text-[#666]">
                                        Departure
                                    </span>
                                    <DateField
                                        value={departureDate}
                                        onChange={setDepartureDate}
                                        placeholder="Any date"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-1.5 block px-1 text-[11px] font-medium uppercase tracking-wide text-[#666]">
                                        Travelers
                                    </span>
                                    <input
                                        type="number"
                                        min={1}
                                        max={50}
                                        value={travelers}
                                        onChange={(e) => setTravelers(e.target.value)}
                                        className="w-full rounded-xl bg-[#F7F3EE] px-4 py-3 text-sm outline-none"
                                        placeholder="2"
                                    />
                                </label>
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111] px-5 py-3 text-sm font-medium text-white"
                                    >
                                        <SearchIcon className="h-4 w-4" />
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                <section className="py-12 md:py-16">
                    <div className="site-container">
                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm text-[#666]">
                                    {filtered.length} result{filtered.length === 1 ? '' : 's'}
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-[#111]">
                                    {capabilities.tabs.find((t) => t.kind === appliedKind)
                                        ?.label || 'Results'}
                                </h2>
                            </div>
                        </div>

                        {filtered.length === 0 ? (
                            <EmptyState
                                title="No matching trips"
                                description="Try another destination, date, or traveler count — or clear filters and browse all published listings."
                            />
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filtered.map((item, i) => (
                                    <ListingCard
                                        key={item.id}
                                        item={item}
                                        index={i}
                                        agencyId={agencyId}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <SiteFooter page={page} agencyId={agencyId} />
        </>
    )
}

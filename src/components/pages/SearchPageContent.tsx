'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MapPin, Search as SearchIcon, Users } from 'lucide-react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ClassicPageHero } from '@/components/pages/ClassicPageHero'
import { FeaturedListingCard } from '@/components/listings/FeaturedListingCard'
import { ListingCard } from '@/components/listings/ListingCard'
import { DateField } from '@/components/ui/DateField'
import { EmptyState } from '@/components/ui/EmptyState'
import { Select } from '@/components/ui/Select'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import {
    isClassicTemplate,
    pillTabClass,
    primaryButtonClass,
    softFieldClass,
} from '@/lib/templates/chrome'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import { copyAgencyPreviewParams } from '@/lib/templates/preview-template'
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
    const variant = useTemplateVariant()
    const classic = isClassicTemplate(variant)
    const heroImage =
        resolveThemeAssetUrl(page.sections?.hero?.backgroundImages?.[0]) ||
        resolveThemeAssetUrl(page.sections?.hero?.backgroundImage) ||
        resolveThemeAssetUrl(page.sections?.planPerfectTrip?.image?.src)

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

    function applyFilters() {
        const params = new URLSearchParams()
        params.set('kind', draftKind)
        if (destination) params.set('destination', destination)
        if (departureDate) params.set('date', departureDate)
        if (travelers) params.set('travelers', travelers)
        copyAgencyPreviewParams(params, searchParams)
        router.push(`/search?${params.toString()}`)
    }

    const resultsTitle =
        capabilities.tabs.find((t) => t.kind === appliedKind)?.label || 'Results'

    if (classic) {
        return (
            <>
                <SiteHeader page={page} capabilities={capabilities} overlay />
                <main className="site-bg">
                    <ClassicPageHero
                        eyebrow="Search"
                        title="Find your next trip"
                        subtitle="Filter by destination, departure date, and party size."
                        imageSrc={heroImage}
                        size="default"
                        contentClassName="pb-12 md:pb-14"
                    >
                        <div className="pointer-events-auto mx-auto mt-8 w-full max-w-5xl">
                            {capabilities.showTabs ? (
                                <div className="mb-3 flex flex-wrap justify-center gap-2">
                                    {capabilities.tabs.map((tab) => (
                                        <button
                                            key={tab.kind}
                                            type="button"
                                            onClick={() => {
                                                setDraftKind(tab.kind)
                                                setDestination('')
                                            }}
                                            className={cn(
                                                'rounded-full px-4 py-1.5 text-sm font-medium transition',
                                                draftKind === tab.kind
                                                    ? 'bg-white text-[var(--color-brand)]'
                                                    : 'bg-white/15 text-white hover:bg-white/25'
                                            )}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            ) : null}

                            <form
                                className="flex w-full min-w-0 flex-col overflow-hidden rounded-xl bg-white text-[#111] shadow-[0_18px_50px_rgba(0,0,0,0.22)] lg:flex-row lg:items-stretch"
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    applyFilters()
                                }}
                            >
                                <div className="grid min-w-0 flex-1 grid-cols-1 divide-y divide-[#E6E8EB] sm:grid-cols-3 sm:divide-y-0 lg:divide-x lg:divide-[#E6E8EB]">
                                    <div className="min-w-0 sm:border-b sm:border-[#E6E8EB] lg:border-b-0">
                                        <Select
                                            variant="bare"
                                            value={destination}
                                            onChange={setDestination}
                                            options={destinationOptions}
                                            placeholder="Anywhere"
                                            leadingIcon={
                                                <MapPin className="h-4 w-4" strokeWidth={1.75} />
                                            }
                                        />
                                    </div>
                                    <div className="min-w-0 sm:border-b sm:border-l sm:border-[#E6E8EB] lg:border-b-0 lg:border-l-0">
                                        <DateField
                                            variant="bare"
                                            value={departureDate}
                                            onChange={setDepartureDate}
                                            placeholder="Any date"
                                        />
                                    </div>
                                    <div className="min-w-0 sm:border-l sm:border-[#E6E8EB] lg:border-l-0">
                                        <div className="flex h-full items-center gap-2 px-3.5 py-3.5">
                                            <Users
                                                className="h-4 w-4 shrink-0 text-[#8A9199]"
                                                strokeWidth={1.75}
                                            />
                                            <input
                                                type="number"
                                                min={1}
                                                max={50}
                                                value={travelers}
                                                onChange={(e) => setTravelers(e.target.value)}
                                                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9AA0A6]"
                                                placeholder="Travelers"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn-brand flex w-full shrink-0 items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold sm:py-4 lg:w-auto lg:min-w-[132px]"
                                >
                                    <span>Search</span>
                                    <SearchIcon className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                                </button>
                            </form>
                        </div>
                    </ClassicPageHero>

                    <section className="section-spacing section-spacing-top bg-white">
                        <div className="site-container">
                            <div className="mx-auto mb-8 max-w-2xl text-center">
                                <p className="text-brand text-sm font-medium uppercase">
                                    {filtered.length} result
                                    {filtered.length === 1 ? '' : 's'}
                                </p>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                                    {resultsTitle}
                                </h2>
                            </div>

                            {filtered.length === 0 ? (
                                <EmptyState
                                    title="No matching trips"
                                    description="Try another destination, date, or traveler count — or clear filters and browse all published listings."
                                />
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {filtered.map((item, i) => (
                                        <FeaturedListingCard
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
                <SiteFooter page={page} agencyId={agencyId} capabilities={capabilities} />
            </>
        )
    }

    return (
        <>
            <SiteHeader page={page} capabilities={capabilities} />
            <main className="site-bg">
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
                                            className={pillTabClass(
                                                draftKind === tab.kind,
                                                variant
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
                                        className={softFieldClass(variant, 'w-full')}
                                        placeholder="2"
                                    />
                                </label>
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        className={primaryButtonClass(
                                            variant,
                                            'flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium'
                                        )}
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
                                    {resultsTitle}
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
            <SiteFooter page={page} agencyId={agencyId} capabilities={capabilities} />
        </>
    )
}

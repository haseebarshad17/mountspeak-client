'use client'

import { useMemo, useState } from 'react'
import {
    Bus,
    CalendarDays,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock3,
    MapPin,
    Minus,
    Mountain,
    Plus,
    Users,
} from 'lucide-react'
import { AgencyLink } from '@/components/links/AgencyLink'
import { SaveListingButton } from '@/components/listings/SaveListingButton'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { buildTourBookingHref } from '@/lib/booking/booking-href'
import type { HomepagePage } from '@/services/agency/agency.types'
import type { TourDetail } from '@/services/listings/listings.types'
import type { AgencySpecializationCapabilities } from '@/services/specialization/specialization.types'
import { cn } from '@/lib/utils/cn'

function formatDate(value: string | null) {
    if (!value) return null
    const date = new Date(`${value}T00:00:00`)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

function Fact({ label, value }: { label: string; value: string }) {
    return (
        <div className="px-4 py-4 md:px-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A8F98]">
                {label}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#1A1F2C] md:text-[0.95rem]">
                {value}
            </p>
        </div>
    )
}

export function TourDetailContent({
    page,
    capabilities,
    tour,
    agencyId,
}: {
    page: HomepagePage
    capabilities: AgencySpecializationCapabilities
    tour: TourDetail
    agencyId: string
}) {
    const [adults, setAdults] = useState(2)
    const [children, setChildren] = useState(0)
    const [galleryOpen, setGalleryOpen] = useState(false)

    const start = formatDate(tour.startDate)
    const durationLabel = [
        tour.nightCount != null ? `${tour.nightCount} Nights` : null,
        tour.dayCount != null ? `${tour.dayCount} Days` : null,
    ]
        .filter(Boolean)
        .join(' / ')

    const heroImages = useMemo(() => {
        const list = [tour.heroImageUrl, tour.overviewImageUrl, ...tour.gallery].filter(
            Boolean
        ) as string[]
        return [...new Set(list)]
    }, [tour.gallery, tour.heroImageUrl, tour.overviewImageUrl])

    const [heroIndex, setHeroIndex] = useState(0)
    const activeHero = heroImages[heroIndex] || null

    const galleryMain = tour.gallery[0] || tour.overviewImageUrl || tour.heroImageUrl
    const galleryThumbs = tour.gallery.slice(1, 5)
    const galleryExtra = Math.max(tour.gallery.length - 5, 0)

    const amenitySet = useMemo(() => {
        const set = new Set<string>()
        for (const stay of tour.stays) {
            for (const item of stay.amenities ?? []) set.add(item)
        }
        return [...set]
    }, [tour.stays])

    const regionBadge =
        tour.toLocation || tour.fromLocation || tour.location.split('→')[0]?.trim() || 'Pakistan'

    const bookingHref = buildTourBookingHref({
        slug: tour.slug,
        adults,
        children,
    })

    return (
        <>
            <SiteHeader page={page} capabilities={capabilities} />
            <main className="site-bg overflow-x-hidden pb-24 lg:pb-0">
                {/* Rounded hero card */}
                <section className="pt-6 md:pt-8">
                    <div className="site-container">
                        <div className="relative overflow-hidden rounded-[28px]">
                            <div className="relative aspect-[16/9] min-h-[280px] md:aspect-[21/9] md:min-h-[360px]">
                            {activeHero ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={activeHero}
                                    alt={tour.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-gradient-to-br from-[#1D3557] to-[#2A9D8F]" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                            {heroImages.length > 1 ? (
                                <div className="absolute right-4 top-4 flex gap-2">
                                    <SaveListingButton
                                        item={{
                                            id: tour.id,
                                            kind: 'tours',
                                            title: tour.title,
                                            location: tour.location,
                                            priceLabel: tour.priceLabel,
                                            imageUrl: tour.heroImageUrl,
                                            href: `/tours/${tour.slug}`,
                                        }}
                                        agencyId={agencyId}
                                        className="h-9 w-9"
                                    />
                                    <button
                                        type="button"
                                        aria-label="Previous image"
                                        onClick={() =>
                                            setHeroIndex((i) =>
                                                i === 0 ? heroImages.length - 1 : i - 1
                                            )
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#111] shadow-sm backdrop-blur"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next image"
                                        onClick={() =>
                                            setHeroIndex((i) =>
                                                i === heroImages.length - 1 ? 0 : i + 1
                                            )
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#111] shadow-sm backdrop-blur"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="absolute right-4 top-4">
                                    <SaveListingButton
                                        item={{
                                            id: tour.id,
                                            kind: 'tours',
                                            title: tour.title,
                                            location: tour.location,
                                            priceLabel: tour.priceLabel,
                                            imageUrl: tour.heroImageUrl,
                                            href: `/tours/${tour.slug}`,
                                        }}
                                        agencyId={agencyId}
                                        className="h-9 w-9"
                                    />
                                </div>
                            )}

                            <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
                                <div className="flex flex-wrap gap-2">
                                    {tour.tag ? (
                                        <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                                            {tour.tag}
                                        </span>
                                    ) : null}
                                    <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                                        {regionBadge}
                                    </span>
                                </div>
                                <h1 className="mt-3 max-w-3xl text-2xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                                    {tour.title}
                                    {tour.dayCount ? ` – ${tour.dayCount} Days` : ''}
                                </h1>
                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/85 md:text-sm">
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {tour.location}
                                    </span>
                                    {durationLabel ? (
                                        <span className="inline-flex items-center gap-1.5">
                                            <Clock3 className="h-3.5 w-3.5" />
                                            {durationLabel.replace(' / ', ' & ')}
                                        </span>
                                    ) : null}
                                    <span className="inline-flex items-center gap-1.5">
                                        <Bus className="h-3.5 w-3.5" />
                                        Transport included
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </section>

                {/* Quick facts */}
                <section>
                    <div className="site-container">
                        <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-black/[0.06] bg-white md:grid-cols-4">
                        <Fact
                            label="Duration"
                            value={durationLabel || 'Flexible'}
                        />
                        <Fact
                            label="Difficulty"
                            value={tour.difficulty || 'Moderate'}
                        />
                        <Fact
                            label="Max Group"
                            value={
                                tour.capacityTotal
                                    ? `${Math.max(tour.capacityTotal - 2, 8)}–${tour.capacityTotal} people`
                                    : 'On request'
                            }
                        />
                        <Fact
                            label="Elevation"
                            value={
                                tour.elevationM
                                    ? `Up to ${tour.elevationM}m`
                                    : 'All ages welcome'
                            }
                        />
                        </div>
                    </div>
                </section>

                {/* Content + sticky sidebar */}
                <section className="py-10 md:py-14">
                    <div className="site-container grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-start">
                        <div className="min-w-0 space-y-12">
                            {/* Overview */}
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-[#1A1F2C]">
                                    Overview
                                </h2>
                                {tour.overviewTitle ? (
                                    <p className="mt-2 text-lg font-medium text-[#3D4450]">
                                        {tour.overviewTitle}
                                    </p>
                                ) : null}
                                {tour.overviewBody ? (
                                    <p className="mt-4 text-[0.95rem] leading-relaxed text-[#5B6472]">
                                        {tour.overviewBody}
                                    </p>
                                ) : (
                                    <div className="mt-4">
                                        <EmptyState
                                            title="Overview coming soon"
                                            description="Trip overview will appear here once published."
                                        />
                                    </div>
                                )}

                                {tour.highlights.length > 0 ? (
                                    <div className="mt-6">
                                        <h3 className="text-base font-semibold text-[#1A1F2C]">
                                            Route highlights
                                        </h3>
                                        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                                            {tour.highlights.map((item) => (
                                                <li
                                                    key={item.title}
                                                    className="flex gap-2.5 text-sm text-[#3D4450]"
                                                >
                                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#06403D] text-white">
                                                        <Check className="h-3 w-3" strokeWidth={3} />
                                                    </span>
                                                    <span>
                                                        <span className="font-medium">
                                                            {item.title}
                                                        </span>
                                                        {item.description ? (
                                                            <span className="mt-0.5 block text-[#6B7280]">
                                                                {item.description}
                                                            </span>
                                                        ) : null}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
                            </div>

                            {/* Pickup / places */}
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-[#1A1F2C]">
                                    Pickup points & stops
                                </h2>
                                {tour.places.length === 0 ? (
                                    <div className="mt-4">
                                        <EmptyState
                                            title="No stops listed yet"
                                            description="Places visited will appear here when available."
                                        />
                                    </div>
                                ) : (
                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                        {tour.places.map((place) => (
                                            <div
                                                key={place.name}
                                                className="flex gap-3 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-2"
                                            >
                                                <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-[#EDE7DE]">
                                                    {place.imageUrl ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={place.imageUrl}
                                                            alt={place.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : null}
                                                </div>
                                                <div className="flex min-w-0 flex-col justify-center py-1 pr-2">
                                                    <p className="truncate font-semibold text-[#1A1F2C]">
                                                        {place.name}
                                                    </p>
                                                    {place.location_label ? (
                                                        <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-[#6B7280]">
                                                            <MapPin className="h-3 w-3" />
                                                            {place.location_label}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Itinerary timeline */}
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-[#1A1F2C]">
                                    Itinerary
                                </h2>
                                <p className="mt-1 text-sm text-[#6B7280]">
                                    Day by day journey
                                </p>

                                {tour.journey.length === 0 ? (
                                    <div className="mt-4">
                                        <EmptyState
                                            title="Itinerary coming soon"
                                            description="Daily journey details will appear here once published."
                                        />
                                    </div>
                                ) : (
                                    <ol className="relative mt-8 space-y-0">
                                        {tour.journey.map((day, index) => (
                                            <li
                                                key={`day-${day.day}`}
                                                className="relative flex gap-4 pb-8 last:pb-0"
                                            >
                                                <div className="relative flex w-8 shrink-0 flex-col items-center">
                                                    <span className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#06403D] text-xs font-semibold text-white">
                                                        {day.day}
                                                    </span>
                                                    {index < tour.journey.length - 1 ? (
                                                        <span className="absolute top-8 bottom-0 w-px bg-[#D6DDD9]" />
                                                    ) : null}
                                                </div>
                                                <div className="min-w-0 flex-1 rounded-2xl border border-black/[0.06] bg-white p-4 md:p-5">
                                                    <span className="inline-flex rounded-full bg-[#EEF4F2] px-2.5 py-0.5 text-[11px] font-medium text-[#06403D]">
                                                        Day {String(day.day).padStart(2, '0')}
                                                    </span>
                                                    <h3 className="mt-2 text-lg font-semibold text-[#1A1F2C]">
                                                        {day.title}
                                                    </h3>
                                                    {day.description ? (
                                                        <p className="mt-2 text-sm leading-relaxed text-[#5B6472]">
                                                            {day.description}
                                                        </p>
                                                    ) : null}
                                                    {day.imageUrl ? (
                                                        <div className="mt-3 overflow-hidden rounded-xl">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={day.imageUrl}
                                                                alt={day.title}
                                                                className="aspect-[16/8] w-full object-cover"
                                                            />
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </div>

                            {/* Stay & dine */}
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-[#1A1F2C]">
                                    Stay & dine
                                </h2>
                                <p className="mt-1 text-sm text-[#6B7280]">
                                    Where you&apos;ll sleep and eat
                                </p>

                                {tour.stays.length === 0 ? (
                                    <div className="mt-4">
                                        <EmptyState
                                            title="Stays coming soon"
                                            description="Lodging details will appear here when available."
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                                            {tour.stays.map((stay) => (
                                                <article
                                                    key={stay.name}
                                                    className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white"
                                                >
                                                    <div className="aspect-[16/10] bg-[#EDE7DE]">
                                                        {stay.imageUrl ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img
                                                                src={stay.imageUrl}
                                                                alt={stay.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : null}
                                                    </div>
                                                    <div className="p-4">
                                                        {stay.category ? (
                                                            <span className="rounded-full bg-[#F3EDE3] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#8B6B3D]">
                                                                {stay.category}
                                                            </span>
                                                        ) : null}
                                                        <h3 className="mt-2 font-semibold text-[#1A1F2C]">
                                                            {stay.name}
                                                        </h3>
                                                        {stay.description ? (
                                                            <p className="mt-1.5 text-sm leading-relaxed text-[#5B6472]">
                                                                {stay.description}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                        {amenitySet.length > 0 ? (
                                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                                                {amenitySet.map((item) => (
                                                    <span
                                                        key={item}
                                                        className="inline-flex items-center gap-1.5 text-sm text-[#5B6472]"
                                                    >
                                                        <Check className="h-3.5 w-3.5 text-[#C5A059]" />
                                                        {item.replace(/_/g, ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : null}
                                    </>
                                )}
                            </div>

                            {/* Gallery */}
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-[#1A1F2C]">
                                    Visual gallery
                                </h2>
                                {!galleryMain ? (
                                    <div className="mt-4">
                                        <EmptyState
                                            title="Gallery empty"
                                            description="Tour photos will appear here once uploaded."
                                        />
                                    </div>
                                ) : (
                                    <div className="mt-5 grid gap-3 md:grid-cols-[1.1fr_1fr]">
                                        <button
                                            type="button"
                                            onClick={() => setGalleryOpen(true)}
                                            className="overflow-hidden rounded-2xl"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={galleryMain}
                                                alt={`${tour.title} gallery`}
                                                className="aspect-[3/4] h-full max-h-[480px] w-full object-cover"
                                            />
                                        </button>
                                        <div className="grid grid-cols-2 gap-3">
                                            {galleryThumbs.map((src, i) => {
                                                const isLast =
                                                    i === galleryThumbs.length - 1 &&
                                                    galleryExtra > 0
                                                return (
                                                    <button
                                                        key={`${src}-${i}`}
                                                        type="button"
                                                        onClick={() => setGalleryOpen(true)}
                                                        className="relative overflow-hidden rounded-2xl"
                                                    >
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={src}
                                                            alt={`${tour.title} ${i + 2}`}
                                                            className="aspect-square w-full object-cover"
                                                        />
                                                        {isLast ? (
                                                            <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-lg font-semibold text-white">
                                                                +{galleryExtra} more
                                                            </span>
                                                        ) : null}
                                                    </button>
                                                )
                                            })}
                                            {galleryThumbs.length === 0
                                                ? Array.from({ length: 4 }).map((_, i) => (
                                                      <div
                                                          key={i}
                                                          className="aspect-square rounded-2xl bg-[#EDE7DE]"
                                                      />
                                                  ))
                                                : null}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Perks as inclusions */}
                            {tour.perks.length > 0 ? (
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-[#1A1F2C]">
                                        What&apos;s included
                                    </h2>
                                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                                        {tour.perks.map((perk) => (
                                            <li
                                                key={perk.title}
                                                className="flex gap-2.5 text-sm text-[#3D4450]"
                                            >
                                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#06403D] text-white">
                                                    <Check className="h-3 w-3" strokeWidth={3} />
                                                </span>
                                                <span>
                                                    <span className="font-medium">{perk.title}</span>
                                                    {perk.description ? (
                                                        <span className="mt-0.5 block text-[#6B7280]">
                                                            {perk.description}
                                                        </span>
                                                    ) : null}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}

                            {/* Route segments */}
                            {tour.routeSegments.length > 0 ? (
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-[#1A1F2C]">
                                        {tour.routeTitle || 'Route breakdown'}
                                    </h2>
                                    <div className="mt-5 space-y-3">
                                        {tour.routeSegments.map((segment, index) => (
                                            <div
                                                key={`${segment.title}-${index}`}
                                                className="rounded-2xl border border-black/[0.06] bg-white px-4 py-4"
                                            >
                                                <p className="text-sm font-semibold text-[#1A1F2C]">
                                                    {segment.title}
                                                </p>
                                                {segment.description ? (
                                                    <p className="mt-1.5 text-sm leading-relaxed text-[#5B6472]">
                                                        {segment.description}
                                                    </p>
                                                ) : null}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* Sticky booking sidebar */}
                        <aside className="min-w-0 lg:sticky lg:top-24">
                            <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                                <p className="text-sm text-[#6B7280]">from</p>
                                <p className="text-2xl font-bold tracking-tight text-[#1A1F2C]">
                                    {tour.priceLabel}
                                    <span className="ml-1 text-sm font-normal text-[#6B7280]">
                                        / Person
                                    </span>
                                </p>

                                <label className="mt-5 block">
                                    <span className="text-xs font-medium uppercase tracking-wide text-[#8A8F98]">
                                        Departure
                                    </span>
                                    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-black/10 bg-[#FAF7F2] px-3 py-2.5 text-sm text-[#1A1F2C]">
                                        <CalendarDays className="h-4 w-4 text-[#6B7280]" />
                                        {start || 'Dates on request'}
                                    </div>
                                </label>

                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center justify-between rounded-xl border border-black/10 px-3 py-2.5">
                                        <div>
                                            <p className="text-sm font-medium text-[#1A1F2C]">
                                                Adults
                                            </p>
                                            <p className="text-xs text-[#8A8F98]">Age 12+</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                aria-label="Fewer adults"
                                                onClick={() =>
                                                    setAdults((v) => Math.max(1, v - 1))
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10"
                                            >
                                                <Minus className="h-3.5 w-3.5" />
                                            </button>
                                            <span className="w-5 text-center text-sm font-semibold">
                                                {adults}
                                            </span>
                                            <button
                                                type="button"
                                                aria-label="More adults"
                                                onClick={() => setAdults((v) => v + 1)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl border border-black/10 px-3 py-2.5">
                                        <div>
                                            <p className="text-sm font-medium text-[#1A1F2C]">
                                                Children
                                            </p>
                                            <p className="text-xs text-[#8A8F98]">Age 5–11</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                aria-label="Fewer children"
                                                onClick={() =>
                                                    setChildren((v) => Math.max(0, v - 1))
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10"
                                            >
                                                <Minus className="h-3.5 w-3.5" />
                                            </button>
                                            <span className="w-5 text-center text-sm font-semibold">
                                                {children}
                                            </span>
                                            <button
                                                type="button"
                                                aria-label="More children"
                                                onClick={() => setChildren((v) => v + 1)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <AgencyLink
                                    href={bookingHref}
                                    className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#06403D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#053532]"
                                >
                                    Book now
                                </AgencyLink>

                                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-[#06403D] px-3 py-3 text-center text-white">
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {tour.confirmedSeats ?? 0}
                                        </p>
                                        <p className="text-[10px] text-white/70">Booked</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {tour.capacityTotal ?? '—'}
                                        </p>
                                        <p className="text-[10px] text-white/70">Capacity</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {tour.difficulty ? 'Live' : 'Open'}
                                        </p>
                                        <p className="text-[10px] text-white/70">Status</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-black/[0.06] p-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3EDE3] text-[#8B6B3D]">
                                            <Users className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#1A1F2C]">
                                                Talk to an expert
                                            </p>
                                            <p className="text-xs text-[#6B7280]">
                                                Get trip advice
                                            </p>
                                        </div>
                                    </div>
                                    <AgencyLink
                                        href="/contact-us"
                                        className="rounded-full bg-[#C5A059] px-3 py-1.5 text-xs font-semibold text-white"
                                    >
                                        Callback
                                    </AgencyLink>
                                </div>

                                {tour.elevationM ? (
                                    <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#6B7280]">
                                        <Mountain className="h-3.5 w-3.5" />
                                        Peak elevation {tour.elevationM}m
                                    </p>
                                ) : null}
                            </div>
                        </aside>
                    </div>
                </section>

                {/* Mobile sticky book bar */}
                <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 p-3 backdrop-blur lg:hidden">
                    <div className="site-container flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs text-[#6B7280]">from</p>
                            <p className="text-base font-semibold text-[#1A1F2C]">
                                {tour.priceLabel}
                            </p>
                        </div>
                        <AgencyLink
                            href={bookingHref}
                            className="rounded-xl bg-[#06403D] px-5 py-2.5 text-sm font-semibold text-white"
                        >
                            Book now
                        </AgencyLink>
                    </div>
                </div>

                {/* Simple gallery lightbox */}
                {galleryOpen && tour.gallery.length > 0 ? (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                        onClick={() => setGalleryOpen(false)}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div
                            className={cn(
                                'max-h-[85vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white p-3'
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-3 flex items-center justify-between px-1">
                                <p className="text-sm font-medium text-[#1A1F2C]">Gallery</p>
                                <button
                                    type="button"
                                    onClick={() => setGalleryOpen(false)}
                                    className="rounded-full px-3 py-1 text-sm text-[#6B7280] hover:bg-[#F4F0EA]"
                                >
                                    Close
                                </button>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {tour.gallery.map((src, i) => (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        key={`${src}-${i}`}
                                        src={src}
                                        alt={`${tour.title} ${i + 1}`}
                                        className="rounded-xl object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}
            </main>
            <SiteFooter page={page} agencyId={agencyId} />
        </>
    )
}

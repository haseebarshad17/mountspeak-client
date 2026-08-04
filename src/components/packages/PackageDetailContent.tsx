'use client'

import { useMemo, useState } from 'react'
import {
    CalendarDays,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock3,
    MapPin,
    Plane,
    Users,
} from 'lucide-react'
import { AgencyLink } from '@/components/links/AgencyLink'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { isClassicTemplate, primaryButtonClass } from '@/lib/templates/chrome'
import { cn } from '@/lib/utils/cn'
import type { HomepagePage } from '@/services/agency/agency.types'
import type { PackageDetail } from '@/services/listings/listings.types'
import type { AgencySpecializationCapabilities } from '@/services/specialization/specialization.types'

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

export function PackageDetailContent({
    page,
    capabilities,
    packageDetail,
}: {
    page: HomepagePage
    capabilities: AgencySpecializationCapabilities
    packageDetail: PackageDetail
}) {
    const variant = useTemplateVariant()
    const classic = isClassicTemplate(variant)
    const backHref =
        packageDetail.kind === 'umrah' ? '/packages' : '/tours?kind=international'
    const backLabel =
        packageDetail.kind === 'umrah' ? 'Back to packages' : 'Back to international tours'

    const heroImages = useMemo(() => {
        const list = [packageDetail.heroImageUrl, ...packageDetail.gallery].filter(
            Boolean
        ) as string[]
        return [...new Set(list)]
    }, [packageDetail.gallery, packageDetail.heroImageUrl])

    const [heroIndex, setHeroIndex] = useState(0)
    const activeHero = heroImages[heroIndex] || null

    const departure = formatDate(packageDetail.departureDate)
    const returnDate = formatDate(packageDetail.returnDate)
    const deadline = formatDate(packageDetail.bookingDeadline)
    const durationLabel = packageDetail.durationDays
        ? `${packageDetail.durationDays} Day${packageDetail.durationDays > 1 ? 's' : ''}`
        : null

    return (
        <>
            <SiteHeader page={page} capabilities={capabilities} overlay={classic} />
            <main className="site-bg overflow-x-hidden pb-24 md:pb-28">
                <section className={cn(classic ? 'px-3 pt-3 sm:px-5 sm:pt-5' : 'pt-6 md:pt-8')}>
                    <div className={classic ? undefined : 'site-container'}>
                        <div
                            className={cn(
                                'relative overflow-hidden',
                                classic ? 'rounded-2xl' : 'rounded-[28px]'
                            )}
                        >
                            <div className="relative aspect-[16/10] min-h-[280px] w-full bg-[#1A1F2C] sm:aspect-[21/9] sm:min-h-[360px]">
                                {activeHero ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={activeHero}
                                        alt={packageDetail.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : null}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />

                                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 md:p-10">
                                    <AgencyLink
                                        href={backHref}
                                        className="inline-flex items-center gap-1 text-sm text-white/80 transition hover:text-white"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        {backLabel}
                                    </AgencyLink>
                                    {packageDetail.badge ? (
                                        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
                                            {packageDetail.badge}
                                        </p>
                                    ) : null}
                                    <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                                        {packageDetail.title}
                                    </h1>
                                    <p className="mt-3 flex items-center gap-2 text-sm text-white/85">
                                        <MapPin className="h-4 w-4 shrink-0" />
                                        {packageDetail.location}
                                    </p>
                                </div>

                                {heroImages.length > 1 ? (
                                    <>
                                        <button
                                            type="button"
                                            aria-label="Previous image"
                                            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50"
                                            onClick={() =>
                                                setHeroIndex(
                                                    (current) =>
                                                        (current - 1 + heroImages.length) %
                                                        heroImages.length
                                                )
                                            }
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Next image"
                                            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50"
                                            onClick={() =>
                                                setHeroIndex(
                                                    (current) => (current + 1) % heroImages.length
                                                )
                                            }
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="site-container mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                    <div className="space-y-8">
                        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                            <div className="grid divide-y divide-black/5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                                {durationLabel ? (
                                    <Fact label="Duration" value={durationLabel} />
                                ) : null}
                                {departure ? <Fact label="Departure" value={departure} /> : null}
                                {returnDate ? <Fact label="Return" value={returnDate} /> : null}
                                {packageDetail.seatsAvailable != null ? (
                                    <Fact
                                        label="Seats left"
                                        value={String(packageDetail.seatsAvailable)}
                                    />
                                ) : null}
                            </div>
                        </div>

                        {packageDetail.shortDescription || packageDetail.detailedDescription ? (
                            <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm md:p-7">
                                <h2 className="text-xl font-semibold tracking-tight text-[#111]">
                                    Overview
                                </h2>
                                {packageDetail.shortDescription ? (
                                    <p className="mt-3 text-sm leading-relaxed text-[#555]">
                                        {packageDetail.shortDescription}
                                    </p>
                                ) : null}
                                {packageDetail.detailedDescription ? (
                                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#666]">
                                        {packageDetail.detailedDescription}
                                    </p>
                                ) : null}
                            </section>
                        ) : null}

                        {(packageDetail.airline ||
                            packageDetail.flightType ||
                            packageDetail.baggage) && (
                            <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm md:p-7">
                                <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-[#111]">
                                    <Plane className="h-5 w-5" />
                                    Flight details
                                </h2>
                                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                    {packageDetail.airline ? (
                                        <Fact label="Airline" value={packageDetail.airline} />
                                    ) : null}
                                    {packageDetail.flightType ? (
                                        <Fact label="Flight type" value={packageDetail.flightType} />
                                    ) : null}
                                    {packageDetail.baggage ? (
                                        <Fact label="Baggage" value={packageDetail.baggage} />
                                    ) : null}
                                </div>
                            </section>
                        )}

                        {packageDetail.hotels.length > 0 ? (
                            <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm md:p-7">
                                <h2 className="text-xl font-semibold tracking-tight text-[#111]">
                                    Hotels
                                </h2>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {packageDetail.hotels.map((hotel) => (
                                        <article
                                            key={`${hotel.label}-${hotel.name}`}
                                            className="overflow-hidden rounded-xl border border-black/5 bg-[#FAFAFA]"
                                        >
                                            {hotel.imageUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={hotel.imageUrl}
                                                    alt={hotel.name}
                                                    className="h-40 w-full object-cover"
                                                />
                                            ) : null}
                                            <div className="p-4">
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A8F98]">
                                                    {hotel.label}
                                                </p>
                                                <h3 className="mt-1 text-base font-semibold text-[#111]">
                                                    {hotel.name}
                                                </h3>
                                                <div className="mt-2 space-y-1 text-xs text-[#666]">
                                                    {hotel.rating ? <p>{hotel.rating}</p> : null}
                                                    {hotel.nights != null ? (
                                                        <p>{hotel.nights} nights</p>
                                                    ) : null}
                                                    {hotel.roomType ? <p>{hotel.roomType}</p> : null}
                                                    {hotel.distanceMeters != null ? (
                                                        <p>{hotel.distanceMeters}m from landmark</p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ) : null}

                        {packageDetail.stops.length > 0 ? (
                            <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm md:p-7">
                                <h2 className="text-xl font-semibold tracking-tight text-[#111]">
                                    Itinerary
                                </h2>
                                <ol className="mt-4 space-y-4">
                                    {packageDetail.stops.map((stop, index) => (
                                        <li key={`${stop.title}-${index}`} className="flex gap-3">
                                            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#111] text-xs font-semibold text-white">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <h3 className="text-sm font-semibold text-[#111]">
                                                    {stop.title}
                                                </h3>
                                                {stop.description ? (
                                                    <p className="mt-1 text-sm leading-relaxed text-[#666]">
                                                        {stop.description}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </section>
                        ) : null}

                        {(packageDetail.includes.length > 0 ||
                            packageDetail.excludes.length > 0) && (
                            <section className="grid gap-4 md:grid-cols-2">
                                {packageDetail.includes.length > 0 ? (
                                    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm md:p-6">
                                        <h2 className="text-lg font-semibold text-[#111]">
                                            Includes
                                        </h2>
                                        <ul className="mt-3 space-y-2">
                                            {packageDetail.includes.map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex items-start gap-2 text-sm text-[#555]"
                                                >
                                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
                                {packageDetail.excludes.length > 0 ? (
                                    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm md:p-6">
                                        <h2 className="text-lg font-semibold text-[#111]">
                                            Excludes
                                        </h2>
                                        <ul className="mt-3 space-y-2">
                                            {packageDetail.excludes.map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex items-start gap-2 text-sm text-[#555]"
                                                >
                                                    <span className="mt-0.5 text-[#999]">—</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
                            </section>
                        )}

                        {(packageDetail.notes || packageDetail.terms) && (
                            <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm md:p-7">
                                <h2 className="text-xl font-semibold tracking-tight text-[#111]">
                                    Notes & terms
                                </h2>
                                {packageDetail.notes ? (
                                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#666]">
                                        {packageDetail.notes}
                                    </p>
                                ) : null}
                                {packageDetail.terms ? (
                                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#666]">
                                        {packageDetail.terms}
                                    </p>
                                ) : null}
                            </section>
                        )}
                    </div>

                    <aside className="lg:sticky lg:top-24">
                        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm md:p-6">
                            <div className="flex flex-wrap items-baseline gap-2">
                                {packageDetail.originalPriceLabel ? (
                                    <span className="text-sm text-[#9AA0A6] line-through">
                                        {packageDetail.originalPriceLabel}
                                    </span>
                                ) : null}
                                <p className="text-2xl font-bold text-[#111]">
                                    {packageDetail.priceLabel}
                                </p>
                            </div>
                            {packageDetail.discountPercent ? (
                                <p className="mt-1 text-xs font-semibold text-emerald-700">
                                    {packageDetail.discountPercent}% off
                                </p>
                            ) : null}

                            <ul className="mt-4 space-y-2 text-sm text-[#666]">
                                {departure ? (
                                    <li className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4" />
                                        Departs {departure}
                                    </li>
                                ) : null}
                                {durationLabel ? (
                                    <li className="flex items-center gap-2">
                                        <Clock3 className="h-4 w-4" />
                                        {durationLabel}
                                    </li>
                                ) : null}
                                {packageDetail.seatsAvailable != null ? (
                                    <li className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        {packageDetail.seatsAvailable} seats available
                                    </li>
                                ) : null}
                                {deadline ? (
                                    <li className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4" />
                                        Book by {deadline}
                                    </li>
                                ) : null}
                            </ul>

                            <AgencyLink
                                href={packageDetail.requestHref}
                                className={
                                    variant === 'temp3'
                                        ? 'mt-5 flex w-full items-center justify-center rounded-xl bg-[#0A2F53] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0c3a66]'
                                        : primaryButtonClass(
                                              variant,
                                              'mt-5 flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold'
                                          )
                                }
                            >
                                Request booking
                            </AgencyLink>
                        </div>
                    </aside>
                </section>
            </main>
            <SiteFooter page={page} />
        </>
    )
}

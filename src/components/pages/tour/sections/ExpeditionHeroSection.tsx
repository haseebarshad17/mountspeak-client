'use client'

import React from 'react'
import { Banknote, CalendarDays, Mountain, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TourMediaImage } from '@/components/pages/tour/TourMediaImage'
import { TourSaveShareActions } from '@/components/tours/TourSaveShareActions'
import { usePrefixedHref } from '@/hooks/useAgencyPreviewBase'
import { DEMO_TOUR_DETAIL_PATH } from '@/lib/tours/default-tour-page'
import { cn } from '@/lib/utils/clsxUtils'
import { tourDetailPath } from '@/services/tours/tours.utils'

import type { TourPage } from './tour-page.types'

const heroHighlightIcons: Record<string, LucideIcon> = {
    calendar: CalendarDays,
    price: Banknote,
    mountain: Mountain,
}

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type ExpeditionHeroSectionProps = {
    page: TourPage
}

export function ExpeditionHeroSection({ page }: ExpeditionHeroSectionProps) {
    const { heroSection, finalCtaSection, theme } = page
    const { backgroundMedia, overlay, title, subtitle, tripHighlights } = heroSection
    const primaryButton =
        heroSection.ctaGroup.find((btn) => btn.style === 'primary')
        ?? finalCtaSection.buttons.find((btn) => btn.style === 'primary')

    const rawDetailPath = tourDetailPath(page.slug)
    const prefixedDetailPath = usePrefixedHref(rawDetailPath)
    const shareHref = prefixedDetailPath ?? rawDetailPath
    const canSaveTour =
        Boolean(page.id) &&
        UUID_RE.test(page.id) &&
        shareHref !== DEMO_TOUR_DETAIL_PATH

    return (
        <section
            id={heroSection.id}
            className="px-2 pt-2 sm:px-3 sm:pt-3 md:px-4 md:pt-4 lg:pt-[30px] xl:px-[18px]"
        >
            <div className="relative h-[70dvh] min-h-[480px] max-h-[720px] overflow-hidden rounded-[16px] sm:h-[75dvh] sm:min-h-[560px] sm:max-h-[780px] md:h-[80dvh] md:min-h-[620px] lg:min-h-[680px] xl:min-h-[720px]">
                <div className="absolute inset-0">
                    <TourMediaImage
                        src={backgroundMedia.desktop}
                        alt={backgroundMedia.alt}
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
                    {overlay.enabled ? (
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: overlay.color,
                                opacity: overlay.opacity,
                            }}
                        />
                    ) : null}
                </div>

                <div className="relative z-10 flex h-full flex-col justify-end pb-6 pt-16 sm:pb-10 sm:pt-20 md:pb-12 md:pt-24 lg:pb-14 lg:pt-28">
                    <div className="agency-container px-4 sm:px-8 lg:px-16">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
                            <div className="max-w-3xl text-white">
                                <h1
                                    className="font-heading w-full max-w-[672px] text-2xl font-semibold leading-tight tracking-tight xs:text-[26px] sm:text-4xl lg:text-[48px] lg:leading-[57px]"
                                    style={{ textShadow: '0 2px 40px rgba(0,0,0,0.35)' }}
                                >
                                    {title}
                                </h1>
                                {subtitle ? (
                                    <p className="mt-2 max-w-xl text-sm leading-normal text-[#FFFFFFCC] sm:mt-4 sm:text-base">
                                        {subtitle}
                                    </p>
                                ) : null}

                                {tripHighlights.length > 0 ? (
                                    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-white/95 sm:mt-6 sm:gap-x-8 sm:gap-y-3 sm:text-base">
                                        {tripHighlights.map((item) => {
                                            const Icon = heroHighlightIcons[item.icon] ?? CalendarDays
                                            return (
                                                <li key={item.label} className="flex items-center gap-2.5">
                                                    <Icon className="h-5 w-5 shrink-0 opacity-90" strokeWidth={1.75} />
                                                    <span>{item.label}</span>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                ) : null}

                                {canSaveTour ? (
                                    <TourSaveShareActions
                                        tourId={page.id}
                                        shareHref={shareHref}
                                        variant="hero"
                                        className="mt-4 lg:hidden"
                                    />
                                ) : null}
                            </div>

                            <div className="hidden shrink-0 items-center gap-3 lg:flex">
                                {canSaveTour ? (
                                    <TourSaveShareActions
                                        tourId={page.id}
                                        shareHref={shareHref}
                                        variant="hero"
                                    />
                                ) : null}
                                {primaryButton ? (
                                    <Button
                                        href={page.isBookingClosed ? undefined : primaryButton.url}
                                        disabled={page.isBookingClosed === true}
                                        variant="default"
                                        className={cn(
                                            'h-12 min-w-[200px] rounded-md px-10 text-sm shadow-[0_8px_28px_rgba(0,0,0,0.22)]',
                                            page.isBookingClosed && 'opacity-60 shadow-none',
                                        )}
                                        style={{
                                            backgroundColor: theme.secondaryColor,
                                            borderColor: theme.secondaryColor,
                                        }}
                                    >
                                        {page.isBookingClosed ? 'Booking Closed' : primaryButton.label}
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

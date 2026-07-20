'use client'

import React, { useEffect } from 'react'

import type { TourPage } from './sections/tour-page.types'
import { PickupPointsSection } from './sections/PickupPointsSection'
import { DayByDayItinerarySection } from './sections/DayByDayItinerarySection'
import { ExpeditionClosingCtaSection } from './sections/ExpeditionClosingCtaSection'
import { ExpeditionHeroSection } from './sections/ExpeditionHeroSection'
import { ExpeditionOverviewSection } from './sections/ExpeditionOverviewSection'
import { ExpeditionPerksTechnicalsSection } from './sections/ExpeditionPerksTechnicalsSection'
import { TechnicalRouteBreakdownSection } from './sections/TechnicalRouteBreakdownSection'
import { StayAndDineCardsSection } from './sections/StayAndDineCardsSection'
import { VisualFragmentsGallerySection } from './sections/VisualFragmentsGallerySection'
import { TourFloatingBookBar } from './sections/TourFloatingBookBar'
import { PackageBookingRequestSection } from './sections/PackageBookingRequestSection'
import { isInquiryOnlyTourPage } from '@/lib/tours/tour-inquiry-cta'
import { getOrCreateEventSessionId } from '@/services/events/events.session'
import { useAgencyTrackingReady } from '@/services/events/useAgencyTrackingReady'
import { useTrackEvent } from '@/services/events/useTrackEvent'

type TourPageContentProps = {
    page: TourPage
}

const TourPageContent = ({ page }: TourPageContentProps) => {
    const { theme } = page
    const isTrackingReady = useAgencyTrackingReady()
    const trackEvent = useTrackEvent()

    useEffect(() => {
        if (!isTrackingReady || !page.id) return

        const sessionId = getOrCreateEventSessionId()
        const dedupeKey = `tour_view:${page.id}:${sessionId}`

        try {
            if (typeof window !== 'undefined' && sessionStorage.getItem(dedupeKey)) {
                return
            }
        } catch {
            // private mode / blocked storage — still track
        }

        const tracked = trackEvent({
            event_type: 'TOUR_VIEW',
            path: page.listingKind === 'international'
                ? `/packages/international/${page.id}`
                : page.listingKind === 'umrah'
                  ? `/packages/umrah/${page.id}`
                  : `/tours/${page.slug}`,
            entity_type: page.listingKind === 'international'
                ? 'international_tour'
                : page.listingKind === 'umrah'
                  ? 'umrah_plan'
                  : 'tour',
            entity_id: page.id,
            metadata: {
                tour_slug: page.slug,
                tour_title: page.heroSection?.title ?? page.seo?.metaTitle ?? null,
                listing_kind: page.listingKind ?? 'tour',
            },
        })

        if (!tracked) return

        try {
            sessionStorage.setItem(dedupeKey, '1')
        } catch {
            // private mode / blocked storage
        }
    }, [isTrackingReady, page.id, page.slug, page.heroSection?.title, page.seo?.metaTitle, trackEvent])

    return (
        <div
            className="min-h-screen overflow-x-hidden pb-24 font-body lg:pb-0"
            style={
                {
                    '--tour-primary': theme.primaryColor,
                    '--tour-secondary': theme.secondaryColor,
                    '--tour-bg': theme.backgroundColor,
                    '--tour-text': theme.textColor,
                } as React.CSSProperties
            }
        >
            <ExpeditionHeroSection page={page} />
            <ExpeditionOverviewSection page={page} />
            {page.pickupPointsSection ? (
                <PickupPointsSection section={page.pickupPointsSection} />
            ) : null}
            <TechnicalRouteBreakdownSection page={page} />
            <DayByDayItinerarySection page={page} />
            <StayAndDineCardsSection page={page} />
            <ExpeditionPerksTechnicalsSection page={page} />
            <VisualFragmentsGallerySection page={page} />
            {isInquiryOnlyTourPage(page) ? <PackageBookingRequestSection page={page} /> : null}
            <ExpeditionClosingCtaSection page={page} />
            <TourFloatingBookBar page={page} />
        </div>
    )
}

export default TourPageContent

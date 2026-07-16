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
import { getOrCreateEventSessionId } from '@/services/events/events.session'
import { useTrackEvent } from '@/services/events/useTrackEvent'

type TourPageContentProps = {
    page: TourPage
}

const TourPageContent = ({ page }: TourPageContentProps) => {
    const { theme } = page
    const trackEvent = useTrackEvent()

    useEffect(() => {
        if (!page.id) return

        const sessionId = getOrCreateEventSessionId()
        const dedupeKey = `tour_view:${page.id}:${sessionId}`

        try {
            if (typeof window !== 'undefined' && sessionStorage.getItem(dedupeKey)) {
                return
            }
            sessionStorage.setItem(dedupeKey, '1')
        } catch {
            // private mode / blocked storage — still track
        }

        trackEvent({
            event_type: 'TOUR_VIEW',
            path: `/tours/${page.slug}`,
            entity_type: 'tour',
            entity_id: page.id,
            metadata: {
                tour_slug: page.slug,
                tour_title: page.heroSection?.title ?? page.seo?.metaTitle ?? null,
            },
        })
    }, [page.id, page.slug, page.heroSection?.title, page.seo?.metaTitle, trackEvent])

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
            <ExpeditionClosingCtaSection page={page} />
            <TourFloatingBookBar page={page} />
        </div>
    )
}

export default TourPageContent

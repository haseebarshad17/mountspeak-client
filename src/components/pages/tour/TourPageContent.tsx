import React from 'react'
import { notFound } from 'next/navigation'

import tourDocument from './tour-content.json'
import { DayByDayItinerarySection } from './sections/DayByDayItinerarySection'
import { ExpeditionClosingCtaSection } from './sections/ExpeditionClosingCtaSection'
import { ExpeditionHeroSection } from './sections/ExpeditionHeroSection'
import { ExpeditionOverviewSection } from './sections/ExpeditionOverviewSection'
import { ExpeditionPerksTechnicalsSection } from './sections/ExpeditionPerksTechnicalsSection'
import { PlacesVisitedCardsSection } from './sections/PlacesVisitedCardsSection'
import { StayAndDineCardsSection } from './sections/StayAndDineCardsSection'
import { TechnicalRouteBreakdownSection } from './sections/TechnicalRouteBreakdownSection'
import { VisualFragmentsGallerySection } from './sections/VisualFragmentsGallerySection'

type TourPageContentProps = {
    tourSlug: string
}

const TourPageContent = ({ tourSlug }: TourPageContentProps) => {
    const page = tourDocument.page

    if (page.slug !== tourSlug) {
        notFound()
    }

    const { theme } = page

    return (
        <div
            className="min-h-screen font-body"
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
            <TechnicalRouteBreakdownSection page={page} />
            <PlacesVisitedCardsSection page={page} />
            <DayByDayItinerarySection page={page} />
            <StayAndDineCardsSection page={page} />
            <ExpeditionPerksTechnicalsSection page={page} />
            <VisualFragmentsGallerySection page={page} />
            <ExpeditionClosingCtaSection page={page} />
        </div>
    )
}

export default TourPageContent

import React from 'react'

import type { TourPage } from './sections/tour-page.types'
import { DayByDayItinerarySection } from './sections/DayByDayItinerarySection'
import { ExpeditionClosingCtaSection } from './sections/ExpeditionClosingCtaSection'
import { ExpeditionHeroSection } from './sections/ExpeditionHeroSection'
import { ExpeditionOverviewSection } from './sections/ExpeditionOverviewSection'
import { ExpeditionPerksTechnicalsSection } from './sections/ExpeditionPerksTechnicalsSection'
import { PlacesVisitedCardsSection } from './sections/PlacesVisitedCardsSection'
import { TechnicalRouteBreakdownSection } from './sections/TechnicalRouteBreakdownSection'
import { StayAndDineCardsSection } from './sections/StayAndDineCardsSection'
import { VisualFragmentsGallerySection } from './sections/VisualFragmentsGallerySection'

type TourPageContentProps = {
    page: TourPage
}

const TourPageContent = ({ page }: TourPageContentProps) => {
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

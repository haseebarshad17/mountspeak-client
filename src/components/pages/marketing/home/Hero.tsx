'use client'

import React from 'react'
import { STATIC_UI_COLORS } from '@/data/homepage'
import HeroFilters from '@/components/pages/marketing/home/HeroFilters'
import { useTemplateStyles } from '@/components/providers/TemplateStylesProvider'
import { PageHeroBanner } from '@/components/ui/page-hero-banner'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { useHeroBackgroundImage } from '@/hooks/useHeroBackgroundImage'
import { useSiteListingCopy } from '@/hooks/useTourOrPackageCopy'
import {
    adaptTourCopyForUmrah,
    resolveDefaultListingKind,
} from '@/lib/homepage/specialization'
import { cn } from '@/lib/utils/clsxUtils'
import {
    selectHomepageAgencySpecializationIds,
    selectHomepageSpecializationId,
    selectHomepageSpecializations,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

type HeroProps = HomepagePageProps & {
    tourLocations?: string[]
}

const Hero = ({ page, tourLocations = [] }: HeroProps) => {
    const { hero } = page.sections
    const backgroundImage = useHeroBackgroundImage(hero.backgroundImage)
    const { isUmrahSite, isMultiSpec } = useSiteListingCopy()
    const heroStyles = useTemplateStyles().pages.home.hero
    const specializationId = useAppSelector(selectHomepageSpecializationId)
    const agencySpecializationIds = useAppSelector(selectHomepageAgencySpecializationIds)
    const specializations = useAppSelector(selectHomepageSpecializations)
    const listingType = resolveDefaultListingKind(
        specializationId,
        agencySpecializationIds,
        specializations,
    )
    const heroParagraph = isMultiSpec
        ? hero.paragraph
        : adaptTourCopyForUmrah(hero.paragraph, isUmrahSite)

    return (
        <PageHeroBanner
            backgroundImage={backgroundImage}
            className={cn(heroStyles.section)}
            bannerClassName={cn(heroStyles.banner)}
            overlayClassName={cn(heroStyles.overlay)}
        >
            <main className={cn(heroStyles.main)}>
                <div className='agency-container'>
                    <div className={cn(heroStyles.content)}>
                        <h1
                            className={cn(heroStyles.heading)}
                            style={{ color: STATIC_UI_COLORS.heroTitle, fontFamily: 'var(--hp-font-heading)' }}
                        >
                            {hero.title}
                        </h1>
                        <p
                            className={cn(heroStyles.paragraph)}
                            style={{ color: STATIC_UI_COLORS.heroText, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {heroParagraph}
                        </p>
                    </div>

                    <div className={cn(heroStyles.filtersWrap)}>
                        <HeroFilters
                            page={page}
                            tourLocations={tourLocations}
                            listingType={listingType}
                        />
                    </div>
                </div>
            </main>
        </PageHeroBanner>
    )
}

export default Hero

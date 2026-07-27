'use client'

import React from 'react'
import { STATIC_UI_COLORS } from '@/data/homepage'
import HeroFilters from '@/components/pages/marketing/home/HeroFilters'
import { HeroBackgroundSlider } from '@/components/pages/marketing/home/HeroBackgroundSlider'
import { useTemplateStyles } from '@/components/providers/TemplateStylesProvider'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { useHeroBackgroundSlides } from '@/hooks/useHeroBackgroundSlides'
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
    const backgroundImages = useHeroBackgroundSlides(hero)
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
        <HeroBackgroundSlider
            images={backgroundImages}
            className={cn(heroStyles.section)}
            bannerClassName={cn(heroStyles.banner)}
            overlayClassName={cn(heroStyles.overlay)}
        >
            <main className={cn(heroStyles.main, 'select-none')}>
                <div className='agency-container'>
                    <div className={cn(heroStyles.content, 'pointer-events-none select-none')}>
                        <h1
                            className={cn(heroStyles.heading, 'select-none')}
                            style={{ color: STATIC_UI_COLORS.heroTitle, fontFamily: 'var(--hp-font-heading)' }}
                        >
                            {hero.title}
                        </h1>
                        <p
                            className={cn(heroStyles.paragraph, 'select-none')}
                            style={{ color: STATIC_UI_COLORS.heroText, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {heroParagraph}
                        </p>
                    </div>

                    <div className={cn(heroStyles.filtersWrap, 'pointer-events-auto select-auto')}>
                        <HeroFilters
                            page={page}
                            tourLocations={tourLocations}
                            listingType={listingType}
                        />
                    </div>
                </div>
            </main>
        </HeroBackgroundSlider>
    )
}

export default Hero

'use client'

import React from 'react'
import { STATIC_UI_COLORS } from '@/data/homepage'
import HeroFilters from '@/components/pages/marketing/home/HeroFilters'
import { PageHeroBanner } from '@/components/ui/page-hero-banner'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { useHeroBackgroundImage } from '@/hooks/useHeroBackgroundImage'

type HeroProps = HomepagePageProps & {
    tourLocations?: string[]
}

const Hero = ({ page, tourLocations = [] }: HeroProps) => {
    const { hero } = page.sections
    const backgroundImage = useHeroBackgroundImage(hero.backgroundImage)

    return (
        <PageHeroBanner backgroundImage={backgroundImage}>
            <main className='pb-8 pt-[150px] sm:pb-10 sm:pt-40 md:pb-12 md:pt-48 lg:pb-16 lg:pt-56 xl:pb-[100px] xl:pt-[257px]'>
                    <div className='agency-container'>
                        <div className='w-full max-w-[828px] mx-auto text-center'>
                            <h1
                                className='text-[26px] font-semibold leading-[1.1] sm:text-3xl sm:leading-[0.95] md:text-4xl lg:text-5xl xl:text-[45px]'
                                style={{ color: STATIC_UI_COLORS.heroTitle, fontFamily: 'var(--hp-font-heading)' }}
                            >
                                {hero.title}
                            </h1>
                            <p
                                className='pt-3 text-sm font-normal sm:pt-4 sm:text-base xl:text-lg'
                                style={{ color: STATIC_UI_COLORS.heroText, fontFamily: 'var(--hp-font-body)' }}
                            >
                                {hero.paragraph}
                            </p>
                        </div>

                        <div className='mx-auto w-full max-w-[867px] pt-6 sm:pt-8 md:pt-10 lg:pt-12 xl:pt-14'>
                            <HeroFilters page={page} tourLocations={tourLocations} />
                        </div>
                    </div>
            </main>
        </PageHeroBanner>
    )
}

export default Hero

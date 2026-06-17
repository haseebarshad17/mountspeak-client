'use client'

import React from 'react'
import HeroFilters from '@/components/pages/marketing/home/HeroFilters'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'

type HeroProps = HomepagePageProps & {
    tourLocations?: string[]
}

const Hero = ({ page, tourLocations = [] }: HeroProps) => {
    const { hero } = page.sections
    const { colors } = page.theme

    return (
        <section className='p-2 sm:p-3 md:p-4 lg:p-5 xl:p-[30px]'>
            <div
                className='rounded-[16px] bg-cover bg-center bg-no-repeat'
                style={{ backgroundImage: `url("${hero.backgroundImage}")` }}
            >
                <main className='pb-8 pt-[150px] sm:pb-10 sm:pt-40 md:pb-12 md:pt-48 lg:pb-16 lg:pt-56 xl:pb-[100px] xl:pt-[257px]'>
                    <div className='agency-container'>
                        <div className='w-full max-w-[828px] mx-auto text-center'>
                            <h1
                                className='text-3xl font-semibold leading-[0.95] sm:text-4xl md:text-5xl xl:text-[45px]'
                                style={{ color: colors.heroTitle, fontFamily: 'var(--hp-font-heading)' }}
                            >
                                {hero.title}
                            </h1>
                            <p
                                className='pt-3 text-sm font-normal sm:pt-4 sm:text-base xl:text-lg'
                                style={{ color: colors.heroText, fontFamily: 'var(--hp-font-body)' }}
                            >
                                {hero.paragraph}
                            </p>
                        </div>

                        <div className='mx-auto w-full max-w-[867px] pt-10 sm:pt-14 md:pt-20 lg:pt-24 xl:pt-[180px]'>
                            <HeroFilters page={page} tourLocations={tourLocations} />
                        </div>
                    </div>
                </main>
            </div>
        </section>
    )
}

export default Hero

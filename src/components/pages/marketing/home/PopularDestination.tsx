'use client'

import { FilterPills } from '@/components/pages/marketing/home/filter-pills'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import React from 'react'

export type PopularDestinationProps = HomepagePageProps & {
    activeLabel: string
    onLabelChange: (label: string) => void
}

const PopularDestination = ({ page, activeLabel, onLabelChange }: PopularDestinationProps) => {
    const section = page.sections.popularDestination
    const { colors } = page.theme

    return (
        <section
            className='overflow-hidden bg-white pb-8 sm:pb-10 lg:pb-12'
            aria-labelledby='popular-destination-heading'
        >
            <div className='agency-container'>
                <header className='mx-auto max-w-3xl text-center'>
                    <SectionEyebrow name={section.eyebrow} color={colors.eyebrow} />
                    <h2
                        id='popular-destination-heading'
                        className='agency-section-heading pt-3 text-[40px] font-medium leading-[48px] sm:pt-4'
                        style={{ color: colors.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                </header>

                <FilterPills
                    labels={section.filters}
                    activeLabel={activeLabel}
                    onLabelChange={onLabelChange}
                    className='mx-auto max-w-[1300px] pt-8 sm:pt-10 lg:pt-12'
                />
            </div>
        </section>
    )
}

export default PopularDestination

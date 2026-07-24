'use client'

import { STATIC_UI_COLORS } from '@/data/homepage'
import { FilterPills } from '@/components/pages/marketing/home/filter-pills'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { useTemplateStyles } from '@/components/providers/TemplateStylesProvider'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { cn } from '@/lib/utils/clsxUtils'
import React from 'react'

export type PopularDestinationProps = HomepagePageProps & {
    activeLabel: string
    onLabelChange: (label: string) => void
}

const PopularDestination = ({ page, activeLabel, onLabelChange }: PopularDestinationProps) => {
    const section = page.sections.popularDestination
    const popularDestination = useTemplateStyles().pages.home.popularDestination
    const sectionHeader = useTemplateStyles().pages.home.sectionHeader

    return (
        <section
            className='overflow-hidden bg-white'
            aria-labelledby='popular-destination-heading'
        >
            <div className='agency-container'>
                <header className={cn(popularDestination.header)}>
                    <SectionEyebrow name={section.eyebrow} className={sectionHeader.eyebrow} />
                    <h2
                        id='popular-destination-heading'
                        className={cn(
                            sectionHeader.title,
                            'pt-3 text-[40px] font-medium leading-[48px] sm:pt-4',
                        )}
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                </header>

                <FilterPills
                    labels={section.filters}
                    activeLabel={activeLabel}
                    onLabelChange={onLabelChange}
                    className='mx-auto max-w-[1300px] pt-8 sm:pt-10 lg:pt-12 md:mx-0'
                />
            </div>
        </section>
    )
}

export default PopularDestination

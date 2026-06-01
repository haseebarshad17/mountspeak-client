import { FilterPills } from '@/components/pages/marketing/home/filter-pills'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { popularDestinationFilters } from '@/data/popular-destinations'
import React from 'react'

export type PopularDestinationProps = {
    activeLabel: string
    onLabelChange: (label: string) => void
}

const PopularDestination = ({ activeLabel, onLabelChange }: PopularDestinationProps) => {
    return (
        <section
            className='bg-white pb-8 sm:pb-10 lg:pb-12'
            aria-labelledby='popular-destination-heading'
        >
            <div className='agency-container'>
                <header className='mx-auto max-w-3xl text-center'>
                    <SectionEyebrow name='Destination' />
                    <h2
                        id='popular-destination-heading'
                        className='agency-section-heading pt-3 text-[40px] font-medium leading-[48px] text-[#14141F] sm:pt-4'
                    >
                        Popular Destination
                    </h2>
                </header>

                <FilterPills
                    labels={popularDestinationFilters}
                    activeLabel={activeLabel}
                    onLabelChange={onLabelChange}
                    className='mx-auto max-w-[1300px] pt-8 sm:pt-10 lg:pt-12'
                />
            </div>
        </section>
    )
}

export default PopularDestination

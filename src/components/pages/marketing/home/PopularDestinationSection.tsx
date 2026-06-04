'use client'

import { useMemo, useState } from 'react'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { getPopularDestinationFilters } from '@/data/popular-destinations'
import PopularDestination from './PopularDestination'
import TopDestinations from './TopDestinations'

const PopularDestinationSection = ({ page }: HomepagePageProps) => {
    const popularDestinationFilters = getPopularDestinationFilters(page)
    const [activeFilter, setActiveFilter] = useState<string>('All')

    const filterKey = useMemo(
        () => popularDestinationFilters.find((f) => f === activeFilter) ?? 'All',
        [activeFilter, popularDestinationFilters],
    )

    return (
        <>
            <PopularDestination
                page={page}
                activeLabel={filterKey}
                onLabelChange={setActiveFilter}
            />
            <TopDestinations page={page} activeFilter={filterKey} />
        </>
    )
}

export default PopularDestinationSection

'use client'

import { useMemo, useState } from 'react'
import { popularDestinationFilters } from '@/data/popular-destinations'
import PopularDestination from './PopularDestination'
import TopDestinations from './TopDestinations'

const PopularDestinationSection = () => {
    const [activeFilter, setActiveFilter] = useState<string>('All')

    const filterKey = useMemo(
        () => popularDestinationFilters.find((f) => f === activeFilter) ?? 'All',
        [activeFilter],
    )

    return (
        <>
            <PopularDestination
                activeLabel={filterKey}
                onLabelChange={setActiveFilter}
            />
            <TopDestinations activeFilter={filterKey} />
        </>
    )
}

export default PopularDestinationSection

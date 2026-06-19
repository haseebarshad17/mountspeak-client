'use client'

import type { HomepagePage } from '@/data/homepage'
import HeroStandardFilters, {
    type HeroFiltersValues,
} from '@/components/pages/marketing/home/HeroStandardFilters'
import HeroUmrahFilters from '@/components/pages/marketing/home/HeroUmrahFilters'
import { usesHajjUmrahBanner } from '@/lib/homepage/specialization'
import type { UmrahSearchFilters } from '@/services/tours/tours.umrah-search.utils'
import {
    selectHomepagePage,
    selectHomepageSpecializationId,
    selectHomepageSpecializations,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

export type { HeroFiltersValues }

type HeroFiltersProps = {
    page?: HomepagePage
    initialValues?: HeroFiltersValues
    umrahInitialValues?: UmrahSearchFilters
    tourLocations?: string[]
}

export default function HeroFilters({
    page: pageProp,
    initialValues,
    umrahInitialValues,
    tourLocations = [],
}: HeroFiltersProps) {
    const pageFromStore = useAppSelector(selectHomepagePage)
    const specializationId = useAppSelector(selectHomepageSpecializationId)
    const specializations = useAppSelector(selectHomepageSpecializations)
    const page = pageProp ?? pageFromStore

    if (usesHajjUmrahBanner(specializationId, specializations)) {
        return <HeroUmrahFilters initialValues={umrahInitialValues} />
    }

    return (
        <HeroStandardFilters
            page={page}
            initialValues={initialValues}
            tourLocations={tourLocations}
        />
    )
}

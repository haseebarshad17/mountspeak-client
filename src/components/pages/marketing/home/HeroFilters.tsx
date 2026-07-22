'use client'

import type { HomepagePage } from '@/data/homepage'
import HeroStandardFilters, {
    type HeroFiltersValues,
} from '@/components/pages/marketing/home/HeroStandardFilters'
import HeroUmrahFilters from '@/components/pages/marketing/home/HeroUmrahFilters'
import HeroListingTypeTabs from '@/components/pages/marketing/home/HeroListingTypeTabs'
import {
    isMultiSpecializationAgency,
    resolveOwnedListingKinds,
    shouldUseSingleSpecInternationalUx,
    shouldUseSingleSpecUmrahUx,
    type ListingKind,
} from '@/lib/homepage/specialization'
import type { UmrahSearchFilters } from '@/services/tours/tours.umrah-search.utils'
import {
    selectHomepageAgencySpecializationIds,
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
    listingType?: ListingKind
}

export default function HeroFilters({
    page: pageProp,
    initialValues,
    umrahInitialValues,
    tourLocations = [],
    listingType = 'tour',
}: HeroFiltersProps) {
    const pageFromStore = useAppSelector(selectHomepagePage)
    const specializationId = useAppSelector(selectHomepageSpecializationId)
    const agencySpecializationIds = useAppSelector(selectHomepageAgencySpecializationIds)
    const specializations = useAppSelector(selectHomepageSpecializations)
    const page = pageProp ?? pageFromStore
    const ownedKinds = resolveOwnedListingKinds(
        specializationId,
        agencySpecializationIds,
        specializations,
    )
    const isMultiSpec = isMultiSpecializationAgency(specializationId, agencySpecializationIds)
    const isUmrahFilters = isMultiSpec
        ? listingType === 'umrah'
        : shouldUseSingleSpecUmrahUx(specializationId, agencySpecializationIds, specializations)
    const isInternationalFilters = isMultiSpec
        ? listingType === 'international'
        : shouldUseSingleSpecInternationalUx(
              specializationId,
              agencySpecializationIds,
              specializations,
          )

    if (isUmrahFilters) {
        return (
            <>
                <HeroListingTypeTabs activeType={listingType} ownedKinds={ownedKinds} />
                <HeroUmrahFilters initialValues={umrahInitialValues} listingType='umrah' />
            </>
        )
    }

    return (
        <>
            <HeroListingTypeTabs activeType={listingType} ownedKinds={ownedKinds} />
            <HeroStandardFilters
                page={page}
                initialValues={initialValues}
                tourLocations={tourLocations}
                locationKind={isInternationalFilters ? 'country' : 'city'}
                listingType={isInternationalFilters ? 'international' : 'tour'}
            />
        </>
    )
}

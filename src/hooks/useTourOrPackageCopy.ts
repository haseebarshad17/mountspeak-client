import { useMemo } from 'react'

import { resolveSiteListingCopy } from '@/lib/homepage/specialization'
import {
    selectHomepageAgencySpecializationIds,
    selectHomepageSpecializationId,
    selectHomepageSpecializations,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

export function useSiteListingCopy() {
    const specializationId = useAppSelector(selectHomepageSpecializationId)
    const agencySpecializationIds = useAppSelector(selectHomepageAgencySpecializationIds)
    const specializations = useAppSelector(selectHomepageSpecializations)

    return useMemo(
        () =>
            resolveSiteListingCopy(
                specializationId,
                agencySpecializationIds,
                specializations,
            ),
        [agencySpecializationIds, specializationId, specializations],
    )
}

/** @deprecated Prefer useSiteListingCopy */
export function useTourOrPackageCopy() {
    const siteCopy = useSiteListingCopy()

    return {
        isUmrahSite: siteCopy.isUmrahSite,
        isMultiSpec: siteCopy.isMultiSpec,
        isInternationalSite: siteCopy.isInternationalSite,
        copy: siteCopy.copy,
        savedListingsLabel: siteCopy.savedListingsLabel,
        savedPage: siteCopy.savedPage,
        ownedKinds: siteCopy.ownedKinds,
        copyMode: siteCopy.mode,
    }
}

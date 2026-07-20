import umraBannerBg from '@/assests/umra-banner-bg.jpg'

import { shouldUseSingleSpecUmrahUx } from '@/lib/homepage/specialization'
import type { Specialization } from '@/services/specializations/specializations.types'

export const DEFAULT_HERO_BANNER_IMAGE = '/images/pages/home/tour-list.png'
export const UMRAH_HERO_BANNER_IMAGE = umraBannerBg.src

export function resolveHeroBackgroundImage(options: {
    specializationId: string | null | undefined
    agencySpecializationIds?: readonly string[] | null
    specializations: readonly Specialization[]
    defaultBackgroundImage: string
}): string {
    if (
        shouldUseSingleSpecUmrahUx(
            options.specializationId,
            options.agencySpecializationIds,
            options.specializations,
        )
    ) {
        return UMRAH_HERO_BANNER_IMAGE
    }

    return options.defaultBackgroundImage || DEFAULT_HERO_BANNER_IMAGE
}

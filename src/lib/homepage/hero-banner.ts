import umraBannerBg from '@/assests/umra-banner-bg.jpg'

import {
    DEFAULT_HERO_BANNER_IMAGE,
    resolveHeroSliderImages,
    type HeroBackgroundFields,
} from '@/lib/homepage/hero-backgrounds'
import { shouldUseSingleSpecUmrahUx } from '@/lib/homepage/specialization'
import type { Specialization } from '@/services/specializations/specializations.types'

export { DEFAULT_HERO_BANNER_IMAGE } from '@/lib/homepage/hero-backgrounds'

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

export function resolveHeroBackgroundSlides(options: {
    specializationId: string | null | undefined
    agencySpecializationIds?: readonly string[] | null
    specializations: readonly Specialization[]
    hero: HeroBackgroundFields
}): string[] {
    const isUmrah = shouldUseSingleSpecUmrahUx(
        options.specializationId,
        options.agencySpecializationIds,
        options.specializations,
    )

    return resolveHeroSliderImages(options.hero, {
        forceSingle: isUmrah ? UMRAH_HERO_BANNER_IMAGE : null,
    })
}

import umraBannerBg from '@/assests/umra-banner-bg.jpg'

import { usesHajjUmrahBanner } from '@/lib/homepage/specialization'
import type { Specialization } from '@/services/specializations/specializations.types'

export const DEFAULT_HERO_BANNER_IMAGE = '/images/pages/home/tour-list.png'
export const UMRAH_HERO_BANNER_IMAGE = umraBannerBg.src

export function resolveHeroBackgroundImage(options: {
    specializationId: string | null | undefined
    specializations: readonly Specialization[]
    defaultBackgroundImage: string
}): string {
    if (usesHajjUmrahBanner(options.specializationId, options.specializations)) {
        return UMRAH_HERO_BANNER_IMAGE
    }

    return options.defaultBackgroundImage || DEFAULT_HERO_BANNER_IMAGE
}

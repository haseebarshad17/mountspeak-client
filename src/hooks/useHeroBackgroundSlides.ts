'use client'

import { useMemo } from 'react'

import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import { resolveHeroBackgroundSlides } from '@/lib/homepage/hero-banner'
import type { HeroBackgroundFields } from '@/lib/homepage/hero-backgrounds'
import {
    selectHomepageAgencySpecializationIds,
    selectHomepageSpecializationId,
    selectHomepageSpecializations,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

export function useHeroBackgroundSlides(hero?: HeroBackgroundFields | null) {
    const page = useHomepagePageWithFallback()
    const specializationId = useAppSelector(selectHomepageSpecializationId)
    const agencySpecializationIds = useAppSelector(selectHomepageAgencySpecializationIds)
    const specializations = useAppSelector(selectHomepageSpecializations)

    const backgroundImage = hero?.backgroundImage ?? page?.sections.hero.backgroundImage
    const backgroundImages = hero?.backgroundImages ?? page?.sections.hero.backgroundImages

    return useMemo(
        () =>
            resolveHeroBackgroundSlides({
                specializationId,
                agencySpecializationIds,
                specializations,
                hero: { backgroundImage, backgroundImages },
            }),
        [
            agencySpecializationIds,
            backgroundImage,
            backgroundImages,
            specializationId,
            specializations,
        ],
    )
}

'use client'

import { useMemo } from 'react'

import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import { DEFAULT_HERO_BANNER_IMAGE, resolveHeroBackgroundImage } from '@/lib/homepage/hero-banner'
import {
    selectHomepageSpecializationId,
    selectHomepageSpecializations,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

export function useHeroBackgroundImage(defaultBackgroundImage?: string | null) {
    const page = useHomepagePageWithFallback()
    const specializationId = useAppSelector(selectHomepageSpecializationId)
    const specializations = useAppSelector(selectHomepageSpecializations)

    const resolvedDefault =
        defaultBackgroundImage ??
        page?.sections.hero.backgroundImage ??
        DEFAULT_HERO_BANNER_IMAGE

    return useMemo(
        () =>
            resolveHeroBackgroundImage({
                specializationId,
                specializations,
                defaultBackgroundImage: resolvedDefault,
            }),
        [resolvedDefault, specializationId, specializations],
    )
}

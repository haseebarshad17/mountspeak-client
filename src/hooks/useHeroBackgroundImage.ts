'use client'

import { useMemo } from 'react'

import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import { useStorageBackgroundImage } from '@/hooks/useStorageBackgroundImage'
import { DEFAULT_HERO_BANNER_IMAGE, resolveHeroBackgroundImage } from '@/lib/homepage/hero-banner'
import {
    selectHomepageAgencySpecializationIds,
    selectHomepageSpecializationId,
    selectHomepageSpecializations,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

export function useHeroBackgroundImage(defaultBackgroundImage?: string | null) {
    const page = useHomepagePageWithFallback()
    const specializationId = useAppSelector(selectHomepageSpecializationId)
    const agencySpecializationIds = useAppSelector(selectHomepageAgencySpecializationIds)
    const specializations = useAppSelector(selectHomepageSpecializations)

    const resolvedDefault =
        defaultBackgroundImage ??
        page?.sections.hero.backgroundImage ??
        DEFAULT_HERO_BANNER_IMAGE

    const resolved = useMemo(
        () =>
            resolveHeroBackgroundImage({
                specializationId,
                agencySpecializationIds,
                specializations,
                defaultBackgroundImage: resolvedDefault,
            }),
        [agencySpecializationIds, resolvedDefault, specializationId, specializations],
    )

    return useStorageBackgroundImage(resolved, DEFAULT_HERO_BANNER_IMAGE)
}

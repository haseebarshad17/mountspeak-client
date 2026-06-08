'use client'

import { selectIsAgencySite } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

/** null while homepage context is still loading */
export function useIsAgencySite(): boolean | null {
    return useAppSelector(selectIsAgencySite)
}

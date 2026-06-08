'use client'

import type { HomepagePage } from '@/data/homepage'
import { DUMMY_HOMEPAGE_PAGE } from '@/lib/homepage/default-homepage'
import { selectHomepageIsLoading, selectHomepagePage } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

export function useHomepagePageWithFallback(): HomepagePage | null {
    const page = useAppSelector(selectHomepagePage)
    const isLoading = useAppSelector(selectHomepageIsLoading)

    return page ?? (!isLoading ? DUMMY_HOMEPAGE_PAGE : null)
}

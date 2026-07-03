'use client'

import Footer from '@/components/layout/marketing/footer/footer'
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'

export default function MarketingFooter() {
    const page = useHomepagePageWithFallback()

    if (!page) return null

    return <Footer page={page} />
}

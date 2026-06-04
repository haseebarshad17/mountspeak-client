'use client'

import Footer from '@/components/layout/marketing/footer/footer'
import { selectHomepagePage } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

export default function MarketingFooter() {
    const page = useAppSelector(selectHomepagePage)

    if (!page) return null

    return <Footer footer={page.footer} />
}

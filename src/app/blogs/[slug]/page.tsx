import type { Metadata } from 'next'

import BlogDetailPage from '@/components/pages/blog/BlogDetailPage'
import { buildPageMetadata } from '@/lib/homepage/build-page-metadata'
import { fetchAgencyHomepage } from '@/services/homepage/homepage.server'
import { getStaticBlogDetailPage } from '@/services/blog/blog.utils'

type BlogDetailRouteProps = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(): Promise<Metadata> {
    const homepage = await fetchAgencyHomepage()
    const page = getStaticBlogDetailPage()

    const base = buildPageMetadata({
        pageTitle: page.seo.metaTitle,
        description: page.seo.metaDescription,
        homepage,
    })

    if (!page.seo.ogImage) {
        return base
    }

    return {
        ...base,
        openGraph: {
            ...base.openGraph,
            images: [{ url: page.seo.ogImage }],
        },
    }
}

export default async function BlogDetailRoutePage({ params }: BlogDetailRouteProps) {
    void params
    const page = getStaticBlogDetailPage()

    return <BlogDetailPage page={page} />
}

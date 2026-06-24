import blogContent from '@/components/pages/blog/blog-content.json'
import type { BlogDetailPageContent } from '@/components/pages/blog/blog.types'

export const BLOG_DETAIL_STATIC_SLUG = 'detail'

export function blogDetailPath(slug: string = BLOG_DETAIL_STATIC_SLUG): string {
    return `/blogs/${slug}`
}

export function resolveBlogPostHref(href: string | null | undefined): string {
    const trimmed = href?.trim()
    if (!trimmed || trimmed === '#') {
        return blogDetailPath()
    }

    return trimmed
}

export function getStaticBlogDetailPage(): BlogDetailPageContent['page'] {
    return (blogContent as BlogDetailPageContent).page
}

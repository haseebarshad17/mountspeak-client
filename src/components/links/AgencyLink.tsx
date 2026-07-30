'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { forwardRef, type ComponentProps, Suspense } from 'react'
import { isAgencyHostSegment, normalizeAgencyHost } from '@/lib/host/site-url'

type AgencyLinkProps = ComponentProps<typeof Link>

function withHostQuery(href: AgencyLinkProps['href'], host: string | null): AgencyLinkProps['href'] {
    if (!host || !isAgencyHostSegment(host)) return href
    if (typeof href !== 'string') return href

    if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#')
    ) {
        return href
    }

    const agencyHost = normalizeAgencyHost(host)
    const [pathAndHash, existingQuery = ''] = href.split('?')
    const [pathname, hash = ''] = pathAndHash.split('#')
    const params = new URLSearchParams(existingQuery)
    if (!params.has('host')) params.set('host', agencyHost)
    const query = params.toString()
    const hashPart = hash ? `#${hash}` : ''
    return query ? `${pathname}?${query}${hashPart}` : `${pathname}${hashPart}`
}

const AgencyLinkInner = forwardRef<HTMLAnchorElement, AgencyLinkProps>(
    function AgencyLinkInner({ href, ...props }, ref) {
        const searchParams = useSearchParams()
        const host = searchParams.get('host')
        return <Link ref={ref} href={withHostQuery(href, host)} {...props} />
    }
)

/** Next Link that keeps `?host=` during local agency preview navigation. */
export const AgencyLink = forwardRef<HTMLAnchorElement, AgencyLinkProps>(
    function AgencyLink(props, ref) {
        return (
            <Suspense fallback={<Link ref={ref} {...props} />}>
                <AgencyLinkInner ref={ref} {...props} />
            </Suspense>
        )
    }
)

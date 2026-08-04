'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { forwardRef, type ComponentProps, Suspense } from 'react'
import { isAgencyHostSegment, normalizeAgencyHost } from '@/lib/host/site-url'
import {
    TEMPLATE_ID_QUERY_PARAM,
    withAgencyPreviewQuery,
} from '@/lib/templates/preview-template'

type AgencyLinkProps = ComponentProps<typeof Link>

const AgencyLinkInner = forwardRef<HTMLAnchorElement, AgencyLinkProps>(
    function AgencyLinkInner({ href, ...props }, ref) {
        const searchParams = useSearchParams()
        const hostParam = searchParams.get('host')
        const host =
            hostParam && isAgencyHostSegment(hostParam)
                ? normalizeAgencyHost(hostParam)
                : null
        const templateId = searchParams.get(TEMPLATE_ID_QUERY_PARAM)

        const nextHref =
            typeof href === 'string'
                ? withAgencyPreviewQuery(href, { host, templateId })
                : href

        return <Link ref={ref} href={nextHref} {...props} />
    }
)

/** Next Link that keeps `?host=` and `?templateId=` during preview navigation. */
export const AgencyLink = forwardRef<HTMLAnchorElement, AgencyLinkProps>(
    function AgencyLink(props, ref) {
        return (
            <Suspense fallback={<Link ref={ref} {...props} />}>
                <AgencyLinkInner ref={ref} {...props} />
            </Suspense>
        )
    }
)

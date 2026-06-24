'use client'

import Link from 'next/link'
import type { ComponentProps, MouseEvent } from 'react'

import { isBookingRoute } from '@/lib/homepage/agency-preview'
import {
    useInternalPathname,
    usePrefixedHref,
    usePreviewRouter,
} from '@/hooks/useAgencyPreviewBase'

type PrefixedLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
    href: string
}

function shouldHandleNavigation(event: MouseEvent<HTMLAnchorElement>): boolean {
    return !(
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
    )
}

export function PrefixedLink({ href, onClick, ...props }: PrefixedLinkProps) {
    const internalPathname = useInternalPathname()
    const resolvedHref = usePrefixedHref(href) ?? href
    const router = usePreviewRouter()

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event)
        if (!shouldHandleNavigation(event)) return

        event.preventDefault()

        if (isBookingRoute(internalPathname)) {
            window.location.assign(resolvedHref)
            return
        }

        router.push(href)
    }

    return <Link href={resolvedHref} onClick={handleClick} {...props} />
}

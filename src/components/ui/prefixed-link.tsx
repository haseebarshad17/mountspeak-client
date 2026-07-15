'use client'

import Link from 'next/link'
import type { ComponentProps, MouseEvent } from 'react'

import { isBookingRoute, stripAgencyPreviewBase } from '@/lib/homepage/agency-preview'
import { useInternalPathname, usePrefixedHref } from '@/hooks/useAgencyPreviewBase'

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

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event)
        if (!shouldHandleNavigation(event)) return

        const targetPath = stripAgencyPreviewBase(resolvedHref.split('?')[0] ?? '')

        if (isBookingRoute(internalPathname) || isBookingRoute(targetPath)) {
            event.preventDefault()
            window.location.assign(resolvedHref)
        }
    }

    return <Link href={resolvedHref} onClick={handleClick} {...props} />
}

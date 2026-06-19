'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'

import { usePrefixedHref } from '@/hooks/useAgencyPreviewBase'

type PrefixedLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
    href: string
}

export function PrefixedLink({ href, ...props }: PrefixedLinkProps) {
    const resolvedHref = usePrefixedHref(href) ?? href

    return <Link href={resolvedHref} {...props} />
}

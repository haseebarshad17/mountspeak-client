'use client'

import Link from 'next/link'

import { useTemplateStyles } from '@/components/providers/TemplateStylesProvider'
import { usePrefixedHref } from '@/hooks/useAgencyPreviewBase'
import type { ListingKind } from '@/lib/homepage/specialization'
import { cn } from '@/lib/utils/clsxUtils'

const LISTING_LABELS: Record<ListingKind, string> = {
    tour: 'Tours',
    umrah: 'Umrah',
    international: 'International',
}

type HeroListingTypeTabsProps = {
    activeType: ListingKind
    ownedKinds: ListingKind[]
    variant?: 'hero' | 'section'
}

export default function HeroListingTypeTabs({
    activeType,
    ownedKinds,
    variant = 'hero',
}: HeroListingTypeTabsProps) {
    const templateStyles = useTemplateStyles()

    if (ownedKinds.length <= 1) {
        return null
    }

    return (
        <div
            className={cn(
                variant === 'hero'
                    ? templateStyles.pages.home.hero.tabsWrap
                    : 'mx-auto mb-4 flex flex-wrap items-center justify-center gap-2',
            )}
        >
            {ownedKinds.map((kind) => (
                <HeroListingTypeTabLink
                    key={kind}
                    kind={kind}
                    isActive={kind === activeType}
                    variant={variant}
                />
            ))}
        </div>
    )
}

function HeroListingTypeTabLink({
    kind,
    isActive,
    variant,
}: {
    kind: ListingKind
    isActive: boolean
    variant: 'hero' | 'section'
}) {
    const href = usePrefixedHref(`/search?type=${kind}`) ?? `/search?type=${kind}`

    return (
        <Link
            href={href}
            className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition',
                variant === 'hero'
                    ? isActive
                        ? 'bg-white text-[#00292C] shadow-sm'
                        : 'bg-white/15 text-white hover:bg-white/25'
                    : isActive
                      ? 'bg-[#064045] text-white shadow-sm'
                      : 'border border-[#D6D9DC] bg-white text-[#404849] hover:border-[#064045]/40',
            )}
        >
            {LISTING_LABELS[kind]}
        </Link>
    )
}

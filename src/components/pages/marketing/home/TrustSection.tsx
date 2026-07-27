'use client'

import { useCallback, useMemo, useRef, useState, type CSSProperties } from 'react'

import { STATIC_UI_COLORS } from '@/data/homepage'
import type { TrustBrand } from '@/services/homepage/homepage.page.types'

import { StorageMediaImage } from '@/components/ui/storage-media-image'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { useMarqueeShift } from '@/hooks/useMarqueeShift'
import { useMobileViewport } from '@/hooks/useMobileViewport'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useTemplateStyles } from '@/components/providers/TemplateStylesProvider'
import { resolveBrandingLogoUrlOrPlaceholder } from '@/lib/supabase/homepage-media'
import { cn } from '@/lib/utils/clsxUtils'

const DESKTOP_STATIC_BRAND_LIMIT = 4
const MOBILE_STATIC_BRAND_LIMIT = 2

function TrustBrandLogo({
    brand,
    decorative = false,
    onMediaLoad,
}: {
    brand: TrustBrand
    decorative?: boolean
    onMediaLoad?: () => void
}) {
    return (
        <figure
            className='trust-brand-logo flex h-auto w-[70px] shrink-0 items-center justify-center sm:w-[100px]'
            aria-hidden={decorative || undefined}
        >
            <StorageMediaImage
                src={resolveBrandingLogoUrlOrPlaceholder(brand.src)}
                alt={decorative ? '' : (brand.alt ?? brand.name)}
                width={156}
                height={56}
                unoptimized
                onLoad={onMediaLoad}
                onError={onMediaLoad}
                className='h-max w-full object-contain opacity-55 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0'
            />
        </figure>
    )
}

function TrustBrandsCopy({
    brands,
    copyIndex,
    decorative = false,
    onMediaLoad,
}: {
    brands: readonly TrustBrand[]
    copyIndex: number
    decorative?: boolean
    onMediaLoad?: () => void
}) {
    return (
        <>
            {brands.map((brand) => (
                <TrustBrandLogo
                    key={`${brand.id}-copy-${copyIndex}`}
                    brand={brand}
                    decorative={decorative}
                    onMediaLoad={onMediaLoad}
                />
            ))}
        </>
    )
}

function TrustBrandsStaticRow({
    brands,
    onMediaLoad,
    rowClassName,
}: {
    brands: readonly TrustBrand[]
    onMediaLoad?: () => void
    rowClassName: string
}) {
    return (
        <div className={cn(rowClassName)}>
            {brands.map((brand) => (
                <TrustBrandLogo key={brand.id} brand={brand} onMediaLoad={onMediaLoad} />
            ))}
        </div>
    )
}

function TrustBrandsInfiniteMarquee({ brands }: { brands: readonly TrustBrand[] }) {
    const trackRef = useRef<HTMLDivElement>(null)
    const copyRef = useRef<HTMLDivElement>(null)
    const [remeasureToken, setRemeasureToken] = useState(0)
    const remeasureTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const { shift, duration, copyCount } = useMarqueeShift(copyRef, trackRef, remeasureToken)

    const bumpRemeasure = useCallback(() => {
        if (remeasureTimeoutRef.current) {
            clearTimeout(remeasureTimeoutRef.current)
        }

        remeasureTimeoutRef.current = setTimeout(() => {
            setRemeasureToken((current) => current + 1)
        }, 150)
    }, [])

    const copyIndexes = useMemo(
        () => Array.from({ length: copyCount }, (_, index) => index),
        [copyCount],
    )

    const trackStyle = {
        '--marquee-shift': `${shift}px`,
        '--marquee-duration': `${duration}s`,
    } as CSSProperties

    return (
        <div className='trust-brands-marquee mt-6 sm:mt-8'>
            <div
                ref={trackRef}
                className={cn(
                    'trust-brands-marquee-track py-1',
                    shift > 0 && 'trust-brands-marquee-track--active',
                )}
                style={trackStyle}
            >
                {copyIndexes.map((copyIndex) => (
                    <div
                        key={`trust-copy-${copyIndex}`}
                        ref={copyIndex === 0 ? copyRef : undefined}
                        className='trust-brands-marquee-copy'
                        aria-hidden={copyIndex > 0 || undefined}
                    >
                        <TrustBrandsCopy
                            brands={brands}
                            copyIndex={copyIndex}
                            decorative={copyIndex > 0}
                            onMediaLoad={copyIndex === 0 ? bumpRemeasure : undefined}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

const TrustSection = ({ page }: HomepagePageProps) => {
    const section = page.sections.trust
    const brands = section.brands ?? []
    const trust = useTemplateStyles().pages.home.trust
    const sectionHeader = useTemplateStyles().pages.home.sectionHeader
    const isMobile = useMobileViewport()
    const prefersReducedMotion = usePrefersReducedMotion()
    const staticBrandLimit = isMobile ? MOBILE_STATIC_BRAND_LIMIT : DESKTOP_STATIC_BRAND_LIMIT
    const useStaticLayout = brands.length <= staticBrandLimit || prefersReducedMotion

    if (brands.length === 0) {
        return null
    }

    return (
        <section
            className={cn(trust.section)}
            aria-labelledby='trust-section-heading'
        >
            <div className='agency-container'>
                <header className={cn(trust.header)}>
                    <SectionEyebrow name={section.eyebrow} className={sectionHeader.eyebrow} />
                    <h2
                        id='trust-section-heading'
                        className={cn(trust.title)}
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                </header>
            </div>

            {useStaticLayout ? (
                <TrustBrandsStaticRow brands={brands} rowClassName={trust.row} />
            ) : (
                <TrustBrandsInfiniteMarquee brands={brands} />
            )}
        </section>
    )
}

export default TrustSection

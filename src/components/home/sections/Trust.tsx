'use client'

import { useMemo } from 'react'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { TrustSection } from '@/services/agency/agency.types'

const FALLBACK_LOGOS = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1530789256257-482a4c5d1b1e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=200&q=80',
]

export function Trust({ data }: { data: TrustSection }) {
    const variant = useTemplateVariant()

    const logos = useMemo(() => {
        const fromCms = (data.logos ?? [])
            .map((logo) => ({
                src: resolveThemeAssetUrl(logo.src) || logo.src,
                alt: logo.alt || 'Trusted partner',
            }))
            .filter((logo) => Boolean(logo.src))

        if (fromCms.length > 0) return fromCms

        return FALLBACK_LOGOS.map((src, i) => ({
            src,
            alt: `Trusted partner ${i + 1}`,
        }))
    }, [data.logos])

    if (variant !== 'temp1') return null
    if (logos.length === 0) return null

    const loop = [...logos, ...logos]

    return (
        <section className="section-spacing bg-white section-spacing-top">
            <div className="site-container text-center">
                <p className="text-brand text-sm font-medium uppercase">
                    {data.eyebrow}
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#111] md:text-3xl">
                    {data.title || 'Brands travelers know and trust'}
                </h2>
            </div>

            <div className="relative mt-10 overflow-hidden">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent md:w-24" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent md:w-24" />
                <div className="trust-marquee">
                    {loop.map((logo, i) => (
                        <div
                            key={`${logo.src}-${i}`}
                            className="flex h-14 w-28 shrink-0 items-center justify-center md:h-16 md:w-32"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={logo.src}
                                alt={logo.alt}
                                className="max-h-full max-w-full object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

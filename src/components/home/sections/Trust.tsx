'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { TrustSection } from '@/services/agency/agency.types'
import { cn } from '@/lib/utils/cn'

const FALLBACK_LOGOS = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=200&q=80',
]

const TEMP3_VISIBLE = 6
const TEMP3_STAGGER_MS = 40
const TEMP3_HOLD_MS = 6000
const TEMP3_SCALE_OUT_MS = 350
const TEMP3_SCALE_IN_MS = 350
const TEMP3_SCALE_OUT_TOTAL_MS =
    TEMP3_SCALE_OUT_MS + (TEMP3_VISIBLE - 1) * TEMP3_STAGGER_MS
const TEMP3_SCALE_IN_TOTAL_MS =
    TEMP3_SCALE_IN_MS + (TEMP3_VISIBLE - 1) * TEMP3_STAGGER_MS

function getTrustPage(
    logos: { src: string; alt: string }[],
    page: number,
    count: number
) {
    if (logos.length === 0) return []
    const start = (page * count) % logos.length
    return Array.from({ length: count }, (_, i) => {
        const logo = logos[(start + i) % logos.length]!
        return { ...logo, key: `${page}-${start + i}-${logo.src}` }
    })
}

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

    const pageCount = Math.max(1, Math.ceil(logos.length / TEMP3_VISIBLE))
    const [page, setPage] = useState(0)
    const [phase, setPhase] = useState<'in' | 'out'>('in')

    useEffect(() => {
        if (variant !== 'temp3' || pageCount <= 1) return

        const reduceMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (reduceMotion) return

        let timer: ReturnType<typeof setTimeout> | undefined
        let cancelled = false

        const wait = (ms: number) =>
            new Promise<void>((resolve) => {
                timer = setTimeout(resolve, ms)
            })

        const run = async () => {
            // Initial mount is already scaling in — wait for it to finish
            await wait(TEMP3_SCALE_IN_TOTAL_MS)
            if (cancelled) return

            while (!cancelled) {
                // Hold fully visible logos before swapping
                await wait(TEMP3_HOLD_MS)
                if (cancelled) return

                setPhase('out')
                await wait(TEMP3_SCALE_OUT_TOTAL_MS)
                if (cancelled) return

                setPage((p) => (p + 1) % pageCount)
                setPhase('in')
                await wait(TEMP3_SCALE_IN_TOTAL_MS)
                if (cancelled) return
            }
        }

        void run()

        return () => {
            cancelled = true
            if (timer) clearTimeout(timer)
        }
    }, [variant, pageCount])

    if (variant !== 'temp1' && variant !== 'temp3') return null
    if (logos.length === 0) return null

    const loop = [...logos, ...logos]

    /* ── Template 3: navy partner strip bridging hero → about ── */
    if (variant === 'temp3') {
        const visible = getTrustPage(logos, page, TEMP3_VISIBLE)

        return (
            <section className="t3-section-navy border-y border-t3-border/60 pt-8 pb-14 md:pt-10 md:pb-20 lg:pb-[72px]">
                <div className="t3-wrap overflow-hidden">
                    <div className="mb-6 flex items-center justify-center gap-3 md:mb-8">
                        <span className="h-px w-8 bg-t3-gold/40" aria-hidden />
                        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-t3-gold md:text-[11px]">
                            {data.eyebrow || 'Trusted partners'}
                        </p>
                        <span className="h-px w-8 bg-t3-gold/40" aria-hidden />
                    </div>

                    <div className="flex items-center justify-between gap-4 md:gap-8 lg:gap-10">
                        {visible.map((logo, i) => (
                            <div
                                key={logo.key}
                                className={cn(
                                    'flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-white/5 sm:h-14 sm:w-20 md:h-16 md:w-24',
                                    phase === 'in'
                                        ? 'trust-temp3-scale-in'
                                        : 'trust-temp3-scale-out'
                                )}
                                style={
                                    {
                                        '--trust-stagger': `${i * TEMP3_STAGGER_MS}ms`,
                                        '--trust-scale-in': `${TEMP3_SCALE_IN_MS}ms`,
                                        '--trust-scale-out': `${TEMP3_SCALE_OUT_MS}ms`,
                                    } as CSSProperties
                                }
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={logo.src}
                                    alt={logo.alt}
                                    className="h-full w-full object-cover opacity-90 transition duration-300 hover:opacity-100"
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    /* ── Template 1 (Classic) ── */
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

'use client'

import { useEffect, useRef, useState } from 'react'
import { AgencyLink } from '@/components/links/AgencyLink'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { PlanPerfectTripSection } from '@/services/agency/agency.types'
import { Award, Calendar, MapPin, Users } from 'lucide-react'

const STAT_ICONS = [MapPin, Users, Award, Calendar]

function parseStatValue(raw: string) {
    const match = raw.trim().match(/^([^\d]*)([\d,]+)(.*)$/)
    if (!match) {
        return {
            prefix: '',
            number: null as number | null,
            suffix: raw,
            hasComma: false,
        }
    }
    const number = Number(match[2].replace(/,/g, ''))
    if (!Number.isFinite(number)) {
        return {
            prefix: '',
            number: null as number | null,
            suffix: raw,
            hasComma: false,
        }
    }
    return {
        prefix: match[1],
        number,
        suffix: match[3],
        hasComma: match[2].includes(','),
    }
}

function AnimatedStatValue({
    value,
    className,
}: {
    value: string
    className?: string
}) {
    const ref = useRef<HTMLParagraphElement>(null)
    const [display, setDisplay] = useState(value)
    const started = useRef(false)
    const parsed = parseStatValue(value)

    useEffect(() => {
        if (parsed.number == null) {
            setDisplay(value)
            return
        }

        const el = ref.current
        if (!el) return

        const reduceMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (reduceMotion) {
            setDisplay(value)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting || started.current) return
                started.current = true

                const target = parsed.number!
                const duration = 1400
                const start = performance.now()

                const tick = (now: number) => {
                    const t = Math.min(1, (now - start) / duration)
                    const eased = 1 - Math.pow(1 - t, 3)
                    const current = Math.round(target * eased)
                    const formatted = parsed.hasComma
                        ? current.toLocaleString('en-US')
                        : String(current)
                    setDisplay(`${parsed.prefix}${formatted}${parsed.suffix}`)
                    if (t < 1) requestAnimationFrame(tick)
                    else setDisplay(value)
                }

                setDisplay(`${parsed.prefix}0${parsed.suffix}`)
                requestAnimationFrame(tick)
                observer.disconnect()
            },
            { threshold: 0.35 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [parsed.hasComma, parsed.number, parsed.prefix, parsed.suffix, value])

    return (
        <p ref={ref} className={className}>
            {display}
        </p>
    )
}

export function Intro({ data }: { data: PlanPerfectTripSection }) {
    const variant = useTemplateVariant()
    const stats = data.stats?.slice(0, 4) ?? []
    const image = resolveThemeAssetUrl(data.image?.src)

    if (variant === 'temp1') {
        return (
            <section className="section-spacing bg-white">
                <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <div
                        className="aspect-[4/5] overflow-hidden rounded-2xl bg-cover bg-center shadow-lg"
                        style={{
                            backgroundImage: image
                                ? `url(${image})`
                                : 'linear-gradient(135deg, var(--color-brand), color-mix(in srgb, var(--color-brand) 55%, #000))',
                        }}
                        role="img"
                        aria-label={data.image?.alt || data.title}
                    />

                    <div>
                        <p className="text-brand text-sm font-medium uppercase">
                            {data.eyebrow}
                        </p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#111] md:text-4xl">
                            {data.title}
                        </h2>
                        <p className="mt-4 text-[0.98rem] leading-relaxed text-[#333]/70">
                            {data.paragraph}
                        </p>

                        {stats.length > 0 ? (
                            <div className="mt-10 flex flex-wrap gap-4 sm:grid sm:grid-cols-2">
                                {stats.map((stat, i) => {
                                    const Icon = STAT_ICONS[i % STAT_ICONS.length]
                                    return (
                                        <div
                                            key={stat.label}
                                            className="flex min-w-[200px] flex-1 items-start gap-3 rounded-2xl border border-black/5 bg-white px-4 py-4 shadow-sm"
                                        >
                                            <div className="bg-brand-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-[#111]">
                                                    {stat.value}
                                                </p>
                                                <p className="mt-0.5 text-xs leading-snug text-[#666]">
                                                    {stat.label}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : null}
                    </div>
                </div>
            </section>
        )
    }

    /* ── Template 3: cream about band, ticket stats, tall aligned media ── */
    if (variant === 'temp3') {
        return (
            <section className="t3-section t3-section-cream">
                <div className="t3-wrap grid items-stretch gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
                    <div className="flex flex-col">
                        <p className="t3-eyebrow">{data.eyebrow}</p>
                        <h2 className="t3-title t3-title-on-cream text-left">
                            {data.title}
                        </h2>
                        <p className="t3-sub t3-sub-on-cream max-w-xl text-left">
                            {data.paragraph}
                        </p>

                        {stats.length > 0 ? (
                            <div className="mt-9 grid flex-1 grid-cols-2 content-start gap-3 sm:gap-4 md:mt-10">
                                {stats.map((stat, i) => (
                                    <div
                                        key={stat.label}
                                        className="rounded-[14px] border border-t3-navy/10 bg-white px-4 py-5 text-center shadow-[0_10px_30px_rgba(14,27,51,0.05)] sm:px-5 sm:py-6"
                                    >
                                        <p className="font-mono text-[10px] tracking-[0.16em] text-t3-gold">
                                            {String(i + 1).padStart(2, '0')} / STAT
                                        </p>
                                        <AnimatedStatValue
                                            value={stat.value}
                                            className="mt-2 font-display text-2xl font-semibold tracking-tight text-t3-navy md:text-[1.75rem]"
                                        />
                                        <p className="mt-1.5 font-ui text-xs leading-snug text-t3-dim sm:text-[13px]">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div
                        className="min-h-[320px] overflow-hidden rounded-[16px] bg-cover bg-center shadow-[0_16px_40px_rgba(14,27,51,0.1)] lg:min-h-full"
                        style={{
                            backgroundImage: image
                                ? `url(${image})`
                                : 'linear-gradient(135deg, #0E1B33, #24365C)',
                        }}
                        role="img"
                        aria-label={data.image?.alt || data.title}
                    />
                </div>
            </section>
        )
    }

    if (variant === 'temp2') {
        return (
            <section className="bg-[#FCF8F3] py-16 md:py-24">
                <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <div
                        className="aspect-[4/5] overflow-hidden rounded-[28px] bg-cover bg-center shadow-lg"
                        style={{
                            backgroundImage: image
                                ? `linear-gradient(135deg, rgba(42,157,143,0.35), rgba(69,123,157,0.45)), url(${image})`
                                : 'linear-gradient(135deg, #2A9D8F, #457B9D)',
                            backgroundBlendMode: 'overlay',
                        }}
                        role="img"
                        aria-label={data.image?.alt || data.title}
                    />

                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#888]">
                            {data.eyebrow}
                        </p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#111] md:text-4xl">
                            {data.title}
                        </h2>
                        <p className="mt-4 text-[0.98rem] leading-relaxed text-[#333]/70">
                            {data.paragraph}
                        </p>
                        <AgencyLink
                            href="/about-us"
                            className="mt-6 inline-flex rounded-full border border-[#111]/15 px-5 py-2.5 text-sm font-medium text-[#111]"
                        >
                            Learn more
                        </AgencyLink>

                        {stats.length > 0 ? (
                            <div className="mt-10 grid grid-cols-2 gap-4">
                                {stats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="rounded-2xl bg-white px-4 py-4 shadow-sm"
                                    >
                                        <p className="text-2xl font-bold text-[#06403D]">
                                            {stat.value}
                                        </p>
                                        <p className="mt-1 text-xs leading-snug text-[#666]">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </section>
        )
    }

    return null
}

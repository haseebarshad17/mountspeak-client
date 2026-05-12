import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, MapPin, Mountain, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils/clsxUtils'

import type { TourPage } from './tour-page.types'

const heroHighlightIcons: Record<string, LucideIcon> = {
    calendar: CalendarDays,
    mountain: Mountain,
}

type ExpeditionHeroSectionProps = {
    page: TourPage
}

export function ExpeditionHeroSection({ page }: ExpeditionHeroSectionProps) {
    const { heroSection, theme } = page
    const { backgroundMedia, overlay, eyebrow, title, subtitle, tripHighlights, ctaGroup } = heroSection

    return (
        <section
            id={heroSection.id}
            className="relative w-full overflow-hidden  min-h-[75vh]
        sm:min-h-[82vh]
        lg:min-h-[min(100vh,920px)]"
        >
            <div className="absolute inset-0">
                <Image
                    src={backgroundMedia.desktop}
                    alt={backgroundMedia.alt}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
                {overlay.enabled ? (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundColor: overlay.color,
                            opacity: overlay.opacity,
                        }}
                    />
                ) : null}
            </div>

            <div className="relative z-10 flex  min-h-[75vh]
        sm:min-h-[82vh]
        lg:min-h-[min(100vh,920px)] flex-col justify-end pb-16 pt-32 sm:pb-20 sm:pt-40 lg:pb-28 lg:pt-48">
                <div className="agency-container">
                    <div className="max-w-3xl text-white">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                            {eyebrow}
                        </p>
                        <h1
                            className="font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
                            style={{ textShadow: '0 2px 40px rgba(0,0,0,0.35)' }}
                        >
                            {title}
                        </h1>
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
                            {subtitle}
                        </p>

                        {tripHighlights.length > 0 ? (
                            <ul className="mt-8 flex flex-wrap gap-6 text-sm font-medium text-white/95">
                                {tripHighlights.map((item) => {
                                    const Icon = heroHighlightIcons[item.icon] ?? MapPin
                                    return (
                                        <li key={item.label} className="flex items-center gap-2">
                                            <Icon className="h-5 w-5 shrink-0 opacity-90" />
                                            <span>{item.label}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : null}

                        {ctaGroup.length > 0 ? (
                            <div className="mt-10 flex flex-wrap gap-3">
                                {ctaGroup.map((cta) => {
                                    const isPrimary = cta.style === 'primary'
                                    return (
                                        <Link
                                            key={cta.label}
                                            href={cta.url}
                                            className={cn(
                                                'inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-semibold transition-colors',
                                                isPrimary
                                                    ? 'text-white shadow-lg shadow-black/20'
                                                    : 'border border-white/70 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
                                            )}
                                            style={
                                                isPrimary
                                                    ? { backgroundColor: theme.secondaryColor }
                                                    : undefined
                                            }
                                        >
                                            {cta.label}
                                        </Link>
                                    )
                                })}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    )
}

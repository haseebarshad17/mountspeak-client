import React from 'react'
import Image from 'next/image'
import { CalendarDays, CircleDollarSign, Mountain, type LucideIcon } from 'lucide-react'

import type { TourPage } from './tour-page.types'

const heroHighlightIcons: Record<string, LucideIcon> = {
    calendar: CalendarDays,
    price: CircleDollarSign,
    mountain: Mountain,
}

type ExpeditionHeroSectionProps = {
    page: TourPage
}

export function ExpeditionHeroSection({ page }: ExpeditionHeroSectionProps) {
    const { heroSection } = page
    const { backgroundMedia, overlay, eyebrow, title, subtitle, tripHighlights } = heroSection

    return (
        <section
            id={heroSection.id}
            className="p-2 sm:p-3 md:p-4 lg:p-5 xl:p-[30px]"
        >
            <div className="relative min-h-[min(85vh,820px)] overflow-hidden rounded-[16px] sm:min-h-[82vh] lg:min-h-[min(88vh,900px)]">
                <div className="absolute inset-0">
                    <Image
                        src={backgroundMedia.desktop}
                        alt={backgroundMedia.alt}
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
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

                <div className="relative z-10 flex min-h-[min(85vh,820px)] flex-col justify-end pb-10 pt-32 sm:min-h-[82vh] sm:pb-14 sm:pt-40 lg:min-h-[min(88vh,900px)] lg:pb-16 lg:pt-44">
                    <div className="agency-container">
                        <div className="max-w-3xl text-white">
                            {eyebrow ? (
                                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                                    {eyebrow}
                                </p>
                            ) : null}
                            <h1
                                className="font-heading text-[40px] font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[56px]"
                                style={{ textShadow: '0 2px 40px rgba(0,0,0,0.35)' }}
                            >
                                {title}
                            </h1>
                            {subtitle ? (
                                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
                                    {subtitle}
                                </p>
                            ) : null}

                            {tripHighlights.length > 0 ? (
                                <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-white/95 sm:text-base">
                                    {tripHighlights.map((item) => {
                                        const Icon = heroHighlightIcons[item.icon] ?? CalendarDays
                                        return (
                                            <li key={item.label} className="flex items-center gap-2.5">
                                                <Icon className="h-5 w-5 shrink-0 opacity-90" strokeWidth={1.75} />
                                                <span>{item.label}</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

import React from 'react'
import { Banknote, CalendarDays, Mountain, type LucideIcon } from 'lucide-react'

import { TourMediaImage } from '@/components/pages/tour/TourMediaImage'

import type { TourPage } from './tour-page.types'

const heroHighlightIcons: Record<string, LucideIcon> = {
    calendar: CalendarDays,
    price: Banknote,
    mountain: Mountain,
}

type ExpeditionHeroSectionProps = {
    page: TourPage
}

export function ExpeditionHeroSection({ page }: ExpeditionHeroSectionProps) {
    const { heroSection } = page
    const { backgroundMedia, overlay, title, subtitle, tripHighlights } = heroSection

    return (
        <section
            id={heroSection.id}
            className="px-2 pt-2 sm:px-3 sm:pt-3 md:px-4 md:pt-4 lg:pt-[30px] xl:px-[18px]"
        >
            <div className="relative min-h-[min(85vh,820px)] overflow-hidden rounded-[16px] sm:min-h-[82vh] lg:h-[631px] lg:min-h-[631px]">
                <div className="absolute inset-0">
                    <TourMediaImage
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

                <div className="relative z-10 flex min-h-[min(85vh,820px)] flex-col justify-end pb-10 pt-32 sm:min-h-[82vh] sm:pb-14 sm:pt-40 lg:min-h-[631px] lg:pb-16 lg:pt-44">
                    <div className="agency-container px-4 sm:px-8 lg:px-16">
                        <div className="max-w-3xl text-white">
                            <h1
                                className="font-heading w-full max-w-[672px] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[48px] lg:leading-[57px]"
                                style={{ textShadow: '0 2px 40px rgba(0,0,0,0.35)' }}
                            >
                                {title}
                            </h1>
                            {subtitle ? (
                                <p className="mt-4 max-w-xl text-sm leading-normal text-[#FFFFFFCC] sm:text-base">
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

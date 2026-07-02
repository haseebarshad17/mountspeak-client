import React from 'react'
import { Banknote, CalendarDays, Mountain, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TourMediaImage } from '@/components/pages/tour/TourMediaImage'
import { cn } from '@/lib/utils/clsxUtils'

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
    const { heroSection, finalCtaSection, theme } = page
    const { backgroundMedia, overlay, title, subtitle, tripHighlights } = heroSection
    const primaryButton =
        heroSection.ctaGroup.find((btn) => btn.style === 'primary')
        ?? finalCtaSection.buttons.find((btn) => btn.style === 'primary')

    return (
        <section
            id={heroSection.id}
            className="px-2 pt-2 sm:px-3 sm:pt-3 md:px-4 md:pt-4 lg:pt-[30px] xl:px-[18px]"
        >
            <div className="relative h-[min(52vh,400px)] overflow-hidden rounded-[16px] sm:h-[460px] md:h-[540px] lg:h-[631px]">
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

                <div className="relative z-10 flex h-full flex-col justify-end pb-8 pt-20 sm:pb-12 sm:pt-24 md:pb-14 md:pt-28 lg:pb-16 lg:pt-36">
                    <div className="agency-container px-4 sm:px-8 lg:px-16">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
                            <div className="max-w-3xl text-white">
                                <h1
                                    className="font-heading w-full max-w-[672px] text-2xl font-semibold leading-tight tracking-tight xs:text-[26px] sm:text-4xl lg:text-[48px] lg:leading-[57px]"
                                    style={{ textShadow: '0 2px 40px rgba(0,0,0,0.35)' }}
                                >
                                    {title}
                                </h1>
                                {subtitle ? (
                                    <p className="mt-2 max-w-xl text-sm leading-normal text-[#FFFFFFCC] sm:mt-4 sm:text-base">
                                        {subtitle}
                                    </p>
                                ) : null}

                                {tripHighlights.length > 0 ? (
                                    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-white/95 sm:mt-6 sm:gap-x-8 sm:gap-y-3 sm:text-base">
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

                            {primaryButton ? (
                                <div className="hidden shrink-0 lg:block">
                                    <Button
                                        href={primaryButton.url}
                                        variant="default"
                                        className={cn(
                                            'h-12 min-w-[200px] rounded-full px-10 text-sm shadow-[0_8px_28px_rgba(0,0,0,0.22)]',
                                        )}
                                        style={{
                                            backgroundColor: theme.secondaryColor,
                                            borderColor: theme.secondaryColor,
                                        }}
                                    >
                                        {primaryButton.label}
                                    </Button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

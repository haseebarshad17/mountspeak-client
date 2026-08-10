'use client'

import { ArrowRight } from 'lucide-react'
import { AgencyLink } from '@/components/links/AgencyLink'
import type { ClassicPageHeroAction } from '@/components/pages/ClassicPageHero'
import { cn } from '@/lib/utils/cn'

/** Full-bleed page hero matching homepage temp3 chrome. */
export function Temp3PageHero({
    eyebrow,
    title,
    subtitle,
    imageSrc,
    actions,
    size = 'default',
}: {
    eyebrow?: string
    title: string
    subtitle?: string
    imageSrc?: string | null
    actions?: ClassicPageHeroAction[]
    size?: 'default' | 'tall' | 'compact'
}) {
    const minHeight =
        size === 'tall'
            ? 'min-h-[62vh] md:min-h-[68vh]'
            : size === 'compact'
                ? 'min-h-[280px] md:min-h-[340px]'
                : 'min-h-[42vh] md:min-h-[48vh]'

    return (
        <section
            className={cn(
                'relative overflow-hidden bg-t3-hero text-white',
                minHeight
            )}
        >
            {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={imageSrc}
                    alt=""
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                />
            ) : null}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-t3-hero/95 via-t3-hero/70 to-t3-hero/25" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-t3-hero/80 via-transparent to-t3-hero/35" />

            <div
                className={cn(
                    'relative z-10 flex flex-col justify-end pb-12 pt-28 md:pb-16 md:pt-32',
                    minHeight
                )}
            >
                <div className="t3-wrap">
                    {eyebrow ? (
                        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                            <span
                                className="h-1.5 w-1.5 rounded-full bg-t3-warm"
                                aria-hidden
                            />
                            <span>{eyebrow}</span>
                        </div>
                    ) : null}

                    <h1 className="max-w-[16ch] font-display text-[2.2rem] font-semibold leading-[1.08] tracking-tight md:text-5xl lg:text-[3.1rem]">
                        {title}
                    </h1>

                    {subtitle ? (
                        <p className="mt-4 max-w-md font-ui text-base leading-relaxed text-white/75 md:text-lg">
                            {subtitle}
                        </p>
                    ) : null}

                    {actions && actions.length > 0 ? (
                        <div className="mt-8 flex flex-wrap gap-3">
                            {actions.map((action) => {
                                const primary = action.variant !== 'ghost'
                                return (
                                    <AgencyLink
                                        key={action.href + action.label}
                                        href={action.href}
                                        className={cn(
                                            'inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-ui text-sm font-semibold transition',
                                            primary
                                                ? 'bg-t3-warm text-white hover:bg-[#d8894a]'
                                                : 'border border-white/35 text-white hover:border-white/60 hover:bg-white/10'
                                        )}
                                    >
                                        {action.label}
                                        {primary ? (
                                            <ArrowRight
                                                className="h-3.5 w-3.5"
                                                strokeWidth={2.25}
                                            />
                                        ) : null}
                                    </AgencyLink>
                                )
                            })}
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    )
}

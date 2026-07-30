'use client'

import { AgencyLink } from '@/components/links/AgencyLink'
import { cn } from '@/lib/utils/cn'

export function MarketingCtaBand({
    eyebrow,
    title,
    subtitle,
    primaryHref,
    primaryLabel,
    secondaryHref,
    secondaryLabel,
    className,
}: {
    eyebrow?: string
    title: string
    subtitle: string
    primaryHref: string
    primaryLabel: string
    secondaryHref?: string
    secondaryLabel?: string
    className?: string
}) {
    return (
        <section className={cn('section-spacing section-spacing-top', className)}>
            <div className="site-container">
                <div className="relative overflow-hidden rounded-2xl bg-[var(--color-brand)] px-6 py-12 text-white md:px-12 md:py-16">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/25 via-transparent to-black/40" />
                    <div className="relative mx-auto max-w-2xl text-center">
                        {eyebrow ? (
                            <p className="text-sm font-medium uppercase text-white/70">
                                {eyebrow}
                            </p>
                        ) : null}
                        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                            {title}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
                            {subtitle}
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <AgencyLink
                                href={primaryHref}
                                className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[var(--color-brand)] transition hover:bg-white/90"
                            >
                                {primaryLabel}
                            </AgencyLink>
                            {secondaryHref && secondaryLabel ? (
                                <AgencyLink
                                    href={secondaryHref}
                                    className="inline-flex rounded-full border border-white/35 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                                >
                                    {secondaryLabel}
                                </AgencyLink>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

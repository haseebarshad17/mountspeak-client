'use client'

import { AgencyLink } from '@/components/links/AgencyLink'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
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
    const variant = useTemplateVariant()

    if (variant === 'temp3') {
        return (
            <section className={cn('t3-section t3-section-cream', className)}>
                <div className="t3-wrap">
                    <div className="relative overflow-hidden rounded-[20px] bg-t3-navy px-6 py-12 text-t3-cream shadow-[0_16px_40px_rgba(14,27,51,0.12)] md:rounded-[24px] md:px-12 md:py-16">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-t3-navy via-t3-navy to-[#132445]" />
                        <div className="relative mx-auto max-w-2xl text-center">
                            {eyebrow ? (
                                <p className="t3-eyebrow t3-eyebrow-on-navy">
                                    {eyebrow}
                                </p>
                            ) : null}
                            <h2 className="t3-title t3-title-on-navy">{title}</h2>
                            <p className="t3-sub t3-sub-on-navy mx-auto max-w-xl">
                                {subtitle}
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center gap-3">
                                <AgencyLink
                                    href={primaryHref}
                                    className="inline-flex rounded-full bg-t3-warm px-5 py-2.5 font-ui text-sm font-semibold text-white transition hover:bg-[#d8894a]"
                                >
                                    {primaryLabel}
                                </AgencyLink>
                                {secondaryHref && secondaryLabel ? (
                                    <AgencyLink
                                        href={secondaryHref}
                                        className="inline-flex rounded-full border border-white/30 px-5 py-2.5 font-ui text-sm font-semibold text-t3-cream transition hover:border-t3-gold hover:text-t3-gold"
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

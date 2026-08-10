'use client'

import { Suspense } from 'react'
import { AgencyLink } from '@/components/links/AgencyLink'
import { BookingRequestForm } from '@/components/booking/BookingRequestForm'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { BookATourSection } from '@/services/agency/agency.types'
import type { AgencySpecializationCapabilities } from '@/services/specialization/specialization.types'

export function ContactLead({
    data,
    agencyId,
    capabilities,
}: {
    data: BookATourSection
    agencyId: string
    capabilities: AgencySpecializationCapabilities
}) {
    const variant = useTemplateVariant()
    const { form } = data
    const background = resolveThemeAssetUrl(data.backgroundImage)

    if (variant === 'temp1') {
        return (
            <section className="section-spacing section-spacing-top relative">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: background
                            ? `url(${background})`
                            : 'linear-gradient(135deg, var(--color-brand), color-mix(in srgb, var(--color-brand) 55%, #000))',
                    }}
                />
                <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-brand)_30%,transparent)]" />

                <div className="site-container relative z-10">
                    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                        <div className="text-white">
                            <p className="text-sm font-medium uppercase text-white/70">
                                {data.eyebrow || 'Online Booking'}
                            </p>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem]">
                                {data.title}
                            </h2>
                            <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">
                                {data.paragraphs?.[0]}
                            </p>
                            {data.cta?.href ? (
                                <div className="mt-8">
                                    <AgencyLink
                                        href={data.cta.href}
                                        className="inline-flex rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                                    >
                                        {data.cta.label}
                                    </AgencyLink>
                                </div>
                            ) : null}
                        </div>

                        <div className="min-w-0 overflow-hidden rounded-2xl bg-white p-5 shadow-xl sm:p-8 md:p-10">
                            <Suspense
                                fallback={
                                    <div className="h-64 animate-pulse rounded-2xl bg-black/5" />
                                }
                            >
                                <BookingRequestForm
                                    agencyId={agencyId}
                                    capabilities={capabilities}
                                    title={form.title}
                                    subtitle={form.subtitle}
                                    submitLabel={form.submitLabel || 'Send Message'}
                                    compact
                                />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (variant === 'temp3') {
        return (
            <section className="t3-section t3-section-cream">
                <div className="t3-wrap">
                    <div className="relative overflow-hidden rounded-[20px] bg-t3-navy text-t3-cream shadow-[0_16px_40px_rgba(14,27,51,0.12)] md:rounded-[24px]">
                        {background ? (
                            <div
                                className="pointer-events-none absolute inset-0 opacity-25"
                                style={{
                                    backgroundImage: `url(${background})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
                        ) : null}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-t3-navy via-t3-navy/95 to-[#132445]" />

                        <div className="relative z-10 px-5 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14 lg:px-12">
                            <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
                                <div className="flex flex-col justify-center py-2 lg:py-6">
                                    <p className="t3-eyebrow t3-eyebrow-on-navy">
                                        {data.eyebrow || 'Booking'}
                                    </p>
                                    <h2 className="t3-title t3-title-on-navy text-left">
                                        {data.title}
                                    </h2>
                                    <p className="t3-sub t3-sub-on-navy max-w-md text-left">
                                        {data.paragraphs?.[0]}
                                    </p>

                                    {data.promoHighlight ? (
                                        <p className="mt-6 inline-flex w-fit items-center rounded-full border border-t3-gold/40 bg-t3-gold/10 px-4 py-2 font-ui text-sm font-semibold text-t3-gold">
                                            {data.promoHighlight}
                                        </p>
                                    ) : null}

                                    {data.cta?.href ? (
                                        <div className="mt-8">
                                            <AgencyLink
                                                href={data.cta.href}
                                                className="inline-flex items-center justify-center rounded-full bg-[#E89C5D] px-6 py-3 font-ui text-sm font-semibold text-white transition hover:bg-[#d8894a]"
                                            >
                                                {data.cta.label}
                                            </AgencyLink>
                                        </div>
                                    ) : null}

                                    {data.paragraphs?.[1] ? (
                                        <p className="mt-8 max-w-md font-ui text-sm leading-relaxed text-t3-muted">
                                            {data.paragraphs[1]}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="min-w-0 rounded-[16px] bg-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.25)] sm:p-7 md:p-8">
                                    <Suspense
                                        fallback={
                                            <div className="h-64 animate-pulse rounded-[14px] bg-t3-navy/5" />
                                        }
                                    >
                                        <BookingRequestForm
                                            agencyId={agencyId}
                                            capabilities={capabilities}
                                            title={form.title}
                                            subtitle={form.subtitle}
                                            submitLabel={
                                                form.submitLabel || 'Send Message'
                                            }
                                            compact
                                            className="rounded-[16px] border-0 bg-transparent p-0 shadow-none md:p-0"
                                        />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (variant === 'temp2') {
        return (
            <section className="bg-[#FCF8F3] py-16 md:py-20">
                <div className="site-container">
                    <div className='grid overflow-hidden lg:grid-cols-2 bg-[#F1EBE3] rounded-[28px]'>
                        <div
                            className="bg-cover bg-center px-8 py-12 text-white md:px-12
                    rounded-[28px] border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
                            style={{
                                backgroundImage: background
                                    ? `linear-gradient(135deg, rgba(6,64,61,0.88), rgba(231,111,81,0.75)), url(${background})`
                                    : 'linear-gradient(135deg, #F4A261, #E76F51, #9B5DE5)',
                            }}
                        >
                            <p className="text-sm uppercase text-white/70">
                                {data.eyebrow}
                            </p>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                                {data.title}
                            </h2>
                            <p className="mt-4 max-w-md text-white/85">
                                {data.paragraphs?.[0]}
                            </p>
                            {/* {data.promoHighlight ? (
                        <p className="mt-6 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
                            {data.promoHighlight}
                        </p>
                    ) : null} */}
                            {data.cta?.href ? (
                                <div className="mt-8">
                                    <AgencyLink
                                        href={data.cta.href}
                                        className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#111]"
                                    >
                                        {data.cta.label}
                                    </AgencyLink>
                                </div>
                            ) : null}
                        </div>

                        <div className="min-w-0 overflow-hidden px-5 py-8 sm:px-8 md:px-10 md:py-10">
                            <Suspense
                                fallback={<div className="h-64 animate-pulse rounded-2xl bg-white/60" />}
                            >
                                <BookingRequestForm
                                    agencyId={agencyId}
                                    capabilities={capabilities}
                                    title={form.title}
                                    subtitle={form.subtitle}
                                    submitLabel={form.submitLabel || 'Send Message'}
                                    compact
                                />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return null
}

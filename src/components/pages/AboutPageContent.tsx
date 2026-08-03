'use client'

import { Award, Compass, HeartHandshake, MapPinned, ShieldCheck, Users } from 'lucide-react'
import { MarketingCtaBand } from '@/components/pages/MarketingCtaBand'
import { Temp3SectionHeader } from '@/components/home/Temp3SectionHeader'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { HomepagePage } from '@/services/agency/agency.types'

const VALUES = [
    {
        title: 'Mission',
        description:
            'Deliver reliable travel solutions that stay clear, honest, and aligned with each traveler’s plan.',
        icon: Compass,
    },
    {
        title: 'Approach',
        description:
            'Keep journeys well organized — from first inquiry to return — with practical local expertise.',
        icon: MapPinned,
    },
    {
        title: 'Promise',
        description:
            'Transparent offerings across tours, packages, and international trips with no guesswork.',
        icon: ShieldCheck,
    },
]

const STEPS = [
    {
        step: '01',
        title: 'Share your plan',
        description: 'Tell us where you want to go, when, and how you like to travel.',
    },
    {
        step: '02',
        title: 'We shape the trip',
        description: 'Routes, stays, and logistics are curated around your preferences.',
    },
    {
        step: '03',
        title: 'Travel with support',
        description: 'Clear updates and on-trip help so the journey stays smooth.',
    },
]

const CARE = [
    { icon: Users, label: 'People-first planning' },
    { icon: Award, label: 'Trusted local partners' },
    { icon: HeartHandshake, label: 'Support that stays close' },
]

export function AboutPageContent({ page }: { page: HomepagePage }) {
    const variant = useTemplateVariant()
    const image =
        resolveThemeAssetUrl(page.sections?.planPerfectTrip?.image?.src) ||
        resolveThemeAssetUrl(page.sections?.hero?.backgroundImages?.[0]) ||
        resolveThemeAssetUrl(page.sections?.hero?.backgroundImage)

    const stats = page.sections?.planPerfectTrip?.stats?.slice(0, 4) ?? [
        { value: '10+', label: 'Years guiding trips' },
        { value: '500+', label: 'Happy travelers' },
        { value: '40+', label: 'Destinations' },
        { value: '24/7', label: 'Trip support' },
    ]

    const story =
        page.sections?.planPerfectTrip?.paragraph ||
        `${page.branding.name} designs thoughtful travel experiences with clear service delivery — so planning feels calm, and the trip feels personal.`

    if (variant === 'temp3') {
        return (
            <>
                <section className="t3-section t3-section-cream">
                    <div className="t3-wrap grid items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
                        <div
                            className="min-h-[320px] overflow-hidden rounded-[16px] bg-cover bg-center shadow-[0_16px_40px_rgba(14,27,51,0.1)] lg:min-h-full"
                            style={{
                                backgroundImage: image
                                    ? `url(${image})`
                                    : 'linear-gradient(135deg, #0E1B33, #24365C)',
                            }}
                            role="img"
                            aria-label={page.branding.name}
                        />
                        <div className="flex flex-col">
                            <p className="t3-eyebrow">Our story</p>
                            <h2 className="t3-title t3-title-on-cream text-left">
                                Built for travelers who want clarity
                            </h2>
                            <p className="t3-sub t3-sub-on-cream max-w-xl text-left">{story}</p>
                            <div className="mt-9 grid flex-1 grid-cols-2 content-start gap-3 sm:gap-4">
                                {stats.map((stat, i) => (
                                    <div
                                        key={stat.label}
                                        className="rounded-[14px] border border-t3-navy/10 bg-white px-4 py-5 text-center shadow-[0_10px_30px_rgba(14,27,51,0.05)]"
                                    >
                                        <p className="font-mono text-[10px] tracking-[0.16em] text-t3-gold">
                                            {String(i + 1).padStart(2, '0')} / STAT
                                        </p>
                                        <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-t3-navy">
                                            {stat.value}
                                        </p>
                                        <p className="mt-1.5 font-ui text-xs leading-snug text-t3-dim">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="t3-section t3-section-soft">
                    <div className="t3-wrap">
                        <Temp3SectionHeader
                            eyebrow="What guides us"
                            title="Values behind every journey"
                            tone="cream"
                        />
                        <div className="grid gap-5 md:grid-cols-3">
                            {VALUES.map((item) => {
                                const Icon = item.icon
                                return (
                                    <article
                                        key={item.title}
                                        className="rounded-[14px] border border-t3-navy/10 bg-white p-6 shadow-[0_10px_30px_rgba(14,27,51,0.05)]"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-t3-navy/5 text-t3-navy">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="mt-4 font-display text-lg font-semibold text-t3-navy">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 font-ui text-sm leading-relaxed text-t3-dim">
                                            {item.description}
                                        </p>
                                    </article>
                                )
                            })}
                        </div>
                    </div>
                </section>

                <section className="t3-section t3-section-cream">
                    <div className="t3-wrap">
                        <Temp3SectionHeader
                            eyebrow="How we work"
                            title="A simple path from idea to itinerary"
                            tone="cream"
                        />
                        <div className="grid gap-5 md:grid-cols-3">
                            {STEPS.map((item) => (
                                <article
                                    key={item.step}
                                    className="rounded-[14px] border border-t3-navy/10 bg-white p-6 shadow-[0_10px_30px_rgba(14,27,51,0.05)]"
                                >
                                    <p className="font-mono text-sm font-semibold text-t3-gold">
                                        {item.step}
                                    </p>
                                    <h3 className="mt-3 font-display text-lg font-semibold text-t3-navy">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 font-ui text-sm leading-relaxed text-t3-dim">
                                        {item.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                        <div className="mt-10 grid gap-4 sm:grid-cols-3">
                            {CARE.map((item) => {
                                const Icon = item.icon
                                return (
                                    <div
                                        key={item.label}
                                        className="flex items-center gap-3 rounded-[14px] border border-t3-navy/10 bg-white px-4 py-3"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-t3-navy/5 text-t3-navy">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <p className="font-ui text-sm font-medium text-t3-navy">
                                            {item.label}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                <MarketingCtaBand
                    eyebrow="Ready when you are"
                    title="Let’s plan your next trip"
                    subtitle="Browse curated journeys or talk to the team — we’ll help you move from idea to departure."
                    primaryHref="/tours"
                    primaryLabel="Explore tours"
                    secondaryHref="/contact-us"
                    secondaryLabel="Contact us"
                />
            </>
        )
    }

    return (
        <>
            <section className="section-spacing section-spacing-top bg-white">
                <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <div
                        className="aspect-[4/5] overflow-hidden rounded-2xl bg-cover bg-center shadow-lg"
                        style={{
                            backgroundImage: image
                                ? `url(${image})`
                                : 'linear-gradient(135deg, var(--color-brand), color-mix(in srgb, var(--color-brand) 55%, #000))',
                        }}
                        role="img"
                        aria-label={page.branding.name}
                    />
                    <div>
                        <p className="text-brand text-sm font-medium uppercase">Our story</p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#111] md:text-4xl">
                            Built for travelers who want clarity
                        </h2>
                        <p className="mt-4 text-[0.98rem] leading-relaxed text-[#333]/70">
                            {story}
                        </p>
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-2xl border border-black/5 bg-white px-4 py-4 shadow-sm"
                                >
                                    <p className="text-2xl font-bold text-[#111]">{stat.value}</p>
                                    <p className="mt-1 text-xs text-[#666]">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-spacing section-spacing-top bg-[#F7FAFA]">
                <div className="site-container">
                    <div className="mx-auto mb-10 max-w-2xl text-center">
                        <p className="text-brand text-sm font-medium uppercase">What guides us</p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                            Values behind every journey
                        </h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {VALUES.map((item) => {
                            const Icon = item.icon
                            return (
                                <article
                                    key={item.title}
                                    className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
                                >
                                    <div className="bg-brand-soft flex h-12 w-12 items-center justify-center rounded-full">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-[#111]">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#666]">
                                        {item.description}
                                    </p>
                                </article>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="section-spacing section-spacing-top bg-white">
                <div className="site-container">
                    <div className="mx-auto mb-10 max-w-2xl text-center">
                        <p className="text-brand text-sm font-medium uppercase">How we work</p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                            A simple path from idea to itinerary
                        </h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {STEPS.map((item) => (
                            <article
                                key={item.step}
                                className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
                            >
                                <p className="text-brand text-sm font-bold">{item.step}</p>
                                <h3 className="mt-3 text-lg font-semibold text-[#111]">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-[#666]">
                                    {item.description}
                                </p>
                            </article>
                        ))}
                    </div>
                    <div className="mt-10 grid gap-4 sm:grid-cols-3">
                        {CARE.map((item) => {
                            const Icon = item.icon
                            return (
                                <div
                                    key={item.label}
                                    className="flex items-center gap-3 rounded-2xl border border-black/5 px-4 py-3"
                                >
                                    <div className="bg-brand-soft flex h-9 w-9 items-center justify-center rounded-full">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-[#222]">{item.label}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <MarketingCtaBand
                eyebrow="Ready when you are"
                title="Let’s plan your next trip"
                subtitle="Browse curated journeys or talk to the team — we’ll help you move from idea to departure."
                primaryHref="/tours"
                primaryLabel="Explore tours"
                secondaryHref="/contact-us"
                secondaryLabel="Contact us"
            />
        </>
    )
}

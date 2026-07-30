'use client'

import {
    Building2,
    Camera,
    Car,
    CheckCircle2,
    Compass,
    MapPinned,
    Plane,
} from 'lucide-react'
import { MarketingCtaBand } from '@/components/pages/MarketingCtaBand'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { accentSoftClass, isClassicTemplate } from '@/lib/templates/chrome'

const SERVICE_ITEMS = [
    {
        title: 'Travel Planning',
        icon: Compass,
        description: 'Custom itineraries built around your pace, budget, and interests.',
    },
    {
        title: 'Flight Support',
        icon: Plane,
        description: 'Route advice and booking help for domestic and international trips.',
    },
    {
        title: 'Hotel Booking',
        icon: Building2,
        description: 'Curated stays from boutique hotels to family-friendly resorts.',
    },
    {
        title: 'Route Consultation',
        icon: MapPinned,
        description: 'Local expertise for destinations, seasons, and travel windows.',
    },
    {
        title: 'Transport Management',
        icon: Car,
        description: 'Transfers, private cars, and group logistics handled end to end.',
    },
    {
        title: 'Trip Media Coverage',
        icon: Camera,
        description: 'Optional photo and content support for special journeys.',
    },
]

const PROCESS = [
    {
        title: 'Tell us the goal',
        description: 'Destination, dates, group size, and the kind of trip you want.',
    },
    {
        title: 'We assemble the pieces',
        description: 'Stays, transport, and experiences are matched to your plan.',
    },
    {
        title: 'Confirm and go',
        description: 'Clear next steps, documents, and support through departure.',
    },
]

export function ServicesPageGrid() {
    const variant = useTemplateVariant()
    const classic = isClassicTemplate(variant)

    if (classic) {
        return (
            <>
                <section className="section-spacing section-spacing-top bg-white">
                    <div className="site-container">
                        <div className="mx-auto mb-10 max-w-2xl text-center">
                            <p className="text-brand text-sm font-medium uppercase">
                                What we offer
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                                Services built for real travel
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-[#666] md:text-base">
                                From planning to on-ground logistics, every service is designed to
                                keep your trip clear and well supported.
                            </p>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {SERVICE_ITEMS.map((item) => {
                                const Icon = item.icon
                                return (
                                    <article
                                        key={item.title}
                                        className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-md"
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

                <section className="section-spacing section-spacing-top bg-[#F7FAFA]">
                    <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                        <div>
                            <p className="text-brand text-sm font-medium uppercase">
                                How it works
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                                A calm process from brief to booking
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed text-[#666] md:text-base">
                                No cluttered packages or vague promises — just a clear path to a
                                trip that fits how you travel.
                            </p>
                        </div>
                        <div className="space-y-4">
                            {PROCESS.map((item, i) => (
                                <div
                                    key={item.title}
                                    className="flex gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
                                >
                                    <div className="bg-brand-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#111]">{item.title}</h3>
                                        <p className="mt-1 text-sm leading-relaxed text-[#666]">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="section-spacing section-spacing-top bg-white">
                    <div className="site-container">
                        <div className="mx-auto max-w-3xl rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
                            <p className="text-brand text-sm font-medium uppercase">Included care</p>
                            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111] md:text-3xl">
                                What you can expect from us
                            </h2>
                            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                                {[
                                    'Clear pricing and inclusions',
                                    'Responsive trip coordination',
                                    'Trusted stays and transport partners',
                                    'Help before and during travel',
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-2 text-sm text-[#444]"
                                    >
                                        <CheckCircle2 className="text-brand mt-0.5 h-4 w-4 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <MarketingCtaBand
                    eyebrow="Need a custom plan?"
                    title="Talk to our travel team"
                    subtitle="Share your dates and destinations — we’ll recommend the right service mix."
                    primaryHref="/contact-us"
                    primaryLabel="Contact us"
                    secondaryHref="/tours"
                    secondaryLabel="Browse tours"
                />
            </>
        )
    }

    return (
        <section className="pb-20">
            <div className="site-container grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SERVICE_ITEMS.map((item) => {
                    const Icon = item.icon
                    return (
                        <article
                            key={item.title}
                            className="rounded-2xl bg-white p-6 shadow-sm"
                        >
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${accentSoftClass(variant)}`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-[#111]">
                                {item.title}
                            </h3>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}

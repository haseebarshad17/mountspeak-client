'use client'

import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { MarketingCtaBand } from '@/components/pages/MarketingCtaBand'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import {
    accentSolidClass,
    isClassicTemplate,
    primaryButtonClass,
} from '@/lib/templates/chrome'
import { cn } from '@/lib/utils/cn'

const FAQS = [
    {
        q: 'How quickly do you reply?',
        a: 'Most inquiries receive a response within one business day — often sooner for active booking requests.',
    },
    {
        q: 'Can you customize a package?',
        a: 'Yes. Share your dates, group size, and preferences and we’ll suggest a tailored plan.',
    },
    {
        q: 'Do you help with bookings too?',
        a: 'Absolutely. From tour booking to package requests, our team guides you through the next steps.',
    },
]

export function ContactPageContent() {
    const variant = useTemplateVariant()
    const classic = isClassicTemplate(variant)

    if (classic) {
        return (
            <>
                <section className="section-spacing section-spacing-top bg-white">
                    <div className="site-container grid gap-6 lg:grid-cols-2 lg:gap-10">
                        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
                            <p className="text-brand text-sm font-medium uppercase">Message</p>
                            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111] md:text-3xl">
                                Get in touch
                            </h2>
                            <p className="mt-2 text-sm text-[#666]">
                                Send your request and our team will contact you shortly.
                            </p>
                            <form
                                className="mt-6 space-y-4"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <input
                                    className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none"
                                    placeholder="Full name"
                                />
                                <input
                                    type="email"
                                    className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none"
                                    placeholder="Email address"
                                />
                                <textarea
                                    className="min-h-[140px] w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none"
                                    placeholder="Message"
                                />
                                <button
                                    type="submit"
                                    className="btn-brand rounded-full px-6 py-3 text-sm font-medium"
                                >
                                    Send message
                                </button>
                            </form>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-brand rounded-2xl p-6 text-white sm:p-8">
                                <h3 className="text-xl font-semibold">Contact details</h3>
                                <div className="mt-6 space-y-4 text-sm text-white/80">
                                    <p className="flex items-start gap-3">
                                        <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                                        hello@mountspeak.com
                                    </p>
                                    <p className="flex items-start gap-3">
                                        <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                                        +92 300 000 0000
                                    </p>
                                    <p className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                        Islamabad, Pakistan
                                    </p>
                                    <p className="flex items-start gap-3">
                                        <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />
                                        Mon–Sat · 10:00 am – 7:00 pm
                                    </p>
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    { label: 'Booking help', value: 'Tours & packages' },
                                    { label: 'Response time', value: 'Within 24 hours' },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
                                    >
                                        <p className="text-brand text-xs font-medium uppercase">
                                            {item.label}
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#111]">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-spacing section-spacing-top bg-[#F7FAFA]">
                    <div className="site-container">
                        <div className="mx-auto mb-10 max-w-2xl text-center">
                            <p className="text-brand text-sm font-medium uppercase">FAQ</p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                                Common questions
                            </h2>
                        </div>
                        <div className="mx-auto grid max-w-4xl gap-4">
                            {FAQS.map((item) => (
                                <article
                                    key={item.q}
                                    className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm md:p-6"
                                >
                                    <h3 className="text-base font-semibold text-[#111]">
                                        {item.q}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#666]">
                                        {item.a}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <MarketingCtaBand
                    eyebrow="Prefer to browse first?"
                    title="Explore trips while you wait"
                    subtitle="Browse published tours and packages, then reach out when you’re ready."
                    primaryHref="/tours"
                    primaryLabel="View tours"
                    secondaryHref="/packages"
                    secondaryLabel="View packages"
                />
            </>
        )
    }

    return (
        <section className="pb-20">
            <div className="site-container grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#111]">Get in touch</h2>
                    <p className="mt-2 text-sm text-[#666]">
                        Send your request and our team will contact you shortly.
                    </p>
                    <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <input
                            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none"
                            placeholder="Full name"
                        />
                        <input
                            type="email"
                            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none"
                            placeholder="Email address"
                        />
                        <textarea
                            className="min-h-[140px] w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none"
                            placeholder="Message"
                        />
                        <button
                            type="submit"
                            className={primaryButtonClass(
                                variant,
                                'rounded-full px-6 py-3 text-sm font-medium'
                            )}
                        >
                            Send message
                        </button>
                    </form>
                </div>
                <div
                    className={cn(
                        'rounded-2xl p-8 text-white',
                        accentSolidClass(variant)
                    )}
                >
                    <h3 className="text-xl font-semibold">Contact details</h3>
                    <p className="mt-4 text-sm text-white/75">Email: hello@mountspeak.com</p>
                    <p className="mt-2 text-sm text-white/75">Phone: +92 300 000 0000</p>
                    <p className="mt-2 text-sm text-white/75">Address: Islamabad, Pakistan</p>
                </div>
            </div>
        </section>
    )
}

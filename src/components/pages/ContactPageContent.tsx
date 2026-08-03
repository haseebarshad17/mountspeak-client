'use client'

import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { MarketingCtaBand } from '@/components/pages/MarketingCtaBand'
import { Temp3SectionHeader } from '@/components/home/Temp3SectionHeader'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { accentSolidClass, primaryButtonClass } from '@/lib/templates/chrome'
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

const CONTACT_DETAILS = [
    { icon: Mail, text: 'hello@mountspeak.com' },
    { icon: Phone, text: '+92 300 000 0000' },
    { icon: MapPin, text: 'Islamabad, Pakistan' },
    { icon: Clock3, text: 'Mon–Sat · 10:00 am – 7:00 pm' },
]

function ContactForm({
    buttonClassName,
    fieldClassName,
}: {
    buttonClassName: string
    fieldClassName: string
}) {
    return (
        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input className={fieldClassName} placeholder="Full name" />
            <input type="email" className={fieldClassName} placeholder="Email address" />
            <textarea
                className={cn(fieldClassName, 'min-h-[140px]')}
                placeholder="Message"
            />
            <button type="submit" className={buttonClassName}>
                Send message
            </button>
        </form>
    )
}

export function ContactPageContent() {
    const variant = useTemplateVariant()

    if (variant === 'temp3') {
        const fieldClass =
            'w-full rounded-[10px] border border-t3-navy/10 bg-t3-cream/60 px-4 py-3 font-ui text-sm text-t3-navy outline-none transition placeholder:text-t3-dim focus:border-t3-gold/50 focus:bg-white'

        return (
            <>
                <section className="t3-section t3-section-cream">
                    <div className="t3-wrap grid gap-6 lg:grid-cols-2 lg:gap-10">
                        <div className="rounded-[16px] border border-t3-navy/10 bg-white p-6 shadow-[0_10px_30px_rgba(14,27,51,0.05)] sm:p-8">
                            <p className="t3-eyebrow">Message</p>
                            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-t3-navy md:text-3xl">
                                Get in touch
                            </h2>
                            <p className="mt-2 font-ui text-sm text-t3-dim">
                                Send your request and our team will contact you shortly.
                            </p>
                            <ContactForm
                                fieldClassName={fieldClass}
                                buttonClassName="inline-flex rounded-full bg-t3-warm px-6 py-3 font-ui text-sm font-semibold text-white transition hover:bg-[#d8894a]"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-[16px] bg-t3-navy p-6 text-t3-cream sm:p-8">
                                <h3 className="font-display text-xl font-semibold">
                                    Contact details
                                </h3>
                                <div className="mt-6 space-y-4 font-ui text-sm text-t3-muted">
                                    {CONTACT_DETAILS.map((item) => {
                                        const Icon = item.icon
                                        return (
                                            <p
                                                key={item.text}
                                                className="flex items-start gap-3"
                                            >
                                                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-t3-gold" />
                                                {item.text}
                                            </p>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    { label: 'Booking help', value: 'Tours & packages' },
                                    { label: 'Response time', value: 'Within 24 hours' },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-[14px] border border-t3-navy/10 bg-white p-4 shadow-[0_10px_30px_rgba(14,27,51,0.05)]"
                                    >
                                        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-t3-gold">
                                            {item.label}
                                        </p>
                                        <p className="mt-1 font-ui text-sm font-semibold text-t3-navy">
                                            {item.value}
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
                            eyebrow="FAQ"
                            title="Common questions"
                            tone="cream"
                        />
                        <div className="mx-auto grid max-w-4xl gap-4">
                            {FAQS.map((item) => (
                                <article
                                    key={item.q}
                                    className="rounded-[14px] border border-t3-navy/10 bg-white p-5 shadow-[0_10px_30px_rgba(14,27,51,0.05)] md:p-6"
                                >
                                    <h3 className="font-display text-base font-semibold text-t3-navy">
                                        {item.q}
                                    </h3>
                                    <p className="mt-2 font-ui text-sm leading-relaxed text-t3-dim">
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

    if (variant === 'temp1') {
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
                            <ContactForm
                                fieldClassName="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none"
                                buttonClassName="btn-brand rounded-full px-6 py-3 text-sm font-medium"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="bg-brand rounded-2xl p-6 text-white sm:p-8">
                                <h3 className="text-xl font-semibold">Contact details</h3>
                                <div className="mt-6 space-y-4 text-sm text-white/80">
                                    {CONTACT_DETAILS.map((item) => {
                                        const Icon = item.icon
                                        return (
                                            <p
                                                key={item.text}
                                                className="flex items-start gap-3"
                                            >
                                                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                                                {item.text}
                                            </p>
                                        )
                                    })}
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
                    <ContactForm
                        fieldClassName="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none"
                        buttonClassName={primaryButtonClass(
                            variant,
                            'rounded-full px-6 py-3 text-sm font-medium'
                        )}
                    />
                </div>
                <div className={cn('rounded-2xl p-8 text-white', accentSolidClass(variant))}>
                    <h3 className="text-xl font-semibold">Contact details</h3>
                    <p className="mt-4 text-sm text-white/75">Email: hello@mountspeak.com</p>
                    <p className="mt-2 text-sm text-white/75">Phone: +92 300 000 0000</p>
                    <p className="mt-2 text-sm text-white/75">Address: Islamabad, Pakistan</p>
                </div>
            </div>
        </section>
    )
}

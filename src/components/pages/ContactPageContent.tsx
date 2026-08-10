'use client'

import { FormEvent, useState } from 'react'
import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { MarketingCtaBand } from '@/components/pages/MarketingCtaBand'
import { Select } from '@/components/ui/Select'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { accentSolidClass, primaryButtonClass } from '@/lib/templates/chrome'
import { getApiErrorMessage } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'
import { getMessage, mapZodIssuesToFieldErrors } from '@/lib/messages/get-message'
import { cn } from '@/lib/utils/cn'
import { useSubmitConsultUs } from '@/services/consult/consult.queries'
import { consultUsSchema } from '@/services/consult/consult.validation'
import { INQUIRY_TYPE_OPTIONS, type InquiryType } from '@/services/consult/consult.types'
import { isValidAgencyId } from '@/services/specialization/specialization.service'

const CONTACT_DETAILS = [
    { icon: Mail, text: 'hello@mountspeak.com' },
    { icon: Phone, text: '+92 300 000 0000' },
    { icon: MapPin, text: 'Islamabad, Pakistan' },
    { icon: Clock3, text: 'Mon–Sat · 10:00 am – 7:00 pm' },
]

const INQUIRY_SELECT_OPTIONS = INQUIRY_TYPE_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
}))

function ContactForm({
    agencyId,
    buttonClassName,
    fieldClassName,
}: {
    agencyId?: string
    buttonClassName: string
    fieldClassName: string
}) {
    const { mutateAsync: submitConsult, isPending } = useSubmitConsultUs()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [inquiryType, setInquiryType] = useState<InquiryType>(
        INQUIRY_TYPE_OPTIONS[0].value
    )
    const [errors, setErrors] = useState<Record<string, string>>({})

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        event.stopPropagation()

        const parsed = consultUsSchema.safeParse({
            name,
            email,
            phone,
            inquiry_type: inquiryType,
            title,
            description,
        })

        if (!parsed.success) {
            setErrors(mapZodIssuesToFieldErrors(parsed.error.issues))
            toast.error(getMessage(MessageCode.VALIDATION_FIX_HIGHLIGHTED_FIELDS))
            return
        }

        setErrors({})

        if (!isValidAgencyId(agencyId)) {
            toast.error(getMessage(MessageCode.CONSULT_MISSING_AGENCY))
            return
        }

        try {
            const response = await submitConsult({
                ...parsed.data,
                agency_id: agencyId as string,
            })
            toast.success(response?.message || getMessage(MessageCode.CONSULT_SUBMIT_SUCCESS))
            setName('')
            setEmail('')
            setPhone('')
            setTitle('')
            setDescription('')
            setInquiryType(INQUIRY_TYPE_OPTIONS[0].value)
        } catch (error) {
            toast.error(getApiErrorMessage(error, MessageCode.API_CONSULT_SUBMIT_FAILED))
        }
    }

    return (
        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <div>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn(fieldClassName, errors.name && 'ring-2 ring-red-400')}
                    placeholder="Full name"
                />
                {errors.name ? (
                    <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                ) : null}
            </div>

            <div>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(fieldClassName, errors.email && 'ring-2 ring-red-400')}
                    placeholder="Email address"
                />
                {errors.email ? (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                ) : null}
            </div>

            <div>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={cn(fieldClassName, errors.phone && 'ring-2 ring-red-400')}
                    placeholder="Phone number"
                />
                {errors.phone ? (
                    <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                ) : null}
            </div>

            <Select
                value={inquiryType}
                onChange={(value) => setInquiryType(value as InquiryType)}
                options={INQUIRY_SELECT_OPTIONS}
                placeholder="What can we help with?"
                className={fieldClassName}
            />

            <div>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={cn(fieldClassName, errors.title && 'ring-2 ring-red-400')}
                    placeholder="Subject"
                />
                {errors.title ? (
                    <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                ) : null}
            </div>

            <div>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={cn(
                        fieldClassName,
                        'min-h-[140px]',
                        errors.description && 'ring-2 ring-red-400'
                    )}
                    placeholder="Message"
                />
                {errors.description ? (
                    <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                ) : null}
            </div>

            <button type="submit" disabled={isPending} className={cn(buttonClassName, 'disabled:opacity-60')}>
                {isPending ? 'Sending…' : 'Send message'}
            </button>
        </form>
    )
}

export function ContactPageContent({ agencyId }: { agencyId?: string }) {
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
                                agencyId={agencyId}
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
                                agencyId={agencyId}
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
                        agencyId={agencyId}
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

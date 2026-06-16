'use client'

import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/errors'
import { getMessage } from '@/lib/messages/get-message'
import { MessageCode } from '@/lib/messages/codes'
import { useCreateConsultationRequest } from '@/services/consultation-requests/consultation-requests.queries'
import {
    createConsultationRequestSchema,
    mapConsultationRequestFieldErrors,
} from '@/services/consultation-requests/consultation-requests.schema'
import {
    CONSULTATION_INQUIRY_LABELS,
    CONSULTATION_INQUIRY_TYPES,
    CONSULTATION_TITLES,
    type ConsultationInquiryType,
    type ConsultationTitle,
} from '@/services/consultation-requests/consultation-requests.types'
import type { HomepagePage } from '@/data/homepage'
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import { getFooterContactColumnItems } from '@/lib/homepage/footer-contact'
import { Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import { FormEvent, useState, type ReactNode } from 'react'
import { toast } from 'sonner'

const inputClass =
    'mt-2 w-full border-b border-[#87909a] bg-transparent px-3 py-2 min-h-[44px] text-base text-[#1A1C1E] outline-none transition placeholder:text-[#a0a4a8] focus:border-[#00292C]'

const selectClass = `${inputClass} appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10`

const chevronBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`

const labelClass =
    'block text-xs font-bold uppercase tracking-[1.2px] text-[#707979]'

function Field({
    label,
    htmlFor,
    error,
    children,
}: {
    label: string
    htmlFor: string
    error?: string
    children: ReactNode
}) {
    return (
        <div>
            <label htmlFor={htmlFor} className={labelClass} style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                {label}
            </label>
            {children}
            {error ? (
                <p className='mt-1 text-xs text-[#BA1A1A]' style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                    {error}
                </p>
            ) : null}
        </div>
    )
}

function ContactDetailItem({
    icon,
    href,
    children,
}: {
    icon: ReactNode
    href?: string | null
    children: ReactNode
}) {
    return (
        <li className='flex items-start gap-3 text-[#404849]'>
            {icon}
            {href ? (
                <a
                    href={href}
                    className='hover:text-[#00292C] hover:underline'
                    style={{ fontFamily: 'var(--font-plus-jakarta-sans), sans-serif' }}
                >
                    {children}
                </a>
            ) : (
                <span style={{ fontFamily: 'var(--font-plus-jakarta-sans), sans-serif' }}>{children}</span>
            )}
        </li>
    )
}

const contactItemIcons: Record<'email' | 'phone' | 'location' | 'other', LucideIcon> = {
    email: Mail,
    phone: Phone,
    location: MapPin,
    other: MapPin,
}

type ContactUsPageProps = {
    page?: HomepagePage
}

export default function ContactUsPage({ page: pageFromServer }: ContactUsPageProps) {
    const pageFromStore = useHomepagePageWithFallback()
    const page = pageFromServer ?? pageFromStore
    const contactItems = page ? getFooterContactColumnItems(page.footer) : []
    const { mutateAsync: createConsultationRequest, isPending } = useCreateConsultationRequest()
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFieldErrors({})

        const form = event.currentTarget
        const formData = new FormData(form)
        const raw = {
            name: String(formData.get('name') ?? ''),
            email: String(formData.get('email') ?? ''),
            phone: String(formData.get('phone') ?? ''),
            title: String(formData.get('title') ?? '') as ConsultationTitle,
            inquiry_type: String(formData.get('inquiry_type') ?? '') as ConsultationInquiryType,
            description: String(formData.get('description') ?? ''),
        }

        const parsed = createConsultationRequestSchema.safeParse(raw)
        if (!parsed.success) {
            const nextErrors = mapConsultationRequestFieldErrors(parsed.error.issues)
            setFieldErrors(nextErrors)

            const errorCount = Object.keys(nextErrors).length
            toast.error(
                getMessage(
                    errorCount === 1
                        ? MessageCode.VALIDATION_FIX_HIGHLIGHTED_FIELD
                        : MessageCode.VALIDATION_FIX_HIGHLIGHTED_FIELDS,
                ),
            )
            return
        }

        try {
            await createConsultationRequest(parsed.data)
            toast.success(getMessage(MessageCode.SUCCESS_CONTACT_SUBMITTED))
            form.reset()
        } catch (error) {
            toast.error(getApiErrorMessage(error, MessageCode.API_CONTACT_SUBMIT_FAILED))
        }
    }

    return (
        <>
            <section className='p-2 sm:p-3 md:p-4 lg:p-5'>
                <div className='rounded-[16px] bg-[url("/images/pages/home/tour-list.png")] bg-cover bg-center bg-no-repeat'>
                    <div className='px-4 pb-12 pt-[120px] text-center text-white sm:px-6 sm:pb-14 sm:pt-36 md:pb-16 md:pt-44 lg:pb-20 lg:pt-48'>
                        <h1
                            className='mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl xl:text-[45px]'
                            style={{ fontFamily: 'var(--font-hanken-grotesk), sans-serif' }}
                        >
                            Get in touch
                        </h1>
                        <p
                            className='mx-auto mt-4 max-w-[640px] text-sm leading-7 text-white/90 sm:text-base xl:text-lg'
                            style={{ fontFamily: 'var(--font-plus-jakarta-sans), sans-serif' }}
                        >
                            Share your travel plans or questions. Our team will review your consultation request and
                            respond as soon as possible.
                        </p>
                    </div>
                </div>
            </section>

            <main className='bg-[#F7F8FA] pb-20 pt-4 sm:pt-6'>
                <div className='agency-container'>
                    <div className='mx-auto grid max-w-[1182px] gap-10 px-[15px] lg:grid-cols-[340px_1fr] lg:gap-16'>
                    <aside className='space-y-6'>
                        <div className='border border-[#C0C8C9] bg-white p-6'>
                            <h2
                                className='text-xl font-semibold text-[#00292C]'
                                style={{ fontFamily: 'var(--font-hanken-grotesk), sans-serif' }}
                            >
                                Contact details
                            </h2>
                            <ul className='mt-5 space-y-4'>
                                {contactItems.map((item, index) => {
                                    const Icon = contactItemIcons[item.kind]

                                    return (
                                        <ContactDetailItem
                                            key={`${item.label}-${index}`}
                                            icon={<Icon className='mt-1 h-4 w-4 shrink-0 text-[#00292C]' />}
                                            href={item.href}
                                        >
                                            {item.label}
                                        </ContactDetailItem>
                                    )
                                })}
                            </ul>
                        </div>

                        <div className='border border-[#D5DADD] bg-[#EEF1F3] p-6'>
                            <p
                                className='text-sm leading-6 text-[#404849]'
                                style={{ fontFamily: 'var(--font-plus-jakarta-sans), sans-serif' }}
                            >
                                Typical response time is within 24–48 hours on business days.
                            </p>
                        </div>
                    </aside>

                    <section className='border border-[#C0C8C9] bg-white p-6 sm:p-8 lg:p-10'>
                        <h2
                            className='text-2xl font-semibold text-[#00292C]'
                            style={{ fontFamily: 'var(--font-hanken-grotesk), sans-serif' }}
                        >
                            Send a consultation request
                        </h2>
                        <p
                            className='mt-2 text-sm text-[#404849]'
                            style={{ fontFamily: 'var(--font-plus-jakarta-sans), sans-serif' }}
                        >
                            Fields marked with * are required.
                        </p>

                        <form onSubmit={handleSubmit} className='mt-8 space-y-6' noValidate>
                            <div className='grid gap-6 sm:grid-cols-2'>
                                <Field label='Full Name *' htmlFor='contact-name' error={fieldErrors.name}>
                                    <input
                                        id='contact-name'
                                        name='name'
                                        type='text'
                                        placeholder='Your full name'
                                        aria-invalid={Boolean(fieldErrors.name)}
                                        className={inputClass}
                                        style={{ fontFamily: 'var(--font-plus-jakarta-sans), sans-serif' }}
                                    />
                                </Field>
                                <Field label='Email *' htmlFor='contact-email' error={fieldErrors.email}>
                                    <input
                                        id='contact-email'
                                        name='email'
                                        type='email'
                                        placeholder='you@example.com'
                                        aria-invalid={Boolean(fieldErrors.email)}
                                        className={inputClass}
                                        style={{ fontFamily: 'var(--font-plus-jakarta-sans), sans-serif' }}
                                    />
                                </Field>
                            </div>

                            <div className='grid gap-6 sm:grid-cols-2'>
                                <Field label='Phone *' htmlFor='contact-phone' error={fieldErrors.phone}>
                                    <input
                                        id='contact-phone'
                                        name='phone'
                                        type='tel'
                                        placeholder='+92 300 1234567'
                                        aria-invalid={Boolean(fieldErrors.phone)}
                                        className={inputClass}
                                        style={{ fontFamily: 'var(--font-plus-jakarta-sans), sans-serif' }}
                                    />
                                </Field>
                                <Field label='Inquiry Type *' htmlFor='contact-inquiry-type' error={fieldErrors.inquiry_type}>
                                    <select
                                        id='contact-inquiry-type'
                                        name='inquiry_type'
                                        defaultValue=''
                                        aria-invalid={Boolean(fieldErrors.inquiry_type)}
                                        className={selectClass}
                                        style={{ backgroundImage: chevronBg, fontFamily: 'var(--font-plus-jakarta-sans), sans-serif' }}
                                    >
                                        <option value='' disabled>
                                            Select inquiry type
                                        </option>
                                        {CONSULTATION_INQUIRY_TYPES.map((type) => (
                                            <option key={type} value={type}>
                                                {CONSULTATION_INQUIRY_LABELS[type]}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <Field label='Subject *' htmlFor='contact-title' error={fieldErrors.title}>
                                <select
                                    id='contact-title'
                                    name='title'
                                    defaultValue=''
                                    aria-invalid={Boolean(fieldErrors.title)}
                                    className={selectClass}
                                    style={{ backgroundImage: chevronBg, fontFamily: 'var(--font-plus-jakarta-sans), sans-serif' }}
                                >
                                    <option value='' disabled>
                                        Select a subject
                                    </option>
                                    {CONSULTATION_TITLES.map((title) => (
                                        <option key={title} value={title}>
                                            {title}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field label='Message *' htmlFor='contact-description' error={fieldErrors.description}>
                                <textarea
                                    id='contact-description'
                                    name='description'
                                    rows={5}
                                    placeholder='Tell us about your trip or question...'
                                    aria-invalid={Boolean(fieldErrors.description)}
                                    className={`${inputClass} min-h-[120px] resize-y`}
                                    style={{ fontFamily: 'var(--font-plus-jakarta-sans), sans-serif' }}
                                />
                            </Field>

                            <div className='flex justify-end pt-2'>
                                <Button
                                    type='submit'
                                    disabled={isPending}
                                    className='min-h-[52px] min-w-[200px] rounded-none bg-[#00292C] px-8 text-xs font-semibold uppercase tracking-[1.2px] text-white hover:bg-[#043942] disabled:opacity-70'
                                    style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
                                >
                                    {isPending ? 'Sending...' : 'Send Message'}
                                </Button>
                            </div>
                        </form>
                    </section>
                    </div>
                </div>
            </main>
        </>
    )
}

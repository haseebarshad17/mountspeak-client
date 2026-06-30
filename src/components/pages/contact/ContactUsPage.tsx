'use client'

import { Button } from '@/components/ui/button'
import { PageHeroBanner, PAGE_HERO_CONTENT_CLASS } from '@/components/ui/page-hero-banner'
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
import { HP_THEME_INPUT_FOCUS_CLASS, HP_THEME_TEXT_CLASS } from '@/data/homepage'
import { useHeroBackgroundImage } from '@/hooks/useHeroBackgroundImage'
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import { useResolvedAgencyId } from '@/hooks/useResolvedAgencyId'
import { getFooterContactColumnItems } from '@/lib/homepage/footer-contact'
import { cn } from '@/lib/utils/clsxUtils'
import { Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import { FormEvent, useState, type ReactNode } from 'react'
import { toast } from 'sonner'

const FORM_VALUE_CLASS = 'text-[#161b1d]'

const inputClass = cn(
    'mt-1 w-full border-b border-[#6B7280] bg-transparent px-3 py-2 min-h-[40px] text-base outline-none transition',
    FORM_VALUE_CLASS,
    'placeholder:text-[#a0a4a8]',
    HP_THEME_INPUT_FOCUS_CLASS,
)

const selectClass = cn(
    inputClass,
    'appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10',
    'invalid:text-[#a0a4a8] valid:text-[#161b1d]',
)

const chevronBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`

const contactCardClassName = 'rounded-xl border border-[#C0C8C9] bg-white p-6 sm:p-8'

const labelClass =
    'block text-xs font-bold uppercase tracking-[1.2px] text-[#2f3640]'

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
            <label htmlFor={htmlFor} className={labelClass}>
                {label}
            </label>
            {children}
            {error ? (
                <p className='mt-1 text-xs text-[#BA1A1A]'>
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
                    className='text-[#404849] hover:underline'
                >
                    {children}
                </a>
            ) : (
                <span>{children}</span>
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
    const backgroundImage = useHeroBackgroundImage()
    const contactItems = page ? getFooterContactColumnItems(page.footer) : []
    const { mutateAsync: createConsultationRequest, isPending } = useCreateConsultationRequest()
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const { resolvedAgencyId, isAgencySite, isReady } = useResolvedAgencyId()

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFieldErrors({})

        if (!isReady) {
            return
        }

        if (isAgencySite && !resolvedAgencyId) {
            toast.error(getMessage(MessageCode.BOOKING_MISSING_AGENCY))
            return
        }

        const form = event.currentTarget
        const formData = new FormData(form)
        const raw = {
            name: String(formData.get('name') ?? ''),
            email: String(formData.get('email') ?? ''),
            phone: String(formData.get('phone') ?? ''),
            title: String(formData.get('title') ?? '') as ConsultationTitle,
            inquiry_type: String(formData.get('inquiry_type') ?? '') as ConsultationInquiryType,
            description: String(formData.get('description') ?? ''),
            ...(resolvedAgencyId ? { agency_id: resolvedAgencyId } : {}),
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
            <PageHeroBanner backgroundImage={backgroundImage} fixedHeight>
                <div className={PAGE_HERO_CONTENT_CLASS}>
                    <h1
                        className='mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl xl:text-[45px]'
                    >
                        Get in touch
                    </h1>
                    <p
                        className='mx-auto mt-4 max-w-[640px] text-sm leading-6 text-white/90 sm:text-base xl:text-lg'
                    >
                        Share your travel plans or questions. Our team will review your consultation request and
                        respond as soon as possible.
                    </p>
                </div>
            </PageHeroBanner>

            <main className='pb-12 pt-10 sm:pb-20 sm:pt-16 lg:pt-20'>
                <div className='agency-container'>
                    <div className='mx-auto grid max-w-[1182px] gap-6 sm:gap-8 lg:grid-cols-[340px_1fr] lg:gap-16'>
                        <aside className='space-y-4 sm:space-y-6'>
                            <div className={contactCardClassName}>                                <h2
                                className={cn('text-xl font-semibold', HP_THEME_TEXT_CLASS)}
                            >
                                Contact details
                            </h2>
                                <ul className='mt-5 space-y-4'>
                                    {contactItems.map((item, index) => {
                                        const Icon = contactItemIcons[item.kind]

                                        return (
                                            <ContactDetailItem
                                                key={`${item.label}-${index}`}
                                                icon={<Icon className={cn('mt-1 h-4 w-4 shrink-0', HP_THEME_TEXT_CLASS)} />}
                                                href={item.href}
                                            >
                                                {item.label}
                                            </ContactDetailItem>
                                        )
                                    })}
                                </ul>
                            </div>

                            <div className='rounded-xl border border-[#D5DADD] bg-[#EEF1F3] p-6 sm:p-8'>                                <p
                                className='text-sm leading-6 text-[#404849]'
                            >
                                Typical response time is within 24–48 hours on business days.
                            </p>
                            </div>
                        </aside>

                        <section className={cn(contactCardClassName, 'lg:p-10')}>                            <h2
                            className={cn('text-2xl font-semibold', HP_THEME_TEXT_CLASS)}
                        >
                            Send a consultation request
                        </h2>
                            <p
                                className='mt-2 text-sm text-[#404849]'
                            >
                                Fields marked with * are required.
                            </p>

                            <form onSubmit={handleSubmit} className='mt-6 space-y-6 sm:mt-8' noValidate>                                <div className='grid gap-6 sm:grid-cols-2'>
                                <Field label='Full Name *' htmlFor='contact-name' error={fieldErrors.name}>
                                    <input
                                        id='contact-name'
                                        name='name'
                                        type='text'
                                        placeholder='Full Name'
                                        aria-invalid={Boolean(fieldErrors.name)}
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label='Email *' htmlFor='contact-email' error={fieldErrors.email}>
                                    <input
                                        id='contact-email'
                                        name='email'
                                        type='email'
                                        placeholder='example@gmail.com'
                                        aria-invalid={Boolean(fieldErrors.email)}
                                        className={inputClass}
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
                                        />
                                    </Field>
                                    <Field label='Inquiry Type *' htmlFor='contact-inquiry-type' error={fieldErrors.inquiry_type}>
                                        <select
                                            id='contact-inquiry-type'
                                            name='inquiry_type'
                                            defaultValue=''
                                            required
                                            aria-invalid={Boolean(fieldErrors.inquiry_type)}
                                            className={selectClass}
                                            style={{ backgroundImage: chevronBg }}
                                        >
                                            <option value='' disabled hidden>
                                                Select inquiry type
                                            </option>                                            {CONSULTATION_INQUIRY_TYPES.map((type) => (
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
                                        required
                                        aria-invalid={Boolean(fieldErrors.title)}
                                        className={selectClass}
                                        style={{ backgroundImage: chevronBg }}
                                    >
                                        <option value='' disabled hidden>
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
                                    />
                                </Field>

                                <div className='flex justify-end pt-2'>
                                    <Button
                                        type='submit'
                                        loading={isPending}
                                        loadingText='Sending...'
                                        className='min-w-[200px]'
                                    >
                                        Send Message
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

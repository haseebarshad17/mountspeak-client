'use client'

import { Button } from '@/components/ui/button'
import { PageHeroBanner, PAGE_HERO_CONTENT_CLASS } from '@/components/ui/page-hero-banner'
import {
    marketingFormInputClass,
    marketingFormPanelClassName,
    marketingFormRowClass,
    marketingFormTextareaClass,
    MarketingFormField,
} from '@/components/forms/marketing-form'
import { BookingFormSelect } from '@/components/pages/marketing/home/BookingFormSelect'
import { getApiErrorMessage } from '@/lib/api/errors'
import { getMessage } from '@/lib/messages/get-message'
import { MessageCode } from '@/lib/messages/codes'
import { useCreateConsultationRequest } from '@/services/consultation-requests/consultation-requests.queries'
import {
    createConsultationRequestSchema,
    mapConsultationRequestFieldErrors,
} from '@/services/consultation-requests/consultation-requests.schema'
import {
    getConsultationInquiryOptions,
    getConsultationTitleOptions,
    type ConsultationInquiryType,
    type ConsultationTitle,
} from '@/services/consultation-requests/consultation-requests.types'
import type { HomepagePage } from '@/data/homepage'
import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE, HP_THEME_TEXT_CLASS, STATIC_UI_COLORS } from '@/data/homepage'
import { useHeroBackgroundImage } from '@/hooks/useHeroBackgroundImage'
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import { useSiteListingCopy } from '@/hooks/useTourOrPackageCopy'
import { useResolvedAgencyId } from '@/hooks/useResolvedAgencyId'
import { useAppSelector } from '@/store/hooks'
import { getFooterContactColumnItems } from '@/lib/homepage/footer-contact'
import { cn } from '@/lib/utils/clsxUtils'
import { Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import { FormEvent, useMemo, useState, type ReactNode } from 'react'
import { toast } from 'sonner'

const contactCardClassName = 'rounded-xl border border-[#C0C8C9] bg-white p-6 sm:p-8'

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
                    className='break-words text-[#404849] hover:underline'
                >
                    {children}
                </a>
            ) : (
                <span className='break-words'>{children}</span>
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
    const [inquiryType, setInquiryType] = useState('')
    const [title, setTitle] = useState('')
    const { resolvedAgencyId, isAgencySite, isReady } = useResolvedAgencyId()
    const { isUmrahSite, isMultiSpec } = useSiteListingCopy()
    const usesUmrahInquiryForm = isUmrahSite && !isMultiSpec
    const inquiryOptions = useMemo(() => getConsultationInquiryOptions(usesUmrahInquiryForm), [usesUmrahInquiryForm])
    const titleOptions = useMemo(() => getConsultationTitleOptions(usesUmrahInquiryForm), [usesUmrahInquiryForm])
    const errorColor = STATIC_UI_COLORS.error

    const clearFieldError = (key: string) => {
        setFieldErrors((prev) => {
            if (!prev[key]) return prev
            const next = { ...prev }
            delete next[key]
            return next
        })
    }

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
            setInquiryType('')
            setTitle('')
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

            <main className='overflow-x-hidden pb-12 pt-10 sm:pb-20 sm:pt-16 lg:pt-20'>
                <div className='agency-container min-w-0'>
                    <div className='mx-auto grid min-w-0 max-w-[1182px] gap-6 sm:gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16'>
                        <aside className='min-w-0 space-y-4 sm:space-y-6'>
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

                        <section className={cn(contactCardClassName, 'min-w-0 lg:p-10')}>
                            <h2 className={cn('text-2xl font-semibold', HP_THEME_TEXT_CLASS)}>
                                Send a consultation request
                            </h2>
                            <p className='mt-2 font-roboto text-base leading-6 text-[#404849]'>
                                Fields marked with * are required.
                            </p>

                            <div className={cn('mt-5 sm:mt-8', marketingFormPanelClassName)}>
                                <form
                                    onSubmit={handleSubmit}
                                    className='flex w-full min-w-0 flex-col gap-3 sm:gap-4'
                                    noValidate
                                >
                                <div className={marketingFormRowClass}>
                                    <MarketingFormField label='Full name *' error={fieldErrors.name} errorColor={errorColor}>
                                        <input
                                            id='contact-name'
                                            name='name'
                                            type='text'
                                            placeholder='Full name'
                                            aria-invalid={Boolean(fieldErrors.name)}
                                            className={marketingFormInputClass}
                                        />
                                    </MarketingFormField>
                                    <MarketingFormField label='Email *' error={fieldErrors.email} errorColor={errorColor}>
                                        <input
                                            id='contact-email'
                                            name='email'
                                            type='email'
                                            placeholder='example@gmail.com'
                                            aria-invalid={Boolean(fieldErrors.email)}
                                            className={marketingFormInputClass}
                                        />
                                    </MarketingFormField>
                                </div>

                                <div className={marketingFormRowClass}>
                                    <MarketingFormField label='Phone *' error={fieldErrors.phone} errorColor={errorColor}>
                                        <input
                                            id='contact-phone'
                                            name='phone'
                                            type='tel'
                                            placeholder='+92 300 1234567'
                                            aria-invalid={Boolean(fieldErrors.phone)}
                                            className={marketingFormInputClass}
                                        />
                                    </MarketingFormField>
                                    <MarketingFormField
                                        label='Inquiry type *'
                                        error={fieldErrors.inquiry_type}
                                        errorColor={errorColor}
                                    >
                                        <BookingFormSelect
                                            name='inquiry_type'
                                            value={inquiryType}
                                            onChange={(next) => {
                                                setInquiryType(next)
                                                clearFieldError('inquiry_type')
                                            }}
                                            placeholder='Select inquiry type'
                                            options={inquiryOptions}
                                            aria-label='Inquiry type'
                                        />
                                    </MarketingFormField>
                                </div>

                                <MarketingFormField label='Subject *' error={fieldErrors.title} errorColor={errorColor}>
                                    <BookingFormSelect
                                        name='title'
                                        value={title}
                                        onChange={(next) => {
                                            setTitle(next)
                                            clearFieldError('title')
                                        }}
                                        placeholder='Select a subject'
                                        options={titleOptions}
                                        aria-label='Subject'
                                    />
                                </MarketingFormField>

                                <MarketingFormField
                                    label='Message *'
                                    className='block w-full'
                                    error={fieldErrors.description}
                                    errorColor={errorColor}
                                >
                                    <textarea
                                        id='contact-description'
                                        name='description'
                                        rows={3}
                                        placeholder='Tell us about your trip or question...'
                                        aria-invalid={Boolean(fieldErrors.description)}
                                        className={marketingFormTextareaClass}
                                    />
                                </MarketingFormField>

                                <Button
                                    type='submit'
                                    variant='default'
                                    loading={isPending}
                                    loadingText='Sending...'
                                    style={HP_THEME_BTN_STYLE}
                                    className={cn('w-full', HP_THEME_BTN_CLASS)}
                                >
                                    Send Message
                                </Button>
                                </form>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
}

'use client'

import { Calendar } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { FormEvent, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { QuantityStepper } from '@/components/pages/booking/QuantityStepper'
import { BookingEmailOtpGate } from '@/components/pages/booking/steps/BookingEmailOtpGate'
import { BookingFormSelect } from '@/components/pages/marketing/home/BookingFormSelect'
import {
    bookingRequestSchema,
    getTodayDateInputValue,
    MAX_BOOKING_REQUEST_SEATS,
} from '@/components/pages/marketing/home/booking-request.validation'
import {
    marketingFormInputClass,
    marketingFormPanelClassName,
    marketingFormRowClass,
    marketingFormTextareaClass,
    MarketingFormField,
} from '@/components/forms/marketing-form'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'
import { getMessage, mapZodIssuesToFieldErrors } from '@/lib/messages/get-message'
import { cn } from '@/lib/utils/clsxUtils'
import { useBookingRequestEmailGate } from '@/hooks/useBookingRequestEmailGate'
import {
    INTERNATIONAL_INQUIRY_SECTION_INTRO,
    INTERNATIONAL_INQUIRY_SECTION_TITLE,
    PACKAGE_BOOKING_REQUEST_SECTION_ID,
} from '@/lib/tours/tour-inquiry-cta'
import {
    BOOKING_REQUEST_CATEGORIES,
    BOOKING_REQUEST_CATEGORY_LABELS,
    type BookingRequestCategory,
} from '@/services/booking-requests/booking-requests.types'
import { useCreateBookingRequest } from '@/services/booking-requests/booking-requests.queries'

import type { TourPage } from './tour-page.types'

type PackageBookingRequestSectionProps = {
    page: TourPage
}

function resolveDefaultTravelDate(departureDate?: string | null): string {
    const today = getTodayDateInputValue()
    const candidate = departureDate?.trim()

    if (!candidate || candidate < today) {
        return ''
    }

    return candidate
}

export function PackageBookingRequestSection({ page }: PackageBookingRequestSectionProps) {
    const packageInquiry = page.packageInquiry
    const listingKind = page.listingKind
    const { mutateAsync: createBookingRequest, isPending } = useCreateBookingRequest()
    const pathname = usePathname()
    const returnPath = `${pathname || '/'}#${PACKAGE_BOOKING_REQUEST_SECTION_ID}`
    const {
        resolvedAgencyId,
        isAgencySite,
        isReady,
        requireEmailVerification,
        emailVerified,
        verifiedEmail,
        userId,
        emailRedirectTo,
        handleEmailVerified,
        requireUser,
    } = useBookingRequestEmailGate({ returnPath })

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [maleSeats, setMaleSeats] = useState(0)
    const [femaleSeats, setFemaleSeats] = useState(0)
    const [childSeats, setChildSeats] = useState(0)
    const [travelDate, setTravelDate] = useState(() =>
        resolveDefaultTravelDate(packageInquiry?.departureDate),
    )
    const [category, setCategory] = useState('')
    const dateInputRef = useRef<HTMLInputElement>(null)
    const minTravelDate = getTodayDateInputValue()
    const destination = packageInquiry?.title?.trim() ?? page.heroSection.title
    const showOtpGate =
        requireEmailVerification && !emailVerified && !!resolvedAgencyId && !!emailRedirectTo

    const categoryOptions = useMemo(
        () =>
            BOOKING_REQUEST_CATEGORIES.map((item) => ({
                value: item,
                label: BOOKING_REQUEST_CATEGORY_LABELS[item],
            })),
        [],
    )

    const clearFieldError = (key: string) => {
        setFieldErrors((prev) => {
            if (!prev[key]) return prev
            const next = { ...prev }
            delete next[key]
            return next
        })
    }

    const openDatePicker = () => {
        const input = dateInputRef.current
        if (!input) return

        if (typeof input.showPicker === 'function') {
            try {
                input.showPicker()
                return
            } catch {
                // showPicker can throw if not triggered by a user gesture.
            }
        }

        input.focus()
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        setFieldErrors({})

        if (page.isBookingClosed) return

        if (!isReady) return

        if (isAgencySite && !resolvedAgencyId) {
            toast.error(getMessage(MessageCode.BOOKING_MISSING_AGENCY))
            return
        }

        if (requireEmailVerification && !emailVerified) {
            toast.error('Verify your email to continue')
            return
        }

        const formData = new FormData(form)
        const sessionUser = await requireUser()
        const submitUserId = sessionUser?.id ?? userId
        if (resolvedAgencyId && !submitUserId) {
            toast.error('Verify your email to continue')
            return
        }

        const emailValue =
            (verifiedEmail && emailVerified
                ? verifiedEmail
                : String(formData.get('email') ?? '')
            ).trim().toLowerCase()
        const raw = {
            full_name: String(formData.get('full_name') ?? ''),
            email: emailValue,
            phone: String(formData.get('phone') ?? ''),
            travel_date: travelDate,
            destination,
            male_seat: maleSeats,
            female_seat: femaleSeats,
            child_seat: childSeats,
            category: String(formData.get('category') ?? '') as BookingRequestCategory,
            request_message: String(formData.get('request_message') ?? '').trim(),
        }

        const parsed = bookingRequestSchema.safeParse(raw)
        if (!parsed.success) {
            setFieldErrors(mapZodIssuesToFieldErrors(parsed.error.issues))
            toast.error(getMessage(MessageCode.VALIDATION_FIX_HIGHLIGHTED_FIELDS))
            return
        }

        const packageId = packageInquiry?.packageId
        const payload = {
            ...parsed.data,
            request_message: parsed.data.request_message || undefined,
            ...(resolvedAgencyId ? { agency_id: resolvedAgencyId } : {}),
            ...(submitUserId ? { user_id: submitUserId } : {}),
            ...(listingKind === 'umrah' && packageId
                ? { listing_kind: 'umrah' as const, umrah_plan_id: packageId }
                : {}),
            ...(listingKind === 'international' && packageId
                ? { listing_kind: 'international' as const, international_tour_id: packageId }
                : {}),
        }

        try {
            await createBookingRequest(payload)
            toast.success(getMessage(MessageCode.SUCCESS_BOOKING_REQUEST_SUBMITTED))
            form.reset()
            setMaleSeats(0)
            setFemaleSeats(0)
            setChildSeats(0)
            setTravelDate(resolveDefaultTravelDate(packageInquiry?.departureDate))
            setCategory('')
        } catch (error) {
            toast.error(getApiErrorMessage(error, MessageCode.API_BOOKING_REQUEST_SUBMIT_FAILED))
        }
    }

    return (
        <section
            id={PACKAGE_BOOKING_REQUEST_SECTION_ID}
            className="scroll-mt-24 bg-[#F7F8FA] py-10 sm:py-14 lg:py-20"
            aria-labelledby="package-booking-request-heading"
        >
            <div className="agency-container px-4 sm:px-8 lg:px-16">
                <div className="mx-auto max-w-3xl text-center">
                    <h2
                        id="package-booking-request-heading"
                        className="font-heading text-2xl font-bold text-[#191C1C] sm:text-3xl lg:text-4xl"
                    >
                        {INTERNATIONAL_INQUIRY_SECTION_TITLE}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[#434849] sm:text-base">
                        {INTERNATIONAL_INQUIRY_SECTION_INTRO}
                    </p>
                </div>

                <div className={cn('mx-auto mt-8 max-w-3xl sm:mt-10', marketingFormPanelClassName)}>
                    {page.isBookingClosed ? (
                        <div className="rounded-lg border border-[#E3E8EA] bg-white px-6 py-10 text-center">
                            <p className="text-base font-medium text-[#434849]">
                                Booking is closed for this package. The departure date or booking deadline has passed.
                            </p>
                        </div>
                    ) : (
                    <form
                        className="flex w-full min-w-0 flex-col gap-3 sm:gap-4"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        {showOtpGate && resolvedAgencyId && emailRedirectTo ? (
                            <BookingEmailOtpGate
                                agencyId={resolvedAgencyId}
                                agencySiteUrl={undefined}
                                emailRedirectTo={emailRedirectTo}
                                onVerified={(email) => {
                                    void handleEmailVerified(email)
                                }}
                            />
                        ) : null}

                        <MarketingFormField label="Tour" className="block w-full">
                            <input
                                type="text"
                                value={destination}
                                readOnly
                                className={cn(marketingFormInputClass, 'bg-neutral-50 text-neutral-700')}
                                aria-readonly
                            />
                        </MarketingFormField>

                        <div className={marketingFormRowClass}>
                            <MarketingFormField label="Full name" error={fieldErrors.full_name}>
                                <input
                                    type="text"
                                    name="full_name"
                                    placeholder="Your full name"
                                    required
                                    className={marketingFormInputClass}
                                />
                            </MarketingFormField>
                            <MarketingFormField label="Email" error={fieldErrors.email}>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    required
                                    readOnly={Boolean(emailVerified && verifiedEmail)}
                                    defaultValue={verifiedEmail ?? undefined}
                                    key={verifiedEmail ?? 'email-open'}
                                    className={cn(
                                        marketingFormInputClass,
                                        emailVerified && verifiedEmail ? 'bg-neutral-50 text-neutral-700' : null,
                                    )}
                                />
                            </MarketingFormField>
                        </div>

                        <div className={marketingFormRowClass}>
                            <MarketingFormField label="Phone" error={fieldErrors.phone}>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+92 300 1234567"
                                    required
                                    className={marketingFormInputClass}
                                />
                            </MarketingFormField>
                            <MarketingFormField label="Preferred travel date" error={fieldErrors.travel_date}>
                                <div className="relative min-w-0 w-full">
                                    <input
                                        ref={dateInputRef}
                                        type="date"
                                        name="travel_date"
                                        value={travelDate}
                                        min={minTravelDate}
                                        required
                                        className={cn(
                                            marketingFormInputClass,
                                            'relative block cursor-pointer pr-11',
                                            !travelDate && 'text-transparent',
                                            '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0',
                                        )}
                                        onChange={(event) => {
                                            setTravelDate(event.target.value)
                                            clearFieldError('travel_date')
                                        }}
                                        onClick={openDatePicker}
                                    />
                                    {!travelDate ? (
                                        <span
                                            className="pointer-events-none absolute left-4 top-1/2 max-w-[calc(100%-3.25rem)] -translate-y-1/2 truncate text-sm text-neutral-400"
                                            aria-hidden
                                        >
                                            Select travel date
                                        </span>
                                    ) : null}
                                    <button
                                        type="button"
                                        aria-label="Open calendar"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
                                        onClick={openDatePicker}
                                    >
                                        <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                                    </button>
                                </div>
                            </MarketingFormField>
                        </div>

                        <MarketingFormField label="Category" className="block w-full" error={fieldErrors.category}>
                            <BookingFormSelect
                                name="category"
                                value={category}
                                onChange={(next) => {
                                    setCategory(next)
                                    clearFieldError('category')
                                }}
                                placeholder="Select category"
                                options={categoryOptions}
                                aria-label="Category"
                            />
                        </MarketingFormField>

                        <div className={marketingFormRowClass}>
                            <MarketingFormField label="Male seats" error={fieldErrors.male_seat}>
                                <QuantityStepper
                                    variant="field"
                                    label="Male seats"
                                    value={maleSeats}
                                    max={MAX_BOOKING_REQUEST_SEATS}
                                    onChange={(value) => {
                                        setMaleSeats(value)
                                        clearFieldError('male_seat')
                                        clearFieldError('female_seat')
                                    }}
                                />
                            </MarketingFormField>
                            <MarketingFormField label="Female seats" error={fieldErrors.female_seat}>
                                <QuantityStepper
                                    variant="field"
                                    label="Female seats"
                                    value={femaleSeats}
                                    max={MAX_BOOKING_REQUEST_SEATS}
                                    onChange={(value) => {
                                        setFemaleSeats(value)
                                        clearFieldError('male_seat')
                                        clearFieldError('female_seat')
                                    }}
                                />
                            </MarketingFormField>
                        </div>

                        <MarketingFormField label="Children" className="block w-full" error={fieldErrors.child_seat}>
                            <QuantityStepper
                                variant="field"
                                label="Children"
                                value={childSeats}
                                max={MAX_BOOKING_REQUEST_SEATS}
                                onChange={(value) => {
                                    setChildSeats(value)
                                    clearFieldError('child_seat')
                                }}
                            />
                        </MarketingFormField>

                        <MarketingFormField label="Additional notes" className="block w-full" error={fieldErrors.request_message}>
                            <textarea
                                name="request_message"
                                rows={3}
                                placeholder="Share any preferences, visa status, or questions for the agency."
                                className={marketingFormTextareaClass}
                            />
                        </MarketingFormField>

                        <Button
                            type="submit"
                            variant="default"
                            loading={isPending}
                            loadingText="Submitting request..."
                            shouldScale
                            disabled={Boolean(requireEmailVerification && !emailVerified)}
                            className="w-full"
                            style={{
                                backgroundColor: page.theme.secondaryColor,
                                borderColor: page.theme.secondaryColor,
                            }}
                        >
                            Send booking request
                        </Button>
                    </form>
                    )}
                </div>
            </div>
        </section>
    )
}

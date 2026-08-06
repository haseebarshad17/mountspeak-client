'use client'

import { FormEvent, useMemo, useState, type ReactNode } from 'react'
import { CalendarDays, ChevronLeft, Users } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
    EmailOtpChallenge,
    isBookingEmailVerified,
} from '@/components/auth/EmailOtpChallenge'
import { SeatStepper } from '@/components/booking/SeatStepper'
import type { BookingTourOption } from '@/components/booking/booking-tour.types'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { ClassicPageHero } from '@/components/pages/ClassicPageHero'
import { AgencyLink } from '@/components/links/AgencyLink'
import { FileUploadField } from '@/components/ui/FileUploadField'
import { PhoneNumberInput } from '@/components/ui/PhoneNumberInput'
import {
    calculateBookingPriceBreakdown,
    getAvailableSeats,
    isTourBookingClosed,
} from '@/lib/booking/pricing'
import { getApiErrorMessage } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'
import { getMessage } from '@/lib/messages/get-message'
import { copyAgencyPreviewParams } from '@/lib/templates/preview-template'
import {
    formatCnicInput,
    isValidCnic,
    isValidE164Phone,
} from '@/lib/validation/phone'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import {
    isClassicTemplate,
    primaryButtonClass,
} from '@/lib/templates/chrome'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import { cn } from '@/lib/utils/cn'
import { useOptionalUser } from '@/services/auth/auth.query'
import { useAgencyPaymentAccounts } from '@/services/agency-payment/agency-payment.queries'
import { buildSubmitTourBookingPayload } from '@/services/tour-bookings/bookings.mapper'
import {
    uploadBookingIdCard,
    uploadBookingPaymentScreenshot,
    useSubmitTourBooking,
} from '@/services/tour-bookings/tour-bookings.queries'
import { formatMoney } from '@/services/listings/listings.mappers'
import { isValidAgencyId } from '@/services/specialization/specialization.service'
import type { HomepagePage } from '@/services/agency/agency.types'
import type { AgencySpecializationCapabilities } from '@/services/specialization/specialization.types'

const fieldClass =
    'w-full rounded-lg border-0 bg-[#F5F3F0] px-4 py-3 text-base text-[#1A1F2C] outline-none ring-1 ring-[#E8E4DE] transition placeholder:text-[#9CA3AF] focus:bg-white focus:ring-2 focus:ring-brand/30 sm:text-sm'

const labelClass = 'mb-1.5 block text-sm font-medium text-[#4B5563]'

const MAX_FILE_BYTES = 10 * 1024 * 1024

type DetailsErrors = Partial<
    Record<
        | 'firstName'
        | 'lastName'
        | 'email'
        | 'phone'
        | 'emergencyPhone'
        | 'cnic'
        | 'seats'
        | 'idFront'
        | 'idBack'
        | 'paymentScreenshot'
        | 'form',
        string
    >
>

function FormSection({
    title,
    description,
    children,
}: {
    title: string
    description?: string
    children: ReactNode
}) {
    return (
        <section className="rounded-2xl bg-[#FAFAF8] p-4 ring-1 ring-[#EBE8E3] sm:p-5">
            <div className="mb-4">
                <h3 className="text-[0.9375rem] font-semibold text-[#1A1F2C] sm:text-base">
                    {title}
                </h3>
                {description ? (
                    <p className="mt-0.5 text-sm leading-relaxed text-[#6B7280]">
                        {description}
                    </p>
                ) : null}
            </div>
            {children}
        </section>
    )
}

function BookingStepIndicator({
    step,
    onStepChange,
}: {
    step: 0 | 1
    onStepChange: (step: 0 | 1) => void
}) {
    const steps = ['Traveler details', 'Payment'] as const

    return (
        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-[#F0EDE8] p-1">
            {steps.map((label, index) => {
                const active = step === index
                const stepIndex = index as 0 | 1

                return (
                    <button
                        key={label}
                        type="button"
                        onClick={() => {
                            if (stepIndex === 0) onStepChange(0)
                        }}
                        className={cn(
                            'rounded-xl px-3 py-2.5 text-left transition sm:px-4 sm:py-3',
                            active
                                ? 'bg-white shadow-sm ring-1 ring-[#E8E4DE]'
                                : 'text-[#6B7280] hover:text-[#374151]'
                        )}
                    >
                        <span
                            className={cn(
                                'block text-[11px] font-semibold uppercase tracking-wide',
                                active ? 'text-brand' : 'text-[#9CA3AF]'
                            )}
                        >
                            Step {index + 1}
                        </span>
                        <span
                            className={cn(
                                'mt-0.5 block text-sm font-semibold leading-snug sm:text-[0.9375rem]',
                                active ? 'text-[#1A1F2C]' : 'text-[#6B7280]'
                            )}
                        >
                            {label}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

function TripSummaryCard({
    tour,
    pricing,
    available,
    closed,
}: {
    tour: BookingTourOption
    pricing: ReturnType<typeof calculateBookingPriceBreakdown>
    available: number | null
    closed: boolean
}) {
    const heroImage = resolveThemeAssetUrl(tour.heroImageUrl)

    return (
        <aside className="order-first overflow-hidden rounded-2xl bg-white shadow-[0_2px_20px_rgba(26,31,44,0.08)] ring-1 ring-[#EBE8E3] lg:order-none lg:sticky lg:top-24">
            <div className="flex gap-4 p-4 sm:block sm:p-0">
                {heroImage ? (
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl sm:h-auto sm:w-full sm:rounded-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={heroImage}
                            alt=""
                            className="h-full w-full object-cover sm:aspect-[5/3]"
                        />
                    </div>
                ) : null}

                <div className="min-w-0 flex-1 space-y-3 sm:space-y-0 sm:p-5">
                    <div className="sm:pb-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A8F98]">
                            Your trip
                        </p>
                        <h2 className="mt-1 line-clamp-3 text-base font-semibold leading-snug text-[#1A1F2C] sm:mt-2 sm:text-lg">
                            {tour.title}
                        </h2>
                        {tour.startDate ? (
                            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#6B7280]">
                                <CalendarDays className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
                                {tour.startDate}
                            </p>
                        ) : (
                            <p className="mt-2 text-sm text-[#6B7280]">Dates on request</p>
                        )}
                    </div>

                    <dl className="space-y-2.5 border-t border-[#F0EDE8] pt-3 text-sm sm:pt-4">
                        <div className="flex items-center justify-between gap-3">
                            <dt className="text-[#6B7280]">Per adult</dt>
                            <dd className="font-medium text-[#1A1F2C]">
                                {formatMoney(tour.pricePerSeat, tour.currency)}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <dt className="inline-flex items-center gap-1.5 text-[#6B7280]">
                                <Users className="h-3.5 w-3.5" />
                                Travelers
                            </dt>
                            <dd className="font-medium text-[#1A1F2C]">{pricing.seats}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-t border-[#F0EDE8] pt-3">
                            <dt className="text-base font-semibold text-[#1A1F2C]">Total</dt>
                            <dd className="text-lg font-bold text-brand">
                                {formatMoney(pricing.totalAmount, tour.currency)}
                            </dd>
                        </div>
                    </dl>

                    {available != null ? (
                        <p className="border-t border-[#F0EDE8] pt-3 text-sm text-[#6B7280] sm:pt-4">
                            <span className="font-medium text-[#1A1F2C]">{available}</span>{' '}
                            seat{available === 1 ? '' : 's'} left
                        </p>
                    ) : null}
                    {closed ? (
                        <p className="rounded-lg bg-[#FFF7ED] px-3 py-2 text-sm font-medium text-[#9A3412]">
                            Booking closed for this departure.
                        </p>
                    ) : null}
                </div>
            </div>
        </aside>
    )
}

export function TourBookingWizard({
    page,
    capabilities,
    tour,
    initialAdults = 2,
    initialChildren = 0,
}: {
    page: HomepagePage
    capabilities: AgencySpecializationCapabilities
    tour: BookingTourOption
    initialAdults?: number
    initialChildren?: number
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const variant = useTemplateVariant()
    const classic = isClassicTemplate(variant)
    const { data: user } = useOptionalUser()
    const { mutateAsync: submitBooking, isPending } = useSubmitTourBooking()
    const { data: paymentAccounts = [], isLoading: loadingAccounts } =
        useAgencyPaymentAccounts(
            isValidAgencyId(tour.agencyId) ? tour.agencyId : null,
            true
        )

    const [step, setStep] = useState<0 | 1>(0)
    const [maleSeats, setMaleSeats] = useState(Math.max(1, initialAdults))
    const [femaleSeats, setFemaleSeats] = useState(0)
    const [kidsSeats, setKidsSeats] = useState(Math.max(0, initialChildren))
    const [idFront, setIdFront] = useState<File | null>(null)
    const [idBack, setIdBack] = useState<File | null>(null)
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null)
    const [errors, setErrors] = useState<DetailsErrors>({})
    const [details, setDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        emergencyPhone: '',
        cnic: '',
        note: '',
    })

    const closed = isTourBookingClosed(tour.startDate)
    const available = getAvailableSeats(tour.capacityTotal, tour.confirmedSeats)
    const pricing = useMemo(
        () =>
            calculateBookingPriceBreakdown({
                pricePerSeat: tour.pricePerSeat,
                discountPercent: tour.discountPercent,
                kidsDiscountPercent: tour.kidsDiscountPercent,
                advanceAmountPerSeat: tour.advanceAmountPerSeat,
                maleSeats,
                femaleSeats,
                kidsSeats,
            }),
        [tour, maleSeats, femaleSeats, kidsSeats]
    )

    const bookingEmail = (user?.email || details.email).trim()
    const emailVerified = isBookingEmailVerified(user?.email, bookingEmail)

    function requireVerifiedEmail() {
        if (emailVerified) return true
        toast.message(getMessage(MessageCode.BOOKING_EMAIL_VERIFY_REQUIRED))
        return false
    }

    function validateDetails(): DetailsErrors {
        const next: DetailsErrors = {}

        if (details.firstName.trim().length < 2) {
            next.firstName = getMessage(MessageCode.BOOKING_FIRST_NAME_MIN)
        }
        if (details.lastName.trim().length < 2) {
            next.lastName = getMessage(MessageCode.BOOKING_LAST_NAME_MIN)
        }
        if (!emailVerified) {
            next.email = getMessage(MessageCode.BOOKING_EMAIL_VERIFY_REQUIRED)
        }
        if (!details.phone.trim()) {
            next.phone = 'Phone number is required.'
        } else if (!isValidE164Phone(details.phone)) {
            next.phone = 'Enter a valid phone number for the selected country.'
        }
        if (!details.emergencyPhone.trim()) {
            next.emergencyPhone = 'Emergency phone is required.'
        } else if (!isValidE164Phone(details.emergencyPhone)) {
            next.emergencyPhone =
                'Enter a valid emergency phone for the selected country.'
        }
        if (!isValidCnic(details.cnic)) {
            next.cnic = getMessage(MessageCode.BOOKING_CNIC_INVALID)
        }
        if (maleSeats + femaleSeats < 1) {
            next.seats = getMessage(MessageCode.BOOKING_SEAT_REQUIRED)
        }
        if (closed) {
            next.form = getMessage(MessageCode.BOOKING_CLOSED)
        } else if (available != null && pricing.seats > available) {
            next.form =
                available === 1
                    ? 'Only 1 seat left for this departure.'
                    : `Only ${available} seats left for this departure.`
        }
        if (!idFront) {
            next.idFront = getMessage(MessageCode.BOOKING_ID_CARD_FRONT_REQUIRED)
        } else if (idFront.size > MAX_FILE_BYTES) {
            next.idFront = getMessage(MessageCode.BOOKING_ID_CARD_SIZE)
        }
        if (!idBack) {
            next.idBack = getMessage(MessageCode.BOOKING_ID_CARD_BACK_REQUIRED)
        } else if (idBack.size > MAX_FILE_BYTES) {
            next.idBack = getMessage(MessageCode.BOOKING_ID_CARD_SIZE)
        }

        return next
    }

    function onContinueDetails(event: FormEvent) {
        event.preventDefault()
        if (!requireVerifiedEmail()) return
        const nextErrors = validateDetails()
        setErrors(nextErrors)
        if (Object.keys(nextErrors).length > 0) {
            toast.error('Please fix the highlighted fields.')
            return
        }
        setStep(1)
    }

    async function onSubmitPayment(event: FormEvent) {
        event.preventDefault()
        if (!requireVerifiedEmail()) return

        const detailErrors = validateDetails()
        if (Object.keys(detailErrors).length > 0) {
            setErrors(detailErrors)
            toast.error('Please fix the highlighted fields.')
            setStep(0)
            return
        }

        const paymentErrors: DetailsErrors = {}
        if (!paymentScreenshot) {
            paymentErrors.paymentScreenshot = getMessage(
                MessageCode.BOOKING_PAYMENT_SCREENSHOT_REQUIRED
            )
        } else if (paymentScreenshot.size > MAX_FILE_BYTES) {
            paymentErrors.paymentScreenshot = getMessage(
                MessageCode.BOOKING_PAYMENT_SCREENSHOT_SIZE
            )
        }
        if (Object.keys(paymentErrors).length > 0) {
            setErrors(paymentErrors)
            toast.error('Please fix the highlighted fields.')
            return
        }

        if (!isValidAgencyId(tour.agencyId)) {
            toast.error(getMessage(MessageCode.BOOKING_MISSING_AGENCY))
            return
        }
        if (!bookingEmail) {
            toast.error(getMessage(MessageCode.BOOKING_EMAIL_VERIFY_REQUIRED))
            return
        }

        try {
            const bookingId = crypto.randomUUID()
            const [idCardFrontPath, idCardBackPath, screenshotPath] =
                await Promise.all([
                    uploadBookingIdCard(tour.agencyId, bookingId, 'front', idFront!),
                    uploadBookingIdCard(tour.agencyId, bookingId, 'back', idBack!),
                    uploadBookingPaymentScreenshot(
                        tour.agencyId,
                        bookingId,
                        paymentScreenshot!
                    ),
                ])

            await submitBooking(
                buildSubmitTourBookingPayload({
                    bookingId,
                    tourId: tour.id,
                    name: `${details.firstName} ${details.lastName}`.trim(),
                    email: bookingEmail,
                    phone: details.phone,
                    emergencyPhone: details.emergencyPhone,
                    cnic: details.cnic,
                    maleSeats,
                    femaleSeats,
                    kidsSeats,
                    notes: details.note,
                    screenshotPath,
                    idCardFrontPath,
                    idCardBackPath,
                })
            )

            toast.success('Booking submitted for review')
            const params = new URLSearchParams()
            copyAgencyPreviewParams(params, searchParams)
            const q = params.toString()
            router.push(q ? `/account/bookings?${q}` : '/account/bookings')
        } catch (error) {
            toast.error(getApiErrorMessage(error, MessageCode.API_BOOKING_SUBMIT_FAILED))
        }
    }

    return (
        <>
            <SiteHeader
                page={page}
                capabilities={capabilities}
                overlay={classic}
            />
            <main className="site-bg">
                {classic ? (
                    <ClassicPageHero
                        eyebrow="Booking"
                        title={`Book ${tour.title}`}
                        subtitle="Domestic tour checkout — traveler details, then advance payment."
                        align="left"
                        size="default"
                        imageSrc={
                            resolveThemeAssetUrl(
                                page.sections?.hero?.backgroundImages?.[0]
                            ) ||
                            resolveThemeAssetUrl(page.sections?.hero?.backgroundImage) ||
                            tour.heroImageUrl
                        }
                    />
                ) : null}
                <div
                    className={cn(
                        classic
                            ? 'section-spacing section-spacing-top bg-[#FAF8F5]'
                            : 'min-h-screen bg-[#FAF8F5] py-5 sm:py-8 md:py-12'
                    )}
                >
                    <div className="site-container max-w-6xl">
                        <AgencyLink
                            href={`/tours/${tour.slug}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-[#6B7280] transition hover:text-[#1A1F2C]"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back to tour
                        </AgencyLink>

                        {!classic ? (
                            <div className="mt-5 max-w-2xl">
                                <h1 className="text-2xl font-bold leading-tight tracking-tight text-[#1A1F2C] sm:text-3xl">
                                    Complete your booking
                                </h1>
                                <p className="mt-2 text-sm leading-relaxed text-[#6B7280] sm:text-base">
                                    {tour.title}
                                </p>
                            </div>
                        ) : null}

                        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                            <TripSummaryCard
                                tour={tour}
                                pricing={pricing}
                                available={available}
                                closed={closed}
                            />

                            <div className="order-last min-w-0 lg:order-first">
                                <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_20px_rgba(26,31,44,0.08)] ring-1 ring-[#EBE8E3]">
                                    <div className="border-b border-[#F0EDE8] px-4 py-4 sm:px-6 sm:py-5">
                                        <BookingStepIndicator
                                            step={step}
                                            onStepChange={setStep}
                                        />
                                    </div>

                                    <div className="px-4 py-5 sm:px-6 sm:py-6">
                                    {step === 0 ? (
                                        <form
                                            onSubmit={onContinueDetails}
                                            className="space-y-4"
                                        >
                                            <FormSection
                                                title="Personal details"
                                                description="Tell us who is traveling on this booking."
                                            >
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <label className="block min-w-0">
                                                        <span className={labelClass}>
                                                            First name
                                                        </span>
                                                        <input
                                                            value={details.firstName}
                                                            onChange={(e) =>
                                                                setDetails((prev) => ({
                                                                    ...prev,
                                                                    firstName: e.target.value,
                                                                }))
                                                            }
                                                            className={cn(
                                                                fieldClass,
                                                                errors.firstName &&
                                                                    'bg-red-50 ring-red-400 focus:ring-red-200'
                                                            )}
                                                            placeholder="e.g. Ali"
                                                        />
                                                        {errors.firstName ? (
                                                            <p className="mt-1.5 text-sm text-red-600">
                                                                {errors.firstName}
                                                            </p>
                                                        ) : null}
                                                    </label>

                                                    <label className="block min-w-0">
                                                        <span className={labelClass}>
                                                            Last name
                                                        </span>
                                                        <input
                                                            value={details.lastName}
                                                            onChange={(e) =>
                                                                setDetails((prev) => ({
                                                                    ...prev,
                                                                    lastName: e.target.value,
                                                                }))
                                                            }
                                                            className={cn(
                                                                fieldClass,
                                                                errors.lastName &&
                                                                    'bg-red-50 ring-red-400 focus:ring-red-200'
                                                            )}
                                                            placeholder="e.g. Khan"
                                                        />
                                                        {errors.lastName ? (
                                                            <p className="mt-1.5 text-sm text-red-600">
                                                                {errors.lastName}
                                                            </p>
                                                        ) : null}
                                                    </label>

                                                    <div className="sm:col-span-2">
                                                        <EmailOtpChallenge
                                                            agencyId={tour.agencyId}
                                                            email={details.email}
                                                            onEmailChange={(email) =>
                                                                setDetails((prev) => ({
                                                                    ...prev,
                                                                    email,
                                                                }))
                                                            }
                                                            className="rounded-xl bg-[#FAFAF8] ring-1 ring-[#EBE8E3]"
                                                            inputClassName={fieldClass}
                                                        />
                                                        {errors.email ? (
                                                            <p className="mt-1.5 text-sm text-red-600">
                                                                {errors.email}
                                                            </p>
                                                        ) : null}
                                                    </div>

                                                    <PhoneNumberInput
                                                        label="Phone"
                                                        required
                                                        value={details.phone}
                                                        onChange={(phone) =>
                                                            setDetails((prev) => ({
                                                                ...prev,
                                                                phone,
                                                            }))
                                                        }
                                                        error={errors.phone}
                                                        placeholder="300 1234567"
                                                        labelClassName={labelClass}
                                                        inputClassName="text-base sm:text-sm"
                                                    />

                                                    <PhoneNumberInput
                                                        label="Emergency phone"
                                                        required
                                                        value={details.emergencyPhone}
                                                        onChange={(emergencyPhone) =>
                                                            setDetails((prev) => ({
                                                                ...prev,
                                                                emergencyPhone,
                                                            }))
                                                        }
                                                        error={errors.emergencyPhone}
                                                        placeholder="300 7654321"
                                                        labelClassName={labelClass}
                                                        inputClassName="text-base sm:text-sm"
                                                    />

                                                    <label className="block min-w-0 sm:col-span-2">
                                                        <span className={labelClass}>CNIC</span>
                                                        <input
                                                            value={details.cnic}
                                                            onChange={(e) =>
                                                                setDetails((prev) => ({
                                                                    ...prev,
                                                                    cnic: formatCnicInput(
                                                                        e.target.value
                                                                    ),
                                                                }))
                                                            }
                                                            className={cn(
                                                                fieldClass,
                                                                errors.cnic &&
                                                                    'bg-red-50 ring-red-400 focus:ring-red-200'
                                                            )}
                                                            placeholder="12345-1234567-1"
                                                            inputMode="numeric"
                                                        />
                                                        {errors.cnic ? (
                                                            <p className="mt-1.5 text-sm text-red-600">
                                                                {errors.cnic}
                                                            </p>
                                                        ) : null}
                                                    </label>

                                                    <label className="block min-w-0 sm:col-span-2">
                                                        <span className={labelClass}>
                                                            Notes{' '}
                                                            <span className="font-normal text-[#9CA3AF]">
                                                                (optional)
                                                            </span>
                                                        </span>
                                                        <textarea
                                                            value={details.note}
                                                            onChange={(e) =>
                                                                setDetails((prev) => ({
                                                                    ...prev,
                                                                    note: e.target.value,
                                                                }))
                                                            }
                                                            className={cn(
                                                                fieldClass,
                                                                'min-h-[100px] resize-y'
                                                            )}
                                                            maxLength={500}
                                                            placeholder="Pickup notes, dietary needs, or other requests"
                                                        />
                                                    </label>
                                                </div>
                                            </FormSection>

                                            <FormSection
                                                title="Travelers"
                                                description="Select seats for adults and children."
                                            >
                                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                                    <SeatStepper
                                                        label="Male"
                                                        value={maleSeats}
                                                        onChange={setMaleSeats}
                                                    />
                                                    <SeatStepper
                                                        label="Female"
                                                        value={femaleSeats}
                                                        onChange={setFemaleSeats}
                                                    />
                                                    <SeatStepper
                                                        label="Children"
                                                        value={kidsSeats}
                                                        onChange={setKidsSeats}
                                                    />
                                                </div>
                                                {errors.seats ? (
                                                    <p className="text-sm text-red-600">
                                                        {errors.seats}
                                                    </p>
                                                ) : null}
                                            </FormSection>

                                            <FormSection
                                                title="Identity documents"
                                                description="Upload clear photos of both sides of your ID card."
                                            >
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <FileUploadField
                                                        label="ID card front"
                                                        file={idFront}
                                                        onChange={setIdFront}
                                                        error={errors.idFront}
                                                        labelClassName={labelClass}
                                                    />
                                                    <FileUploadField
                                                        label="ID card back"
                                                        file={idBack}
                                                        onChange={setIdBack}
                                                        error={errors.idBack}
                                                        labelClassName={labelClass}
                                                    />
                                                </div>
                                            </FormSection>

                                            {errors.form ? (
                                                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
                                                    {errors.form}
                                                </p>
                                            ) : null}

                                            <div className="border-t border-[#F0EDE8] pt-5">
                                                <button
                                                    type="submit"
                                                    className={primaryButtonClass(
                                                        variant,
                                                        'w-full rounded-xl px-6 py-3.5 text-base font-semibold sm:text-sm'
                                                    )}
                                                >
                                                    Continue to payment
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <form
                                            onSubmit={onSubmitPayment}
                                            className="space-y-4"
                                        >
                                            <FormSection title="Payment amount">
                                                <div className="rounded-xl bg-white p-5 ring-1 ring-[#EBE8E3]">
                                                    <p className="text-sm text-[#6B7280]">
                                                        Amount due now
                                                    </p>
                                                    <p className="mt-1 text-3xl font-bold tracking-tight text-brand">
                                                        {formatMoney(
                                                            pricing.advanceAmountDue,
                                                            tour.currency
                                                        )}
                                                    </p>
                                                    {pricing.balanceDue > 0 ? (
                                                        <p className="mt-2 text-sm text-[#6B7280]">
                                                            Balance later:{' '}
                                                            {formatMoney(
                                                                pricing.balanceDue,
                                                                tour.currency
                                                            )}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </FormSection>

                                            <FormSection
                                                title="Agency payment accounts"
                                                description="Transfer the advance to one of the accounts below, then upload your proof."
                                            >
                                                {loadingAccounts ? (
                                                    <p className="text-sm text-[#6B7280]">
                                                        Loading…
                                                    </p>
                                                ) : paymentAccounts.length === 0 ? (
                                                    <p className="rounded-xl bg-[#F9FAFB] px-4 py-3 text-sm leading-relaxed text-[#6B7280]">
                                                        No payment accounts published yet.
                                                        Contact the agency before transferring.
                                                    </p>
                                                ) : (
                                                    <ul className="space-y-3">
                                                        {paymentAccounts.map((account) => (
                                                            <li
                                                                key={`${account.bank}-${account.value}`}
                                                                className="rounded-xl bg-white px-4 py-3.5 ring-1 ring-[#EBE8E3]"
                                                            >
                                                                <p className="text-sm font-semibold text-[#111]">
                                                                    {account.bank}
                                                                    {account.type
                                                                        ? ` · ${account.type}`
                                                                        : ''}
                                                                </p>
                                                                <p className="mt-1 break-all text-sm text-[#374151]">
                                                                    {account.value}
                                                                </p>
                                                                {account.account_title ? (
                                                                    <p className="mt-1 text-sm text-[#6B7280]">
                                                                        {account.account_title}
                                                                    </p>
                                                                ) : null}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </FormSection>

                                            <FormSection title="Upload payment proof">
                                                <FileUploadField
                                                    label="Payment screenshot"
                                                    file={paymentScreenshot}
                                                    onChange={setPaymentScreenshot}
                                                    error={errors.paymentScreenshot}
                                                    hint="Upload transfer proof — PNG or JPG up to 10MB"
                                                    labelClassName={labelClass}
                                                />
                                            </FormSection>

                                            <div className="flex flex-col gap-3 border-t border-[#F0EDE8] pt-5 sm:flex-row">
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(0)}
                                                    className="w-full rounded-xl bg-[#F5F3F0] px-5 py-3.5 text-base font-medium text-[#1A1F2C] transition hover:bg-[#EBE8E3] sm:w-auto sm:text-sm"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isPending}
                                                    className={primaryButtonClass(
                                                        variant,
                                                        'w-full rounded-xl px-6 py-3.5 text-base font-semibold disabled:opacity-60 sm:flex-1 sm:text-sm'
                                                    )}
                                                >
                                                    {isPending
                                                        ? 'Submitting…'
                                                        : 'Submit booking'}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <SiteFooter page={page} agencyId={tour.agencyId} />
        </>
    )
}

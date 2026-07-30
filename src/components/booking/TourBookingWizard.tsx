'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
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
    'w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none placeholder:text-[#999] focus:border-[#111]/25'

const MAX_FILE_BYTES = 10 * 1024 * 1024

type DetailsErrors = Partial<
    Record<
        | 'firstName'
        | 'lastName'
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

    function requireAuth() {
        if (user) return true
        if (!isValidAgencyId(tour.agencyId)) return true
        const host = searchParams.get('host')
        const params = new URLSearchParams()
        params.set('next', `${window.location.pathname}${window.location.search}`)
        if (host) params.set('host', host)
        toast.message(getMessage(MessageCode.BOOKING_EMAIL_VERIFY_REQUIRED))
        router.push(`/login?${params.toString()}`)
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
        if (!requireAuth()) return
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
        if (!requireAuth()) return

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
        if (!user?.email) {
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
                    email: user.email,
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
            const host = searchParams.get('host')
            const params = new URLSearchParams()
            if (host) params.set('host', host)
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
                            ? 'section-spacing section-spacing-top bg-white'
                            : 'min-h-screen py-10 md:py-14'
                    )}
                >
                    <div className="site-container grid gap-8 lg:grid-cols-[1fr_340px]">
                        <div>
                            {!classic ? (
                                <>
                                    <AgencyLink
                                        href={`/tours/${tour.slug}`}
                                        className="text-sm text-[#666] transition hover:text-[#111]"
                                    >
                                        ← Back to tour
                                    </AgencyLink>
                                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111]">
                                        Book {tour.title}
                                    </h1>
                                    <p className="mt-2 text-sm text-[#666]">
                                        Domestic tour checkout — traveler details, then
                                        advance payment.
                                    </p>
                                </>
                            ) : (
                                <AgencyLink
                                    href={`/tours/${tour.slug}`}
                                    className="text-sm text-[#666] transition hover:text-[#111]"
                                >
                                    ← Back to tour
                                </AgencyLink>
                            )}

                        <div className="mt-6 flex gap-6 border-b border-black/10">
                            {(['Details', 'Payment'] as const).map((label, index) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => {
                                        if (index === 0) setStep(0)
                                    }}
                                    className={cn(
                                        'pb-3 text-sm font-medium',
                                        step === index
                                            ? 'border-b-2 border-[#111] text-[#111]'
                                            : 'border-b-2 border-transparent text-[#888]'
                                    )}
                                >
                                    {index + 1}. {label}
                                </button>
                            ))}
                        </div>

                        {step === 0 ? (
                            <form
                                onSubmit={onContinueDetails}
                                className="mt-6 space-y-5 rounded-2xl border border-black/5 bg-white p-5 md:p-7"
                            >
                                <div className="grid gap-4 md:grid-cols-2">
                                    <label className="block min-w-0">
                                        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#888]">
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
                                                errors.firstName && 'border-red-400'
                                            )}
                                            placeholder="e.g. Ali"
                                        />
                                        {errors.firstName ? (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.firstName}
                                            </p>
                                        ) : null}
                                    </label>

                                    <label className="block min-w-0">
                                        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#888]">
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
                                                errors.lastName && 'border-red-400'
                                            )}
                                            placeholder="e.g. Khan"
                                        />
                                        {errors.lastName ? (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.lastName}
                                            </p>
                                        ) : null}
                                    </label>

                                    <PhoneNumberInput
                                        label="Phone"
                                        required
                                        value={details.phone}
                                        onChange={(phone) =>
                                            setDetails((prev) => ({ ...prev, phone }))
                                        }
                                        error={errors.phone}
                                        placeholder="300 1234567"
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
                                    />

                                    <label className="block min-w-0 md:col-span-2">
                                        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#888]">
                                            CNIC
                                        </span>
                                        <input
                                            value={details.cnic}
                                            onChange={(e) =>
                                                setDetails((prev) => ({
                                                    ...prev,
                                                    cnic: formatCnicInput(e.target.value),
                                                }))
                                            }
                                            className={cn(
                                                fieldClass,
                                                errors.cnic && 'border-red-400'
                                            )}
                                            placeholder="12345-1234567-1"
                                            inputMode="numeric"
                                        />
                                        {errors.cnic ? (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.cnic}
                                            </p>
                                        ) : null}
                                    </label>

                                    <label className="block min-w-0 md:col-span-2">
                                        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#888]">
                                            Notes
                                        </span>
                                        <textarea
                                            value={details.note}
                                            onChange={(e) =>
                                                setDetails((prev) => ({
                                                    ...prev,
                                                    note: e.target.value,
                                                }))
                                            }
                                            className={cn(fieldClass, 'min-h-[90px]')}
                                            maxLength={500}
                                            placeholder="Pickup notes, dietary needs, or other requests (optional)"
                                        />
                                    </label>
                                </div>

                                <div>
                                    <div className="flex flex-wrap gap-3">
                                        <SeatStepper
                                            label="Male"
                                            value={maleSeats}
                                            onChange={setMaleSeats}
                                            className="min-w-[11.75rem] flex-[1_0_11.75rem]"
                                        />
                                        <SeatStepper
                                            label="Female"
                                            value={femaleSeats}
                                            onChange={setFemaleSeats}
                                            className="min-w-[11.75rem] flex-[1_0_11.75rem]"
                                        />
                                        <SeatStepper
                                            label="Children"
                                            value={kidsSeats}
                                            onChange={setKidsSeats}
                                            className="min-w-[11.75rem] flex-[1_0_11.75rem]"
                                        />
                                    </div>
                                    {errors.seats ? (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.seats}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FileUploadField
                                        label="ID card front"
                                        file={idFront}
                                        onChange={setIdFront}
                                        error={errors.idFront}
                                    />
                                    <FileUploadField
                                        label="ID card back"
                                        file={idBack}
                                        onChange={setIdBack}
                                        error={errors.idBack}
                                    />
                                </div>

                                {errors.form ? (
                                    <p className="text-sm text-red-600">{errors.form}</p>
                                ) : null}

                                <button
                                    type="submit"
                                    className={primaryButtonClass(
                                        variant,
                                        'rounded-full px-6 py-3 text-sm font-medium'
                                    )}
                                >
                                    Continue to payment
                                </button>
                            </form>
                        ) : (
                            <form
                                onSubmit={onSubmitPayment}
                                className="mt-6 space-y-5 rounded-2xl border border-black/5 bg-white p-5 md:p-7"
                            >
                                <div>
                                    <p className="text-sm text-[#666]">Amount due now</p>
                                    <p className="mt-1 text-2xl font-bold text-[#111]">
                                        {formatMoney(pricing.advanceAmountDue, tour.currency)}
                                    </p>
                                    {pricing.balanceDue > 0 ? (
                                        <p className="mt-1 text-xs text-[#888]">
                                            Balance later:{' '}
                                            {formatMoney(pricing.balanceDue, tour.currency)}
                                        </p>
                                    ) : null}
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-[#111]">
                                        Agency payment accounts
                                    </p>
                                    {loadingAccounts ? (
                                        <p className="mt-2 text-sm text-[#888]">Loading…</p>
                                    ) : paymentAccounts.length === 0 ? (
                                        <p className="mt-2 text-sm text-[#888]">
                                            No payment accounts published yet. Contact the
                                            agency before transferring.
                                        </p>
                                    ) : (
                                        <ul className="mt-3 space-y-2">
                                            {paymentAccounts.map((account) => (
                                                <li
                                                    key={`${account.bank}-${account.value}`}
                                                    className={cn(
                                                        'rounded-xl border border-black/5 px-4 py-3 text-sm',
                                                        classic
                                                            ? 'bg-white'
                                                            : 'bg-[#FAF7F2]'
                                                    )}
                                                >
                                                    <p className="font-semibold text-[#111]">
                                                        {account.bank}
                                                        {account.type
                                                            ? ` · ${account.type}`
                                                            : ''}
                                                    </p>
                                                    <p className="mt-0.5 text-[#333]">
                                                        {account.value}
                                                    </p>
                                                    {account.account_title ? (
                                                        <p className="text-xs text-[#888]">
                                                            {account.account_title}
                                                        </p>
                                                    ) : null}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <FileUploadField
                                    label="Payment screenshot"
                                    file={paymentScreenshot}
                                    onChange={setPaymentScreenshot}
                                    error={errors.paymentScreenshot}
                                    hint="Upload transfer proof — PNG or JPG up to 10MB"
                                />

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(0)}
                                        className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-[#111]"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className={primaryButtonClass(
                                            variant,
                                            'rounded-full px-6 py-2.5 text-sm font-medium disabled:opacity-60'
                                        )}
                                    >
                                        {isPending ? 'Submitting…' : 'Submit booking'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    <aside className="h-fit rounded-2xl border border-black/5 bg-white p-5 shadow-sm lg:sticky lg:top-24">
                        <p className="text-xs font-medium uppercase tracking-wide text-[#888]">
                            Trip summary
                        </p>
                        <h2 className="mt-2 text-lg font-semibold text-[#111]">
                            {tour.title}
                        </h2>
                        <p className="mt-1 text-sm text-[#666]">
                            {tour.startDate || 'Dates on request'}
                        </p>
                        <div className="mt-4 space-y-1.5 border-t border-black/5 pt-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-[#666]">Per adult</span>
                                <span className="font-medium">
                                    {formatMoney(tour.pricePerSeat, tour.currency)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#666]">Travelers</span>
                                <span className="font-medium">{pricing.seats}</span>
                            </div>
                            <div className="flex justify-between pt-2 text-base font-semibold">
                                <span>Total</span>
                                <span>
                                    {formatMoney(pricing.totalAmount, tour.currency)}
                                </span>
                            </div>
                        </div>
                        {available != null ? (
                            <p className="mt-4 text-xs text-[#888]">
                                {available} seat{available === 1 ? '' : 's'} available
                            </p>
                        ) : null}
                        {closed ? (
                            <p className="mt-2 text-xs font-medium text-[#9A3412]">
                                Booking closed for this departure.
                            </p>
                        ) : null}
                    </aside>
                    </div>
                </div>
            </main>
            <SiteFooter page={page} agencyId={tour.agencyId} />
        </>
    )
}

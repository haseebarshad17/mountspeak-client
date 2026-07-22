'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import {
    isTourBookable,
    validateSeatCapacity,
} from '@/lib/booking/tour-booking-rules'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/errors'
import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE } from '@/data/homepage'
import { DEFAULT_AGENCY_ID } from '@/lib/homepage/default-homepage'
import { getMessage } from '@/lib/messages/get-message'
import { MessageCode, isMessageCode } from '@/lib/messages/codes'
import { buildAuthCallbackUrl, getClientSiteUrl } from '@/lib/utils/site-url'
import { cn } from '@/lib/utils/clsxUtils'
import { buildSubmitPackageBookingPayload, buildSubmitTourBookingPayload } from '@/services/tour-bookings/bookings.mapper'
import {
    uploadBookingIdCard,
    uploadBookingPaymentScreenshot,
    useSubmitPackageBooking,
    useSubmitTourBooking,
} from '@/services/tour-bookings/tour-bookings.queries'
import { useAgencyPaymentAccounts } from '@/services/agency-payment/agency-payment.queries'
import { useTrackEvent } from '@/services/events/useTrackEvent'
import { useAppSelector } from '@/store/hooks'
import { selectHomepageAgencyId, selectHomepageSiteUrl, selectIsAgencySite } from '@/store/homepage/homepage.selectors'

import { BookingPageSkeleton } from './BookingPageSkeleton'
import { bookingFormPanelClassName, bookingPageTopPaddingClassName, bookingStepperTopSpacingClassName } from './booking-form-ui'
import { OnboardIntro } from './OnboardIntro'
import { OnboardStepper } from './OnboardStepper'
import type { BookingDetailsForm, BookingTourOption } from './booking.types'
import {
    formatBookingTotalAmount,
    isPackageBookingOption,
    resolveSelectedBookingTour,
    resolveSelectedSlotAvailableSeats,
} from './booking.types'
import {
    clearBookingDraft,
    loadBookingDraft,
    mergeDetailsWithDraft,
    saveBookingDraft,
} from './booking-form-storage'
import { bookingIdCardSchema, bookingPaymentSchema } from './booking.validation'
import { bookingStepsContent } from './content'
import { FinalizeStep } from './steps/FinalizeStep'
import { IdentityStep } from './steps/IdentityStep'
import { useBookingAuth } from './useBookingAuth'

const onboardSteps = ['Details', 'Payment'] as const

const emptyDetails: BookingDetailsForm = {
    firstName: '',
    lastName: '',
    phone: '',
    emergencyPhone: '',
    cnic: '',
    tourId: '',
    slotId: '',
    pickupPointId: '',
    maleSeats: 0,
    femaleSeats: 0,
    kidsSeats: 0,
    note: '',
}

type BookingPageProps = {
    tourOptions: BookingTourOption[]
    lockedTour: BookingTourOption | null
    initialSlotId?: string | null
    isDemoMode?: boolean
    bookingReturnPath?: string
}

export default function BookingPage({
    tourOptions,
    lockedTour,
    initialSlotId = null,
    isDemoMode = false,
    bookingReturnPath = '/booking',
}: BookingPageProps) {
    const [draftReady, setDraftReady] = useState(false)
    const [identityFormKey, setIdentityFormKey] = useState(0)
    const [activeStep, setActiveStep] = useState(0)
    const [isSuccess, setIsSuccess] = useState(false)
    const [details, setDetails] = useState<BookingDetailsForm>(() =>
        mergeDetailsWithDraft(lockedTour?.id, initialSlotId, null),
    )
    const [totalAmount, setTotalAmount] = useState(0)
    const [advanceAmountDue, setAdvanceAmountDue] = useState(0)
    const [balanceDue, setBalanceDue] = useState(0)
    const [idCardFront, setIdCardFront] = useState<File | null>(null)
    const [idCardBack, setIdCardBack] = useState<File | null>(null)
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { mutateAsync: submitTourBooking } = useSubmitTourBooking()
    const { mutateAsync: submitPackageBooking } = useSubmitPackageBooking()
    const { authReady, requireUser, isAuthenticated, setUser } = useBookingAuth({
        skipAuth: isDemoMode,
    })
    const [guestEmailVerified, setGuestEmailVerified] = useState(false)
    const trackEvent = useTrackEvent()
    const agencyId = useAppSelector(selectHomepageAgencyId)
    const homepageSiteUrl = useAppSelector(selectHomepageSiteUrl)
    const isAgencySite = useAppSelector(selectIsAgencySite)
    const { data: paymentAccounts = [], isLoading: paymentAccountsLoading } = useAgencyPaymentAccounts(
        agencyId,
        !isDemoMode && isAgencySite === true,
    )
    const bookingStartedTrackedRef = useRef<string | null>(null)

    const resolvedAgencyId =
        isAgencySite && agencyId && agencyId !== DEFAULT_AGENCY_ID ? agencyId : null
    const requireEmailVerification = !isDemoMode && Boolean(resolvedAgencyId) && !isAuthenticated
    const emailVerified = isAuthenticated || guestEmailVerified

    const emailRedirectTo = useMemo(() => {
        if (!resolvedAgencyId) return null
        const siteUrl = (homepageSiteUrl?.trim() || getClientSiteUrl()).replace(/\/$/, '')
        const callbackUrl = buildAuthCallbackUrl(siteUrl, bookingReturnPath, resolvedAgencyId)
        try {
            const parsed = new URL(callbackUrl)
            parsed.searchParams.set('auth_email', 'otp')
            return parsed.toString()
        } catch {
            return callbackUrl
        }
    }, [bookingReturnPath, homepageSiteUrl, resolvedAgencyId])

    const handleEmailVerified = useCallback(async () => {
        setGuestEmailVerified(true)
        const user = await requireUser()
        if (user) setUser(user)
    }, [requireUser, setUser])

    useEffect(() => {
        const draft = loadBookingDraft()
        if (draft) {
            setDetails(mergeDetailsWithDraft(lockedTour?.id, initialSlotId, draft))
            setActiveStep(draft.activeStep)
            setTotalAmount(draft.totalAmount)
            setAdvanceAmountDue(draft.advanceAmountDue)
            setBalanceDue(draft.balanceDue)
            setIdentityFormKey((key) => key + 1)
        }
        setDraftReady(true)
    }, [initialSlotId, lockedTour?.id])

    useEffect(() => {
        if (isDemoMode || !lockedTour?.id) return
        if (bookingStartedTrackedRef.current === lockedTour.id) return

        bookingStartedTrackedRef.current = lockedTour.id
        trackEvent({
            event_type: 'BOOKING_STARTED',
            path: `/booking?tour=${encodeURIComponent(lockedTour.slug)}`,
            entity_type: 'tour',
            entity_id: lockedTour.id,
            metadata: {
                tour_slug: lockedTour.slug,
                tour_title: lockedTour.title,
            },
        })
    }, [isDemoMode, lockedTour, trackEvent])

    const persistDraft = useCallback(
        (next: {
            details?: BookingDetailsForm
            activeStep?: number
            totalAmount?: number
            advanceAmountDue?: number
            balanceDue?: number
        }) => {
            if (!draftReady) return

            saveBookingDraft({
                details: next.details ?? details,
                activeStep: next.activeStep ?? activeStep,
                totalAmount: next.totalAmount ?? totalAmount,
                advanceAmountDue: next.advanceAmountDue ?? advanceAmountDue,
                balanceDue: next.balanceDue ?? balanceDue,
            })
        },
        [activeStep, advanceAmountDue, balanceDue, details, draftReady, totalAmount],
    )
    const persistDraftRef = useRef(persistDraft)

    useEffect(() => {
        persistDraftRef.current = persistDraft
    }, [persistDraft])


    useEffect(() => {
        if (isDemoMode || !draftReady || !authReady) return
        if (requireEmailVerification && !emailVerified && activeStep !== 0) {
            setActiveStep(0)
            persistDraft({ activeStep: 0 })
        }
    }, [
        isDemoMode,
        draftReady,
        authReady,
        requireEmailVerification,
        emailVerified,
        activeStep,
        persistDraft,
    ])

    const currentContent = bookingStepsContent[activeStep]

    const selectedTour = useMemo(
        () => resolveSelectedBookingTour(lockedTour, details.tourId, tourOptions),
        [details.tourId, lockedTour, tourOptions],
    )

    const handleDetailsChange = useCallback((nextDetails: BookingDetailsForm) => {
        if (!draftReady) return

        setDetails(nextDetails)
        persistDraftRef.current({ details: nextDetails })
    }, [draftReady])

    const handleBack = () => {
        const nextStep = Math.max(activeStep - 1, 0)
        setActiveStep(nextStep)
        persistDraft({ activeStep: nextStep })
    }

    const handleDetailsContinue = (
        nextDetails: BookingDetailsForm,
        pricing: { totalAmount: number; advanceAmountDue: number; balanceDue: number },
    ) => {
        setDetails(nextDetails)
        setTotalAmount(pricing.totalAmount)
        setAdvanceAmountDue(pricing.advanceAmountDue)
        setBalanceDue(pricing.balanceDue)
        setActiveStep(1)
        persistDraft({
            details: nextDetails,
            activeStep: 1,
            totalAmount: pricing.totalAmount,
            advanceAmountDue: pricing.advanceAmountDue,
            balanceDue: pricing.balanceDue,
        })
    }

    const handleSubmit = async () => {
        if (isDemoMode) {
            toast.info(getMessage(MessageCode.BOOKING_DEMO_PREVIEW))
            return
        }

        if (!isAuthenticated && !guestEmailVerified) {
            toast.error(getMessage(MessageCode.BOOKING_EMAIL_VERIFY_REQUIRED))
            return
        }

        if (paymentAccounts.length === 0) {
            toast.error(getMessage(MessageCode.BOOKING_PAYMENT_STEP_INCOMPLETE))
            return
        }

        const paymentParsed = bookingPaymentSchema.safeParse({ paymentScreenshot })

        if (!paymentParsed.success) {
            const issue = paymentParsed.error.issues[0]
            toast.error(
                issue?.message && isMessageCode(issue.message)
                    ? getMessage(issue.message)
                    : getMessage(MessageCode.BOOKING_PAYMENT_STEP_INCOMPLETE),
            )
            return
        }

        const paymentDue = advanceAmountDue > 0 ? advanceAmountDue : totalAmount

        if (!selectedTour || totalAmount <= 0 || paymentDue <= 0) {
            toast.error(getMessage(MessageCode.BOOKING_DETAILS_INCOMPLETE))
            setActiveStep(0)
            persistDraft({ activeStep: 0 })
            return
        }

        if (!isTourBookable(selectedTour)) {
            toast.error(
                getMessage(
                    selectedTour.isBookingClosed
                        ? MessageCode.BOOKING_CLOSED
                        : MessageCode.BOOKING_SOLD_OUT,
                ),
            )
            setActiveStep(0)
            persistDraft({ activeStep: 0 })
            return
        }

        const seatError = validateSeatCapacity({
            maleSeats: details.maleSeats,
            femaleSeats: details.femaleSeats,
            kidsSeats: details.kidsSeats,
            availableSeats: resolveSelectedSlotAvailableSeats(selectedTour, details.slotId),
        })

        if (seatError) {
            toast.error(getMessage(seatError.code, seatError.params))
            setActiveStep(0)
            persistDraft({ activeStep: 0 })
            return
        }

        const idCardParsed = bookingIdCardSchema.safeParse({ idCardFront, idCardBack })
        if (!idCardParsed.success) {
            toast.error(getMessage(MessageCode.VALIDATION_REQUIRED_FIELDS))
            setActiveStep(0)
            persistDraft({ activeStep: 0 })
            return
        }

        setIsSubmitting(true)

        try {
            const user = await requireUser()
            if (!user) return

            if (!selectedTour.agencyId) {
                toast.error(getMessage(MessageCode.BOOKING_MISSING_AGENCY))
                return
            }

            const bookingId = crypto.randomUUID()

            const [idCardFrontPath, idCardBackPath, screenshotPath] = await Promise.all([
                uploadBookingIdCard(
                    selectedTour.agencyId,
                    bookingId,
                    'front',
                    idCardParsed.data.idCardFront,
                ),
                uploadBookingIdCard(
                    selectedTour.agencyId,
                    bookingId,
                    'back',
                    idCardParsed.data.idCardBack,
                ),
                uploadBookingPaymentScreenshot(
                    selectedTour.agencyId,
                    bookingId,
                    paymentParsed.data.paymentScreenshot,
                ),
            ])

            const commonPayload = {
                bookingId,
                name: `${details.firstName.trim()} ${details.lastName.trim()}`.trim(),
                email: user.email ?? '',
                phone: details.phone.trim(),
                emergencyPhone: details.emergencyPhone.trim(),
                cnic: details.cnic.trim(),
                maleSeats: details.maleSeats,
                femaleSeats: details.femaleSeats,
                kidsSeats: details.kidsSeats,
                notes: details.note,
                screenshotPath,
                idCardFrontPath,
                idCardBackPath,
            }

            const booking = isPackageBookingOption(selectedTour)
                ? await submitPackageBooking(
                      buildSubmitPackageBookingPayload({
                          ...commonPayload,
                          listingKind:
                              selectedTour.listingKind === 'international'
                                  ? 'international'
                                  : 'umrah',
                          packageId: selectedTour.id,
                      }),
                  )
                : await submitTourBooking(
                      buildSubmitTourBookingPayload({
                          ...commonPayload,
                          tourId: selectedTour.id,
                          slotId: details.slotId || null,
                          pickupPointId: details.pickupPointId || null,
                      }),
                  )

            if (!booking.id) {
                throw new Error('Booking was created but no booking id was returned.')
            }

            trackEvent({
                event_type: 'BOOKING_SUCCESS',
                path: '/booking',
                entity_type: 'booking',
                entity_id: booking.id,
                metadata: {
                    tour_id: selectedTour.id,
                    tour_slug: selectedTour.slug,
                    tour_title: selectedTour.title,
                    amount_total: totalAmount,
                    advance_amount_due: paymentDue,
                    balance_due: balanceDue,
                },
            })

            clearBookingDraft()
            setIsSuccess(true)
            toast.success(getMessage(MessageCode.SUCCESS_BOOKING_SUBMITTED))
        } catch (error) {
            trackEvent({
                event_type: 'BOOKING_FAILED',
                path: '/booking',
                entity_type: 'tour',
                entity_id: selectedTour?.id ?? details.tourId ?? null,
                metadata: {
                    tour_id: selectedTour?.id ?? details.tourId ?? null,
                    tour_slug: selectedTour?.slug ?? null,
                    error: error instanceof Error ? error.message : 'unknown',
                },
            })
            toast.error(getApiErrorMessage(error, MessageCode.API_BOOKING_SUBMIT_FAILED))
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetBooking = () => {
        clearBookingDraft()
        setIsSuccess(false)
        setActiveStep(0)
        setDetails({
            ...emptyDetails,
            tourId: lockedTour?.id ?? '',
            slotId: initialSlotId ?? '',
        })
        setTotalAmount(0)
        setAdvanceAmountDue(0)
        setBalanceDue(0)
        setIdCardFront(null)
        setIdCardBack(null)
        setPaymentScreenshot(null)
    }

    if (!authReady) {
        return <BookingPageSkeleton />
    }

    const lockedTourUnavailable =
        !isDemoMode && lockedTour != null && !isTourBookable(lockedTour)

    if (lockedTourUnavailable) {
        return (
            <div className={cn('agency-container pb-16 text-center sm:pb-20 lg:pb-24', bookingPageTopPaddingClassName)}>
                <h2 className='text-3xl font-semibold text-neutral-800'>
                    Booking unavailable
                </h2>
                <p className='mx-auto mt-4 max-w-md text-base text-neutral-600'>
                    {getMessage(
                        lockedTour.isBookingClosed
                            ? MessageCode.BOOKING_CLOSED
                            : MessageCode.BOOKING_SOLD_OUT,
                    )}
                </p>
                <Button
                    href='/search'
                    className={cn('mt-8 min-w-[200px]', HP_THEME_BTN_CLASS)}
                    style={HP_THEME_BTN_STYLE}
                >
                    Browse other tours
                </Button>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className={cn(
                'agency-container pb-16 text-center sm:pb-20 lg:pb-24',
                bookingPageTopPaddingClassName
            )}>
                <h2 className='text-3xl font-semibold text-neutral-800'>
                    Booking Submitted
                </h2>
                <p className='mx-auto mt-4 max-w-md text-base text-neutral-600'>
                    Thank you for booking
                    {selectedTour ? ` ${selectedTour.title}` : ''}. Our team will verify your ID and
                    advance payment, then contact you shortly.
                    {balanceDue > 0
                        ? ` The remaining balance of ${formatBookingTotalAmount(balanceDue, selectedTour?.currency)} is due before departure.`
                        : ''}
                </p>
                <Button
                    type='button'
                    onClick={resetBooking}
                    className={cn('mt-8 min-w-[200px]', HP_THEME_BTN_CLASS)}
                    style={HP_THEME_BTN_STYLE}
                >
                    Book Another Expedition
                </Button>
            </div>
        )
    }

    return (
        <div className={cn('agency-container pb-16 sm:pb-20 lg:pb-24', bookingPageTopPaddingClassName)}>
            <div className={bookingStepperTopSpacingClassName}>
                <OnboardStepper activeStep={activeStep} steps={[...onboardSteps]} />
            </div>

            <div className='mt-10 grid items-start gap-10 xs:mt-12 sm:mt-14 xl:mt-16 xl:grid-cols-[minmax(0,455px)_minmax(0,555px)] xl:justify-center xl:gap-16 2xl:gap-24'>
                <OnboardIntro {...currentContent} />

                <div className={bookingFormPanelClassName}>
                    {activeStep === 0 && (
                        <IdentityStep
                            key={identityFormKey}
                            tourOptions={tourOptions}
                            lockedTour={lockedTour}
                            initialDetails={details}
                            onDetailsChange={handleDetailsChange}
                            onContinue={handleDetailsContinue}
                            skipValidation={isDemoMode}
                            requireEmailVerification={requireEmailVerification}
                            agencyId={resolvedAgencyId}
                            agencySiteUrl={homepageSiteUrl}
                            emailRedirectTo={emailRedirectTo}
                            isEmailVerified={emailVerified}
                            onEmailVerified={() => {
                                void handleEmailVerified()
                            }}
                            idCardFront={idCardFront}
                            idCardBack={idCardBack}
                            onIdCardFrontChange={setIdCardFront}
                            onIdCardBackChange={setIdCardBack}
                        />
                    )}
                    {activeStep === 1 && (
                        <FinalizeStep
                            tourTitle={selectedTour?.title}
                            totalAmount={totalAmount}
                            advanceAmountDue={advanceAmountDue}
                            balanceDue={balanceDue}
                            currency={selectedTour?.currency}
                            paymentAccounts={paymentAccounts}
                            paymentAccountsLoading={paymentAccountsLoading}
                            showFallbackPaymentMethods={isDemoMode}
                            paymentScreenshot={paymentScreenshot}
                            onPaymentScreenshotChange={setPaymentScreenshot}
                            onBack={handleBack}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

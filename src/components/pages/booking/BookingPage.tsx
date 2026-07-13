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
import { getMessage } from '@/lib/messages/get-message'
import { MessageCode, isMessageCode } from '@/lib/messages/codes'
import { getClientSiteUrl } from '@/lib/utils/site-url'
import { cn } from '@/lib/utils/clsxUtils'
import { sendBookingConfirmationEmail } from '@/services/email/email.client'
import type { BookingEmailBranding } from '@/services/email/email-branding'
import { buildSubmitTourBookingPayload } from '@/services/tour-bookings/bookings.mapper'
import {
    uploadBookingPaymentScreenshot,
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
    clearBookingDraft,
    loadBookingDraft,
    mergeDetailsWithDraft,
    saveBookingDraft,
} from './booking-form-storage'
import { bookingPaymentSchema } from './booking.validation'
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
    maleSeats: 0,
    femaleSeats: 0,
    kidsSeats: 0,
    note: '',
}

type BookingPageProps = {
    tourOptions: BookingTourOption[]
    lockedTour: BookingTourOption | null
    isDemoMode?: boolean
    emailBranding: BookingEmailBranding
}

export default function BookingPage({
    tourOptions,
    lockedTour,
    isDemoMode = false,
    emailBranding,
}: BookingPageProps) {
    const [draftReady, setDraftReady] = useState(false)
    const [identityFormKey, setIdentityFormKey] = useState(0)
    const [activeStep, setActiveStep] = useState(0)
    const [isSuccess, setIsSuccess] = useState(false)
    const [details, setDetails] = useState<BookingDetailsForm>(() =>
        mergeDetailsWithDraft(lockedTour?.id, null),
    )
    const [totalAmount, setTotalAmount] = useState(0)
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { mutateAsync: submitTourBooking } = useSubmitTourBooking()
    const { authReady, requireUser } = useBookingAuth({ skipAuth: isDemoMode })
    const trackEvent = useTrackEvent()
    const agencyId = useAppSelector(selectHomepageAgencyId)
    const homepageSiteUrl = useAppSelector(selectHomepageSiteUrl)
    const isAgencySite = useAppSelector(selectIsAgencySite)
    const { data: paymentAccounts = [], isLoading: paymentAccountsLoading } = useAgencyPaymentAccounts(
        agencyId,
        !isDemoMode && isAgencySite === true,
    )
    const bookingStartedTrackedRef = useRef<string | null>(null)

    useEffect(() => {
        const draft = loadBookingDraft()
        if (draft) {
            setDetails(mergeDetailsWithDraft(lockedTour?.id, draft))
            setActiveStep(draft.activeStep)
            setTotalAmount(draft.totalAmount)
            setIdentityFormKey((key) => key + 1)
        }
        setDraftReady(true)
    }, [lockedTour?.id])

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
        }) => {
            if (!draftReady) return

            saveBookingDraft({
                details: next.details ?? details,
                activeStep: next.activeStep ?? activeStep,
                totalAmount: next.totalAmount ?? totalAmount,
            })
        },
        [details, activeStep, totalAmount, draftReady],
    )
    const persistDraftRef = useRef(persistDraft)

    useEffect(() => {
        persistDraftRef.current = persistDraft
    }, [persistDraft])

    const currentContent = bookingStepsContent[activeStep]

    const selectedTour = useMemo(() => {
        const id = lockedTour?.id ?? details.tourId
        return tourOptions.find((tour) => tour.id === id) ?? lockedTour ?? null
    }, [details.tourId, lockedTour, tourOptions])

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

    const handleDetailsContinue = (nextDetails: BookingDetailsForm, nextTotal: number) => {
        setDetails(nextDetails)
        setTotalAmount(nextTotal)
        setActiveStep(1)
        persistDraft({ details: nextDetails, activeStep: 1, totalAmount: nextTotal })
    }

    const handleSubmit = async () => {
        if (isDemoMode) {
            toast.info(getMessage(MessageCode.BOOKING_DEMO_PREVIEW))
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

        if (!selectedTour || totalAmount <= 0) {
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
            availableSeats: selectedTour.availableSeats,
        })

        if (seatError) {
            toast.error(getMessage(seatError.code, seatError.params))
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

            const screenshotPath = await uploadBookingPaymentScreenshot(
                selectedTour.agencyId,
                bookingId,
                paymentParsed.data.paymentScreenshot,
            )

            const rpcPayload = buildSubmitTourBookingPayload({
                bookingId,
                tourId: selectedTour.id,
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
            })

            const booking = await submitTourBooking(rpcPayload)

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
                },
            })

            void sendBookingConfirmationEmail({
                toEmail: user.email ?? '',
                toName: `${details.firstName.trim()} ${details.lastName.trim()}`.trim(),
                bookingId: booking.id,
                tourTitle: selectedTour.title,
                tourSlug: selectedTour.slug,
                maleSeats: details.maleSeats,
                femaleSeats: details.femaleSeats,
                kidsSeats: details.kidsSeats,
                amountTotal: totalAmount,
                phone: details.phone.trim(),
                emergencyPhone: details.emergencyPhone.trim(),
                cnic: details.cnic.trim(),
                notes: details.note,
                siteUrl: homepageSiteUrl ?? getClientSiteUrl(),
                branding: emailBranding,
            }).catch(() => {
                // Booking succeeded; email is best-effort and should not block the user.
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
        })
        setTotalAmount(0)
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
                    {selectedTour ? ` ${selectedTour.title}` : ''}. Our team will verify your
                    payment and contact you shortly.
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
                        />
                    )}
                    {activeStep === 1 && (
                        <FinalizeStep
                            tourTitle={selectedTour?.title}
                            totalAmount={totalAmount}
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

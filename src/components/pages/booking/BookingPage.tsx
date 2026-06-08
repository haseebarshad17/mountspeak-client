'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
    BOOKING_CLOSED_MESSAGE,
    BOOKING_SOLD_OUT_MESSAGE,
    isTourBookable,
    validateSeatCapacity,
} from '@/lib/booking/tour-booking-rules'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/errors'
import { getClientSiteUrl } from '@/lib/utils/site-url'
import { sendBookingConfirmationEmail } from '@/services/email/email.client'
import { buildCreateBookingPayload } from '@/services/tour-bookings/bookings.mapper'
import {
    updateBookingPaymentScreenshot,
    uploadBookingPaymentScreenshot,
    useCreateTourBooking,
} from '@/services/tour-bookings/tour-bookings.queries'

import { BookingHeaderSection } from './BookingHeaderSection'
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
}

export default function BookingPage({
    tourOptions,
    lockedTour,
    isDemoMode = false,
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

    const { mutateAsync: createTourBooking } = useCreateTourBooking()
    const { authReady, requireUser } = useBookingAuth({ skipAuth: isDemoMode })

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

    const currentContent = bookingStepsContent[activeStep]

    const selectedTour = useMemo(() => {
        const id = lockedTour?.id ?? details.tourId
        return tourOptions.find((tour) => tour.id === id) ?? lockedTour ?? null
    }, [details.tourId, lockedTour, tourOptions])

    const handleDetailsChange = useCallback(
        (nextDetails: BookingDetailsForm) => {
            if (!draftReady) return

            setDetails(nextDetails)
            persistDraft({ details: nextDetails })
        },
        [persistDraft, draftReady],
    )

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
            toast.info('This is a preview booking form. Connect your site URL to enable live bookings.')
            return
        }

        const paymentParsed = bookingPaymentSchema.safeParse({ paymentScreenshot })

        if (!paymentParsed.success) {
            const issue = paymentParsed.error.issues[0]
            toast.error(issue?.message ?? 'Please complete the payment step.')
            return
        }

        if (!selectedTour || totalAmount <= 0) {
            toast.error('Please complete your travel details before submitting.')
            setActiveStep(0)
            persistDraft({ activeStep: 0 })
            return
        }

        if (!isTourBookable(selectedTour)) {
            toast.error(
                selectedTour.isBookingClosed
                    ? BOOKING_CLOSED_MESSAGE
                    : BOOKING_SOLD_OUT_MESSAGE,
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
            toast.error(seatError)
            setActiveStep(0)
            persistDraft({ activeStep: 0 })
            return
        }

        setIsSubmitting(true)

        try {
            const user = await requireUser()
            if (!user) return

            if (!selectedTour.agencyId) {
                toast.error('This tour is missing agency information. Please contact support.')
                return
            }

            const booking = await createTourBooking(
                buildCreateBookingPayload({
                    tourId: selectedTour.id,
                    name: `${details.firstName.trim()} ${details.lastName.trim()}`.trim(),
                    email: user.email ?? '',
                    phone: details.phone.trim(),
                    emergencyPhone: details.emergencyPhone.trim(),
                    cnic: details.cnic.trim(),
                    maleSeats: details.maleSeats,
                    femaleSeats: details.femaleSeats,
                    kidsSeats: details.kidsSeats,
                    totalAmount,
                    notes: details.note,
                }),
            )

            if (!booking.id) {
                throw new Error('Booking was created but no booking id was returned.')
            }

            const screenshotUrl = await uploadBookingPaymentScreenshot(
                selectedTour.agencyId,
                booking.id,
                paymentParsed.data.paymentScreenshot,
            )

            await updateBookingPaymentScreenshot(booking.id, screenshotUrl)

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
                siteUrl: getClientSiteUrl(),
            }).catch(() => {
                // Booking succeeded; email is best-effort and should not block the user.
            })

            clearBookingDraft()
            setIsSuccess(true)
            toast.success('Your expedition booking was submitted successfully.')
        } catch (error) {
            toast.error(getApiErrorMessage(error, 'Unable to submit your booking. Please try again.'))
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
        return (
            <>
                <BookingHeaderSection />
                <div className='agency-container flex min-h-[40vh] items-center justify-center py-20'>
                    <p className='text-sm text-neutral-500'>Checking your session…</p>
                </div>
            </>
        )
    }

    const lockedTourUnavailable =
        !isDemoMode && lockedTour != null && !isTourBookable(lockedTour)

    if (lockedTourUnavailable) {
        return (
            <>
                <BookingHeaderSection />
                <div className='agency-container py-20 text-center'>
                    <h2
                        className='text-3xl font-semibold text-neutral-800'
                        style={{ fontFamily: 'var(--font-booking-heading), ui-sans-serif' }}
                    >
                        Booking unavailable
                    </h2>
                    <p className='mx-auto mt-4 max-w-md text-base text-neutral-600'>
                        {lockedTour.isBookingClosed
                            ? BOOKING_CLOSED_MESSAGE
                            : BOOKING_SOLD_OUT_MESSAGE}
                    </p>
                    <Button
                        href='/search'
                        className='mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary-700 px-10 text-base text-white hover:bg-primary-800'
                    >
                        Browse other tours
                    </Button>
                </div>
            </>
        )
    }

    if (isSuccess) {
        return (
            <>
                <BookingHeaderSection />
                <div className='agency-container py-20 text-center'>
                    <h2
                        className='text-3xl font-semibold text-neutral-800'
                        style={{ fontFamily: 'var(--font-booking-heading), ui-sans-serif' }}
                    >
                        Booking Submitted
                    </h2>
                    <p className='mx-auto mt-4 max-w-md text-base text-neutral-600'>
                        Thank you for booking
                        {selectedTour ? ` ${selectedTour.title}` : ''}. Our team will verify your
                        payment and contact you shortly.
                    </p>
                    <button
                        type='button'
                        onClick={resetBooking}
                        className='mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary-700 px-10 text-base text-white hover:bg-primary-800'
                    >
                        Book Another Expedition
                    </button>
                </div>
            </>
        )
    }

    return (
        <>
            <BookingHeaderSection />

            <div className='agency-container pb-16 pt-10 xs:pt-12 sm:pb-20 sm:pt-14 md:pt-16 lg:pb-24 xl:pt-20'>
                <OnboardStepper activeStep={activeStep} steps={[...onboardSteps]} />

                <div className='mt-10 grid items-start gap-10 xs:mt-12 sm:mt-14 xl:mt-16 xl:grid-cols-[minmax(0,455px)_minmax(0,555px)] xl:justify-center xl:gap-16 2xl:gap-24'>
                    <OnboardIntro {...currentContent} />

                    <div className='mx-auto w-full max-w-[555px] rounded-[10px] border border-neutral-300 bg-white px-4 py-6 xs:px-5 sm:px-9 sm:py-9 xl:mx-0'>
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
        </>
    )
}

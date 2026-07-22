'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE } from '@/data/homepage'
import { getMessage, mapZodIssuesToFieldErrors } from '@/lib/messages/get-message'
import { cn } from '@/lib/utils/clsxUtils'
import { BookingFormSelect } from '@/components/pages/marketing/home/BookingFormSelect'
import { MessageCode } from '@/lib/messages/codes'
import {
    validateSeatCapacity,
    type SeatCapacityError,
} from '@/lib/booking/tour-booking-rules'
import { supabase } from '@/lib/supabase/supabase.client'

import { BookingPriceSummary } from '../BookingPriceSummary'
import { BookingSlotAvailabilitySummary } from '../BookingSlotAvailabilitySummary'
import { FileUploadField } from '../FileUploadField'
import { FormInput } from '../FormInput'
import { QuantityStepper, type QuantityStepperHandle } from '../QuantityStepper'
import { bookingFieldLabelClassName } from '../booking-form-ui'
import type { BookingDetailsForm, BookingTourOption } from '../booking.types'
import {
    calculateBookingPriceBreakdown,
    formatBookingSlotOptionLabel,
    getTourDepartureSlots,
    getTourPickupPoints,
    resolveSelectedBookingSlot,
    resolveSelectedBookingTour,
    resolveSelectedSlotAvailableSeats,
} from '../booking.types'
import {
    bookingDetailsSchema,
    bookingIdCardSchema,
    formatCnicInput,
} from '../booking.validation'
import { BookingEmailOtpGate } from './BookingEmailOtpGate'

export type BookingPricingSnapshot = {
    totalAmount: number
    advanceAmountDue: number
    balanceDue: number
}

type IdentityStepProps = {
    tourOptions: BookingTourOption[]
    lockedTour: BookingTourOption | null
    initialDetails: BookingDetailsForm
    onDetailsChange?: (details: BookingDetailsForm) => void
    onContinue: (details: BookingDetailsForm, pricing: BookingPricingSnapshot) => void
    skipValidation?: boolean
    requireEmailVerification?: boolean
    agencyId?: string | null
    agencySiteUrl?: string | null
    emailRedirectTo?: string | null
    isEmailVerified?: boolean
    onEmailVerified?: () => void
    idCardFront: File | null
    idCardBack: File | null
    onIdCardFrontChange: (file: File | null) => void
    onIdCardBackChange: (file: File | null) => void
}

function resolveSeatCapacityMessage(
    error: typeof MessageCode.BOOKING_CLOSED | SeatCapacityError,
): string {
    if (error === MessageCode.BOOKING_CLOSED) {
        return getMessage(MessageCode.BOOKING_CLOSED)
    }

    return getMessage(error.code, error.params)
}

function getRemainingSeats(availableSeats: number | null, reservedSeats: number): number {
    if (availableSeats == null) return Number.MAX_SAFE_INTEGER
    return Math.max(0, availableSeats - reservedSeats)
}

export function IdentityStep({
    tourOptions,
    lockedTour,
    initialDetails,
    onDetailsChange,
    onContinue,
    skipValidation = false,
    requireEmailVerification = false,
    agencyId = null,
    agencySiteUrl = null,
    emailRedirectTo = null,
    isEmailVerified = false,
    onEmailVerified,
    idCardFront,
    idCardBack,
    onIdCardFrontChange,
    onIdCardBackChange,
}: IdentityStepProps) {
    const [firstName, setFirstName] = useState(initialDetails.firstName)
    const [lastName, setLastName] = useState(initialDetails.lastName)
    const [phone, setPhone] = useState(initialDetails.phone)
    const [emergencyPhone, setEmergencyPhone] = useState(initialDetails.emergencyPhone)
    const [cnic, setCnic] = useState(() => formatCnicInput(initialDetails.cnic))
    const [tourId, setTourId] = useState(initialDetails.tourId || lockedTour?.id || '')
    const [slotId, setSlotId] = useState(initialDetails.slotId ?? '')
    const [pickupPointId, setPickupPointId] = useState(initialDetails.pickupPointId ?? '')
    const [maleSeats, setMaleSeats] = useState(initialDetails.maleSeats)
    const [femaleSeats, setFemaleSeats] = useState(initialDetails.femaleSeats)
    const [kidsSeats, setKidsSeats] = useState(initialDetails.kidsSeats)
    const [note, setNote] = useState(initialDetails.note)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const maleSeatsRef = useRef<QuantityStepperHandle>(null)
    const femaleSeatsRef = useRef<QuantityStepperHandle>(null)
    const kidsSeatsRef = useRef<QuantityStepperHandle>(null)
    const onDetailsChangeRef = useRef(onDetailsChange)

    useEffect(() => {
        onDetailsChangeRef.current = onDetailsChange
    }, [onDetailsChange])

    const clearFieldErrors = (...keys: string[]) => {
        setFieldErrors((prev) => {
            if (!keys.some((key) => prev[key])) return prev
            const next = { ...prev }
            keys.forEach((key) => delete next[key])
            return next
        })
    }

    const setFieldError = (key: string, message?: string) => {
        setFieldErrors((prev) => {
            if (message) {
                if (prev[key] === message) return prev
                return { ...prev, [key]: message }
            }
            if (!(key in prev)) return prev
            const next = { ...prev }
            delete next[key]
            return next
        })
    }

    const planLocked = !!lockedTour

    const buildDetailsSnapshot = (): BookingDetailsForm => ({
        firstName,
        lastName,
        phone,
        emergencyPhone,
        cnic,
        tourId: lockedTour?.id ?? tourId,
        slotId,
        pickupPointId,
        maleSeats,
        femaleSeats,
        kidsSeats,
        note,
    })

    useEffect(() => {
        if (lockedTour) {
            setTourId(lockedTour.id)
        }
    }, [lockedTour])

    useEffect(() => {
        onDetailsChangeRef.current?.(buildDetailsSnapshot())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        firstName,
        lastName,
        phone,
        emergencyPhone,
        cnic,
        tourId,
        slotId,
        pickupPointId,
        maleSeats,
        femaleSeats,
        kidsSeats,
        note,
        lockedTour?.id,
    ])

    useEffect(() => {
        let mounted = true

        async function prefillFromProfile() {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user || !mounted) return

            const { data: profile } = await supabase
                .from('users')
                .select('full_name, phone')
                .eq('id', user.id)
                .maybeSingle()

            if (!profile || !mounted) return

            const hasSavedName =
                initialDetails.firstName.trim() || initialDetails.lastName.trim()

            if (!hasSavedName && !firstName && !lastName && profile.full_name) {
                const parts = profile.full_name.trim().split(/\s+/)
                setFirstName(parts[0] ?? '')
                setLastName(parts.slice(1).join(' ') || parts[0] || '')
            }

            if (!initialDetails.phone.trim() && !phone && profile.phone) {
                setPhone(profile.phone)
            }
        }

        void prefillFromProfile()

        return () => {
            mounted = false
        }
        // Only prefill once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const selectedTour = useMemo(
        () => resolveSelectedBookingTour(lockedTour, tourId, tourOptions),
        [lockedTour, tourId, tourOptions],
    )

    const departureSlots = useMemo(
        () => (selectedTour ? getTourDepartureSlots(selectedTour) : []),
        [selectedTour],
    )

    const hasDepartureSlots = departureSlots.length > 0
    const requiresSlotPick = departureSlots.length > 1

    const pickupPoints = useMemo(
        () => (selectedTour ? getTourPickupPoints(selectedTour) : []),
        [selectedTour],
    )

    const hasPickupPoints = pickupPoints.length > 0
    const requiresPickupPick = pickupPoints.length > 1

    useEffect(() => {
        if (!selectedTour) return

        if (slotId && departureSlots.some((slot) => slot.id === slotId)) {
            return
        }

        if (departureSlots.length === 1) {
            setSlotId(departureSlots[0].id)
            return
        }

        if (initialDetails.slotId && departureSlots.some((slot) => slot.id === initialDetails.slotId)) {
            setSlotId(initialDetails.slotId)
        }
    }, [departureSlots, initialDetails.slotId, selectedTour, slotId])

    useEffect(() => {
        if (!selectedTour) return

        if (pickupPointId && pickupPoints.some((point) => point.id === pickupPointId)) {
            return
        }

        if (pickupPoints.length === 1) {
            setPickupPointId(pickupPoints[0].id)
            return
        }

        if (
            initialDetails.pickupPointId &&
            pickupPoints.some((point) => point.id === initialDetails.pickupPointId)
        ) {
            setPickupPointId(initialDetails.pickupPointId)
        }
    }, [initialDetails.pickupPointId, pickupPointId, pickupPoints, selectedTour])

    const adultSeats = maleSeats + femaleSeats
    const totalTravelers = adultSeats + kidsSeats

    const availableSeats = useMemo(() => {
        if (!selectedTour) return null
        return resolveSelectedSlotAvailableSeats(selectedTour, slotId)
    }, [selectedTour, slotId])

    const selectedSlotClosed = useMemo(() => {
        if (!selectedTour || !slotId) return false
        const slot = selectedTour.slots.find((entry) => entry.id === slotId)
        return slot != null && !slot.isBookable
    }, [selectedTour, slotId])

    const selectedSlot = useMemo(() => {
        if (!selectedTour) return null
        return resolveSelectedBookingSlot(selectedTour, slotId)
    }, [selectedTour, slotId])

    const selectedSlotBookable = selectedSlot?.isBookable === true && (selectedSlot?.availableSeats ?? 0) > 0

    const seatCapacityError = useMemo(() => {
        if (skipValidation || !selectedTour) return null

        if (hasDepartureSlots && !slotId) return null

        if (selectedTour.isBookingClosed || selectedSlotClosed || (selectedSlot && !selectedSlotBookable)) {
            return MessageCode.BOOKING_CLOSED
        }

        return validateSeatCapacity({
            maleSeats,
            femaleSeats,
            kidsSeats,
            availableSeats,
        })
    }, [
        availableSeats,
        femaleSeats,
        hasDepartureSlots,
        kidsSeats,
        maleSeats,
        selectedSlot,
        selectedSlotBookable,
        selectedSlotClosed,
        selectedTour,
        skipValidation,
        slotId,
    ])

    const seatCapacityMessage = useMemo(
        () => (seatCapacityError ? resolveSeatCapacityMessage(seatCapacityError) : null),
        [seatCapacityError],
    )

    useEffect(() => {
        if (skipValidation) {
            setFieldError('tourId')
            return
        }

        if (selectedTour?.isBookingClosed || selectedSlotClosed) {
            setFieldError('tourId', getMessage(MessageCode.BOOKING_CLOSED))
            return
        }

        setFieldError('tourId')
    }, [selectedSlotClosed, selectedTour, skipValidation])

    useEffect(() => {
        if (skipValidation || !hasDepartureSlots) {
            setFieldError('slotId')
            return
        }

        if (requiresSlotPick && !slotId) {
            setFieldError('slotId', getMessage(MessageCode.BOOKING_SLOT_REQUIRED))
            return
        }

        setFieldError('slotId')
    }, [hasDepartureSlots, requiresSlotPick, skipValidation, slotId])

    useEffect(() => {
        if (skipValidation || !hasPickupPoints) {
            setFieldError('pickupPointId')
            return
        }

        if (requiresPickupPick && !pickupPointId) {
            setFieldError('pickupPointId', getMessage(MessageCode.BOOKING_PICKUP_POINT_REQUIRED))
            return
        }

        setFieldError('pickupPointId')
    }, [hasPickupPoints, pickupPointId, requiresPickupPick, skipValidation])

    useEffect(() => {
        setFieldError('seatCapacity', seatCapacityMessage ?? undefined)
    }, [seatCapacityMessage])

    const totalSeatsDisplay = useMemo(() => {
        const summary = `Adults(${adultSeats}) - kids(${kidsSeats})`
        if (availableSeats == null) return summary
        return `${summary} — ${availableSeats} seat${availableSeats === 1 ? '' : 's'} available`
    }, [adultSeats, availableSeats, kidsSeats])

    const maxMaleSeats = useMemo(
        () => getRemainingSeats(availableSeats, femaleSeats + kidsSeats),
        [availableSeats, femaleSeats, kidsSeats],
    )

    const maxFemaleSeats = useMemo(
        () => getRemainingSeats(availableSeats, maleSeats + kidsSeats),
        [availableSeats, maleSeats, kidsSeats],
    )

    const maxKidsSeats = useMemo(
        () => getRemainingSeats(availableSeats, adultSeats),
        [adultSeats, availableSeats],
    )

    useEffect(() => {
        if (maleSeats > maxMaleSeats) {
            setMaleSeats(maxMaleSeats)
        }
    }, [maleSeats, maxMaleSeats])

    useEffect(() => {
        if (femaleSeats > maxFemaleSeats) {
            setFemaleSeats(maxFemaleSeats)
        }
    }, [femaleSeats, maxFemaleSeats])

    useEffect(() => {
        if (kidsSeats > maxKidsSeats) {
            setKidsSeats(maxKidsSeats)
        }
    }, [kidsSeats, maxKidsSeats])

    const priceBreakdown = useMemo(() => {
        if (!selectedTour || totalTravelers <= 0) {
            return {
                subtotal: 0,
                discountAmount: 0,
                total: 0,
                adultSubtotal: 0,
                adultDiscount: 0,
                kidsSubtotal: 0,
                kidsDiscount: 0,
                advanceDue: 0,
                balanceDue: 0,
            }
        }

        return calculateBookingPriceBreakdown({
            adultSeats,
            kidsSeats,
            pricePerSeat: selectedTour.pricePerSeat,
            discountPercent: selectedTour.discountPercent,
            kidsDiscountPercent: selectedTour.kidsDiscountPercent,
            advanceAmountPerSeat: selectedTour.advanceAmountPerSeat,
        })
    }, [adultSeats, kidsSeats, selectedTour, totalTravelers])

    const planOptions = useMemo(() => {
        if (lockedTour) {
            return [{ value: lockedTour.id, label: lockedTour.title }]
        }

        return tourOptions.map((tour) => ({
            value: tour.id,
            label: tour.title,
        }))
    }, [lockedTour, tourOptions])

    const slotOptions = useMemo(
        () =>
            departureSlots.map((slot) => ({
                value: slot.id,
                label: formatBookingSlotOptionLabel(slot),
            })),
        [departureSlots],
    )

    const pickupOptions = useMemo(
        () =>
            pickupPoints.map((point) => ({
                value: point.id,
                label: point.label,
            })),
        [pickupPoints],
    )

    const seatsBlocked =
        (requiresSlotPick && !slotId) ||
        (hasDepartureSlots && Boolean(selectedSlot) && !selectedSlotBookable)

    const handleContinue = () => {
        if (requireEmailVerification && !isEmailVerified) {
            toast.error(getMessage(MessageCode.BOOKING_EMAIL_VERIFY_REQUIRED))
            return
        }

        const nextMaleSeats = maleSeatsRef.current?.commit() ?? maleSeats
        const nextFemaleSeats = femaleSeatsRef.current?.commit() ?? femaleSeats
        const nextKidsSeats = kidsSeatsRef.current?.commit() ?? kidsSeats
        const nextAdultSeats = nextMaleSeats + nextFemaleSeats
        const nextTotalTravelers = nextAdultSeats + nextKidsSeats
        const resolvedSlotId = slotId || (departureSlots.length === 1 ? departureSlots[0]?.id : '')
        const resolvedPickupPointId =
            pickupPointId || (pickupPoints.length === 1 ? pickupPoints[0]?.id : '')

        const nextAvailableSeats = selectedTour
            ? resolveSelectedSlotAvailableSeats(selectedTour, resolvedSlotId)
            : null

        const nextCapacityError =
            skipValidation || !selectedTour
                ? null
                : hasDepartureSlots && !resolvedSlotId
                  ? null
                  : selectedTour.isBookingClosed || selectedSlotClosed
                    ? MessageCode.BOOKING_CLOSED
                    : validateSeatCapacity({
                          maleSeats: nextMaleSeats,
                          femaleSeats: nextFemaleSeats,
                          kidsSeats: nextKidsSeats,
                          availableSeats: nextAvailableSeats,
                      })

        const nextCapacityMessage = nextCapacityError
            ? resolveSeatCapacityMessage(nextCapacityError)
            : null

        const nextBreakdown =
            selectedTour && nextTotalTravelers > 0
                ? calculateBookingPriceBreakdown({
                      adultSeats: nextAdultSeats,
                      kidsSeats: nextKidsSeats,
                      pricePerSeat: selectedTour.pricePerSeat,
                      discountPercent: selectedTour.discountPercent,
                      kidsDiscountPercent: selectedTour.kidsDiscountPercent,
                      advanceAmountPerSeat: selectedTour.advanceAmountPerSeat,
                  })
                : null

        const nextPricing: BookingPricingSnapshot = {
            totalAmount: nextBreakdown?.total ?? 0,
            advanceAmountDue: nextBreakdown?.advanceDue ?? 0,
            balanceDue: nextBreakdown?.balanceDue ?? 0,
        }

        if (!skipValidation) {
            if (hasDepartureSlots && !resolvedSlotId) {
                const message = getMessage(MessageCode.BOOKING_SLOT_REQUIRED)
                setFieldError('slotId', message)
                toast.error(message)
                return
            }

            if (hasPickupPoints && !resolvedPickupPointId) {
                const message = getMessage(MessageCode.BOOKING_PICKUP_POINT_REQUIRED)
                setFieldError('pickupPointId', message)
                toast.error(message)
                return
            }

            const resolvedSlot = selectedTour
                ? resolveSelectedBookingSlot(selectedTour, resolvedSlotId)
                : null
            if (resolvedSlot && (!resolvedSlot.isBookable || resolvedSlot.availableSeats <= 0)) {
                toast.error(getMessage(MessageCode.BOOKING_CLOSED))
                return
            }

            if (selectedTour?.isBookingClosed || selectedSlotClosed) {
                setFieldError('tourId', getMessage(MessageCode.BOOKING_CLOSED))
                toast.error(getMessage(MessageCode.BOOKING_CLOSED))
                return
            }

            if (nextCapacityMessage) {
                setFieldError('seatCapacity', nextCapacityMessage)
                toast.error(nextCapacityMessage)
                return
            }
        }

        const snapshot: BookingDetailsForm = {
            firstName,
            lastName,
            phone,
            emergencyPhone,
            cnic,
            tourId: lockedTour?.id ?? tourId,
            slotId: resolvedSlotId,
            pickupPointId: resolvedPickupPointId,
            maleSeats: nextMaleSeats,
            femaleSeats: nextFemaleSeats,
            kidsSeats: nextKidsSeats,
            note,
        }

        if (!skipValidation) {
            const parsed = bookingDetailsSchema.safeParse({
                firstName,
                lastName,
                phone,
                emergencyPhone,
                cnic,
                tourId: lockedTour?.id ?? tourId,
                slotId: resolvedSlotId || undefined,
                pickupPointId: resolvedPickupPointId || undefined,
                maleSeats: nextMaleSeats,
                femaleSeats: nextFemaleSeats,
                kidsSeats: nextKidsSeats,
                note: note || undefined,
            })

            if (!parsed.success) {
                setFieldErrors((prev) => ({
                    ...prev,
                    ...mapZodIssuesToFieldErrors(parsed.error.issues),
                }))
                toast.error(getMessage(MessageCode.VALIDATION_REQUIRED_FIELDS))
                return
            }

            const idCardParsed = bookingIdCardSchema.safeParse({ idCardFront, idCardBack })
            if (!idCardParsed.success) {
                setFieldErrors((prev) => ({
                    ...prev,
                    ...mapZodIssuesToFieldErrors(idCardParsed.error.issues),
                }))
                toast.error(getMessage(MessageCode.VALIDATION_REQUIRED_FIELDS))
                return
            }

            if (!selectedTour || nextPricing.totalAmount <= 0) {
                toast.error(getMessage(MessageCode.BOOKING_SELECT_VALID_PLAN))
                return
            }

            onContinue(
                {
                    firstName: parsed.data.firstName,
                    lastName: parsed.data.lastName,
                    phone: parsed.data.phone,
                    emergencyPhone: parsed.data.emergencyPhone,
                    cnic: parsed.data.cnic,
                    tourId: parsed.data.tourId,
                    slotId: resolvedSlotId,
                    pickupPointId: resolvedPickupPointId,
                    maleSeats: parsed.data.maleSeats,
                    femaleSeats: parsed.data.femaleSeats,
                    kidsSeats: parsed.data.kidsSeats,
                    note: parsed.data.note ?? '',
                },
                nextPricing,
            )
            return
        }

        onContinue(snapshot, nextPricing)
    }

    const showEmailGate =
        requireEmailVerification && !isEmailVerified && !!agencyId && !!emailRedirectTo

    const slotSelectionBlocked = (requiresSlotPick && !slotId) || seatsBlocked

    return (
        <div className='flex h-max min-h-full flex-col justify-between'>
            <div className='grid gap-5 sm:grid-cols-2'>
                {planLocked ? (
                    <FormInput
                        label='Destination'
                        required
                        readOnly
                        staticField
                        value={lockedTour?.title ?? selectedTour?.title ?? ''}
                        aria-readonly
                        className='sm:col-span-2'
                    />
                ) : (
                    <div className='flex flex-col gap-2 sm:col-span-2'>
                        <label className={bookingFieldLabelClassName}>
                            Destination
                            <span className='text-red-400'> *</span>
                        </label>
                        <BookingFormSelect
                            name='tourId'
                            value={tourId}
                            onChange={(nextValue) => {
                                setTourId(nextValue)
                                setSlotId('')
                                setPickupPointId('')
                                clearFieldErrors('tourId', 'slotId', 'pickupPointId')
                            }}
                            placeholder='Select destination'
                            options={planOptions}
                            searchable
                            searchPlaceholder='Search destinations...'
                            noResultsMessage='No tours found'
                            aria-label='Destination'
                        />
                    </div>
                )}
                {fieldErrors.tourId ? (
                    <p className='-mt-3 text-xs text-red-500 sm:col-span-2'>{fieldErrors.tourId}</p>
                ) : null}

                {hasDepartureSlots ? (
                    <div className='flex flex-col gap-2 sm:col-span-2'>
                        <label className={bookingFieldLabelClassName}>
                            Departure
                            <span className='text-red-400'> *</span>
                        </label>
                        <BookingFormSelect
                            name='slotId'
                            value={slotId}
                            onChange={(nextValue) => {
                                setSlotId(nextValue)
                                clearFieldErrors('slotId', 'seatCapacity')
                            }}
                            placeholder='Select a departure date'
                            options={slotOptions}
                            searchable={slotOptions.length > 4}
                            searchPlaceholder='Search departures...'
                            noResultsMessage='No departures available'
                            aria-label='Departure'
                        />
                        {fieldErrors.slotId ? (
                            <p className='text-xs text-red-500'>{fieldErrors.slotId}</p>
                        ) : null}
                    </div>
                ) : null}

                {hasPickupPoints ? (
                    <div className='flex flex-col gap-2 sm:col-span-2'>
                        <label className={bookingFieldLabelClassName}>
                            Pickup point
                            <span className='text-red-400'> *</span>
                        </label>
                        <BookingFormSelect
                            name='pickupPointId'
                            value={pickupPointId}
                            onChange={(nextValue) => {
                                setPickupPointId(nextValue)
                                clearFieldErrors('pickupPointId')
                            }}
                            placeholder='Select where you will join the trip'
                            options={pickupOptions}
                            searchable={pickupOptions.length > 4}
                            searchPlaceholder='Search cities...'
                            noResultsMessage='No pickup points available'
                            aria-label='Pickup point'
                        />
                        {fieldErrors.pickupPointId ? (
                            <p className='text-xs text-red-500'>{fieldErrors.pickupPointId}</p>
                        ) : null}
                    </div>
                ) : null}

                {hasDepartureSlots && !selectedSlot ? (
                    <div className='rounded-[10px] border border-dashed border-[#D5DADD] bg-[#F8FAFB] px-4 py-3.5 text-sm text-neutral-600 sm:col-span-2'>
                        Select a departure to view how many seats are booked and available.
                    </div>
                ) : (
                    <BookingSlotAvailabilitySummary
                        key={selectedSlot?.id ?? 'tour-fallback'}
                        slot={selectedSlot}
                        tour={hasDepartureSlots ? null : selectedTour}
                    />
                )}

                {showEmailGate ? (
                    <BookingEmailOtpGate
                        agencyId={agencyId!}
                        agencySiteUrl={agencySiteUrl}
                        emailRedirectTo={emailRedirectTo!}
                        onVerified={() => onEmailVerified?.()}
                    />
                ) : null}
                <FormInput
                    label='First Name'
                    placeholder='First Name'
                    required
                    staticField={false}
                    value={firstName}
                    onChange={(event) => {
                        setFirstName(event.target.value)
                        clearFieldErrors('firstName')
                    }}
                    error={fieldErrors.firstName}
                />
                <FormInput
                    label='Last Name'
                    placeholder='Last Name'
                    required
                    staticField={false}
                    value={lastName}
                    onChange={(event) => {
                        setLastName(event.target.value)
                        clearFieldErrors('lastName')
                    }}
                    error={fieldErrors.lastName}
                />
                <FormInput
                    label='Phone'
                    placeholder='+923001234567'
                    type='tel'
                    required
                    staticField={false}
                    value={phone}
                    onChange={(event) => {
                        setPhone(event.target.value)
                        clearFieldErrors('phone')
                    }}
                    error={fieldErrors.phone}
                />
                <FormInput
                    label='Emergency Phone'
                    placeholder='+923009876543'
                    type='tel'
                    required
                    staticField={false}
                    value={emergencyPhone}
                    onChange={(event) => {
                        setEmergencyPhone(event.target.value)
                        clearFieldErrors('emergencyPhone')
                    }}
                    error={fieldErrors.emergencyPhone}
                />
                <FormInput
                    label='CNIC'
                    placeholder='12345-1234567-1'
                    required
                    staticField={false}
                    value={cnic}
                    inputMode='numeric'
                    autoComplete='off'
                    maxLength={15}
                    onChange={(event) => {
                        setCnic(formatCnicInput(event.target.value))
                        clearFieldErrors('cnic')
                    }}
                    error={fieldErrors.cnic}
                    className='sm:col-span-2'
                />
                {seatsBlocked ? (
                    <p className='-mt-3 text-xs text-neutral-500 sm:col-span-2'>
                        {requiresSlotPick && !slotId
                            ? 'Select a departure above to choose seats.'
                            : 'This departure is not available for booking.'}
                    </p>
                ) : null}
                <QuantityStepper
                    ref={maleSeatsRef}
                    label='Male Seats'
                    value={maleSeats}
                    max={seatsBlocked ? 0 : maxMaleSeats}
                    variant='field'
                    onChange={(value) => {
                        setMaleSeats(value)
                        clearFieldErrors('maleSeats', 'femaleSeats', 'seatCapacity')
                    }}
                    className='sm:col-span-2'
                />
                {fieldErrors.maleSeats ? (
                    <p className='-mt-3 text-xs text-red-500 sm:col-span-2'>{fieldErrors.maleSeats}</p>
                ) : null}
                <QuantityStepper
                    ref={femaleSeatsRef}
                    label='Female Seats'
                    value={femaleSeats}
                    max={seatsBlocked ? 0 : maxFemaleSeats}
                    variant='field'
                    onChange={(value) => {
                        setFemaleSeats(value)
                        clearFieldErrors('maleSeats', 'femaleSeats', 'seatCapacity')
                    }}
                    className='sm:col-span-2'
                />
                {fieldErrors.femaleSeats ? (
                    <p className='-mt-3 text-xs text-red-500 sm:col-span-2'>{fieldErrors.femaleSeats}</p>
                ) : null}
                <QuantityStepper
                    ref={kidsSeatsRef}
                    label='Total Number Children (4 to 8 years):'
                    value={kidsSeats}
                    max={seatsBlocked ? 0 : maxKidsSeats}
                    variant='field'
                    onChange={(value) => {
                        setKidsSeats(value)
                        clearFieldErrors('maleSeats', 'femaleSeats', 'seatCapacity')
                    }}
                    className='sm:col-span-2'
                />
                <FormInput
                    label='Total Seats'
                    value={totalSeatsDisplay}
                    readOnly
                    staticField
                    aria-readonly
                    error={fieldErrors.seatCapacity}
                    className='sm:col-span-2'
                />
                <FormInput
                    label='Note'
                    placeholder='Add any special requests or notes (optional)'
                    textarea
                    staticField={false}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    className='sm:col-span-2'
                />
                <FileUploadField
                    label='CNIC front'
                    required={!skipValidation}
                    mode='image'
                    value={idCardFront}
                    onChange={(file) => {
                        onIdCardFrontChange(file)
                        clearFieldErrors('idCardFront')
                    }}
                    className='sm:col-span-2'
                />
                {fieldErrors.idCardFront ? (
                    <p className='-mt-3 text-xs text-red-500 sm:col-span-2'>{fieldErrors.idCardFront}</p>
                ) : null}
                <FileUploadField
                    label='CNIC back'
                    required={!skipValidation}
                    mode='image'
                    value={idCardBack}
                    onChange={(file) => {
                        onIdCardBackChange(file)
                        clearFieldErrors('idCardBack')
                    }}
                    className='sm:col-span-2'
                />
                {fieldErrors.idCardBack ? (
                    <p className='-mt-3 text-xs text-red-500 sm:col-span-2'>{fieldErrors.idCardBack}</p>
                ) : null}
                <BookingPriceSummary
                    breakdown={priceBreakdown}
                    adultSeats={adultSeats}
                    kidsSeats={kidsSeats}
                    adultDiscountPercent={selectedTour?.discountPercent ?? 0}
                    kidsDiscountPercent={selectedTour?.kidsDiscountPercent ?? 0}
                    currency={selectedTour?.currency}
                />
            </div>

            <div className='mt-6 flex justify-end'>
                <Button
                    size='lg'
                    variant='default'
                    type='button'
                    onClick={handleContinue}
                    disabled={
                        (tourOptions.length === 0 && !lockedTour) ||
                        !!seatCapacityError ||
                        !!selectedTour?.isBookingClosed ||
                        selectedSlotClosed ||
                        slotSelectionBlocked
                    }
                    className={cn('w-full rounded-md px-12 sm:w-auto', HP_THEME_BTN_CLASS)}
                    style={HP_THEME_BTN_STYLE}
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}

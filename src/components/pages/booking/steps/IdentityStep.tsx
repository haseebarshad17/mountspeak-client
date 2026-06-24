'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { getMessage, mapZodIssuesToFieldErrors } from '@/lib/messages/get-message'
import { MessageCode } from '@/lib/messages/codes'
import {
    validateSeatCapacity,
    type SeatCapacityError,
} from '@/lib/booking/tour-booking-rules'
import { supabase } from '@/lib/supabase/supabase.client'

import { BookingPriceSummary } from '../BookingPriceSummary'
import { FormInput } from '../FormInput'
import { FormSelect } from '../FormSelect'
import { QuantityStepper, type QuantityStepperHandle } from '../QuantityStepper'
import type { BookingDetailsForm, BookingTourOption } from '../booking.types'
import { calculateBookingPriceBreakdown } from '../booking.types'
import { bookingDetailsSchema, formatCnicInput } from '../booking.validation'

type IdentityStepProps = {
    tourOptions: BookingTourOption[]
    lockedTour: BookingTourOption | null
    initialDetails: BookingDetailsForm
    onDetailsChange?: (details: BookingDetailsForm) => void
    onContinue: (details: BookingDetailsForm, totalAmount: number) => void
    skipValidation?: boolean
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
}: IdentityStepProps) {
    const [firstName, setFirstName] = useState(initialDetails.firstName)
    const [lastName, setLastName] = useState(initialDetails.lastName)
    const [phone, setPhone] = useState(initialDetails.phone)
    const [emergencyPhone, setEmergencyPhone] = useState(initialDetails.emergencyPhone)
    const [cnic, setCnic] = useState(() => formatCnicInput(initialDetails.cnic))
    const [tourId, setTourId] = useState(initialDetails.tourId || lockedTour?.id || '')
    const [maleSeats, setMaleSeats] = useState(initialDetails.maleSeats)
    const [femaleSeats, setFemaleSeats] = useState(initialDetails.femaleSeats)
    const [kidsSeats, setKidsSeats] = useState(initialDetails.kidsSeats)
    const [note, setNote] = useState(initialDetails.note)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const maleSeatsRef = useRef<QuantityStepperHandle>(null)
    const femaleSeatsRef = useRef<QuantityStepperHandle>(null)
    const kidsSeatsRef = useRef<QuantityStepperHandle>(null)

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
            const next = { ...prev }
            if (message) next[key] = message
            else delete next[key]
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
        if (!onDetailsChange) return

        onDetailsChange(buildDetailsSnapshot())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        firstName,
        lastName,
        phone,
        emergencyPhone,
        cnic,
        tourId,
        maleSeats,
        femaleSeats,
        kidsSeats,
        note,
        lockedTour?.id,
        onDetailsChange,
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

    const selectedTour = useMemo(() => {
        const id = lockedTour?.id ?? tourId
        return tourOptions.find((tour) => tour.id === id) ?? lockedTour ?? null
    }, [lockedTour, tourId, tourOptions])

    const adultSeats = maleSeats + femaleSeats
    const totalTravelers = adultSeats + kidsSeats

    const availableSeats = selectedTour?.availableSeats ?? null

    const seatCapacityError = useMemo(() => {
        if (skipValidation || !selectedTour) return null

        if (selectedTour.isBookingClosed) {
            return MessageCode.BOOKING_CLOSED
        }

        return validateSeatCapacity({
            maleSeats,
            femaleSeats,
            kidsSeats,
            availableSeats,
        })
    }, [availableSeats, femaleSeats, kidsSeats, maleSeats, selectedTour, skipValidation])

    const seatCapacityMessage = useMemo(
        () => (seatCapacityError ? resolveSeatCapacityMessage(seatCapacityError) : null),
        [seatCapacityError],
    )

    useEffect(() => {
        if (skipValidation) {
            setFieldError('tourId')
            return
        }

        if (selectedTour?.isBookingClosed) {
            setFieldError('tourId', getMessage(MessageCode.BOOKING_CLOSED))
            return
        }

        setFieldError('tourId')
    }, [selectedTour, skipValidation])

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
            }
        }

        return calculateBookingPriceBreakdown({
            adultSeats,
            kidsSeats,
            pricePerSeat: selectedTour.pricePerSeat,
            discountPercent: selectedTour.discountPercent,
            kidsDiscountPercent: selectedTour.kidsDiscountPercent,
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

    const handleContinue = () => {
        const nextMaleSeats = maleSeatsRef.current?.commit() ?? maleSeats
        const nextFemaleSeats = femaleSeatsRef.current?.commit() ?? femaleSeats
        const nextKidsSeats = kidsSeatsRef.current?.commit() ?? kidsSeats
        const nextAdultSeats = nextMaleSeats + nextFemaleSeats
        const nextTotalTravelers = nextAdultSeats + nextKidsSeats

        const nextCapacityError =
            skipValidation || !selectedTour
                ? null
                : selectedTour.isBookingClosed
                  ? MessageCode.BOOKING_CLOSED
                  : validateSeatCapacity({
                        maleSeats: nextMaleSeats,
                        femaleSeats: nextFemaleSeats,
                        kidsSeats: nextKidsSeats,
                        availableSeats,
                    })

        const nextCapacityMessage = nextCapacityError
            ? resolveSeatCapacityMessage(nextCapacityError)
            : null

        const nextTotalAmount =
            selectedTour && nextTotalTravelers > 0
                ? calculateBookingPriceBreakdown({
                      adultSeats: nextAdultSeats,
                      kidsSeats: nextKidsSeats,
                      pricePerSeat: selectedTour.pricePerSeat,
                      discountPercent: selectedTour.discountPercent,
                      kidsDiscountPercent: selectedTour.kidsDiscountPercent,
                  }).total
                : 0

        if (!skipValidation) {
            if (selectedTour?.isBookingClosed) {
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

            if (!selectedTour || nextTotalAmount <= 0) {
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
                    maleSeats: parsed.data.maleSeats,
                    femaleSeats: parsed.data.femaleSeats,
                    kidsSeats: parsed.data.kidsSeats,
                    note: parsed.data.note ?? '',
                },
                nextTotalAmount,
            )
            return
        }

        onContinue(snapshot, nextTotalAmount)
    }

    return (
        <div className='flex h-max min-h-full flex-col justify-between'>
            <div className='grid gap-5 sm:grid-cols-2'>
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
                {planLocked ? (
                    <FormInput
                        label='Tour ID / Destination / Plan'
                        required
                        readOnly
                        staticField
                        value={lockedTour?.title ?? selectedTour?.title ?? ''}
                        aria-readonly
                        className='sm:col-span-2'
                    />
                ) : (
                    <FormSelect
                        label='Tour ID / Destination / Plan'
                        placeholder='Select tour or destination'
                        required
                        value={tourId}
                        staticField={false}
                        options={planOptions}
                        onChange={(event) => {
                            setTourId(event.target.value)
                            clearFieldErrors('tourId')
                        }}
                        className='sm:col-span-2'
                    />
                )}
                {fieldErrors.tourId ? (
                    <p className='-mt-3 text-xs text-red-500 sm:col-span-2'>{fieldErrors.tourId}</p>
                ) : null}
                <QuantityStepper
                    ref={maleSeatsRef}
                    label='Male Seats'
                    value={maleSeats}
                    max={maxMaleSeats}
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
                    max={maxFemaleSeats}
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
                    max={maxKidsSeats}
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
                <BookingPriceSummary
                    breakdown={priceBreakdown}
                    adultSeats={adultSeats}
                    kidsSeats={kidsSeats}
                    adultDiscountPercent={selectedTour?.discountPercent ?? 0}
                    kidsDiscountPercent={selectedTour?.kidsDiscountPercent ?? 0}
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
                        !!selectedTour?.isBookingClosed
                    }
                    className='w-full rounded-full bg-primary-700 px-12 hover:bg-primary-800 sm:w-auto'
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
    BOOKING_CLOSED_MESSAGE,
    validateSeatCapacity,
} from '@/lib/booking/tour-booking-rules'
import { supabase } from '@/lib/supabase/supabase.client'

import { BookingPriceSummary } from '../BookingPriceSummary'
import { FormInput } from '../FormInput'
import { FormSelect } from '../FormSelect'
import { QuantityStepper } from '../QuantityStepper'
import type { BookingDetailsForm, BookingTourOption } from '../booking.types'
import { calculateBookingPriceBreakdown, SEAT_OPTIONS } from '../booking.types'
import { bookingDetailsSchema, formatCnicInput } from '../booking.validation'

type IdentityStepProps = {
    tourOptions: BookingTourOption[]
    lockedTour: BookingTourOption | null
    initialDetails: BookingDetailsForm
    onDetailsChange?: (details: BookingDetailsForm) => void
    onContinue: (details: BookingDetailsForm, totalAmount: number) => void
}

function buildSeatSelectOptions(maxSeats: number) {
    const safeMax = Math.max(0, Math.min(10, maxSeats))
    return SEAT_OPTIONS.filter((option) => Number(option.value) <= safeMax)
}

export function IdentityStep({
    tourOptions,
    lockedTour,
    initialDetails,
    onDetailsChange,
    onContinue,
}: IdentityStepProps) {
    const [firstName, setFirstName] = useState(initialDetails.firstName)
    const [lastName, setLastName] = useState(initialDetails.lastName)
    const [phone, setPhone] = useState(initialDetails.phone)
    const [emergencyPhone, setEmergencyPhone] = useState(initialDetails.emergencyPhone)
    const [cnic, setCnic] = useState(() => formatCnicInput(initialDetails.cnic))
    const [tourId, setTourId] = useState(initialDetails.tourId || lockedTour?.id || '')
    const [maleSeats, setMaleSeats] = useState(String(initialDetails.maleSeats))
    const [femaleSeats, setFemaleSeats] = useState(String(initialDetails.femaleSeats))
    const [kidsSeats, setKidsSeats] = useState(initialDetails.kidsSeats)
    const [note, setNote] = useState(initialDetails.note)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

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
        maleSeats: Number(maleSeats) || 0,
        femaleSeats: Number(femaleSeats) || 0,
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

    const adultSeats = Number(maleSeats) + Number(femaleSeats)
    const totalTravelers = adultSeats + kidsSeats

    const availableSeats = selectedTour?.availableSeats ?? null

    const seatCapacityError = useMemo(() => {
        if (!selectedTour) return null

        if (selectedTour.isBookingClosed) {
            return BOOKING_CLOSED_MESSAGE
        }

        return validateSeatCapacity({
            maleSeats: Number(maleSeats) || 0,
            femaleSeats: Number(femaleSeats) || 0,
            kidsSeats,
            availableSeats,
        })
    }, [availableSeats, femaleSeats, kidsSeats, maleSeats, selectedTour])

    useEffect(() => {
        if (selectedTour?.isBookingClosed) {
            setFieldError('tourId', BOOKING_CLOSED_MESSAGE)
            return
        }

        setFieldError('tourId')
    }, [selectedTour])

    useEffect(() => {
        setFieldError('seatCapacity', seatCapacityError ?? undefined)
    }, [seatCapacityError])

    const totalSeatsDisplay = useMemo(() => {
        const summary = `Adults(${adultSeats}) - kids(${kidsSeats})`
        if (availableSeats == null) return summary
        return `${summary} — ${availableSeats} seat${availableSeats === 1 ? '' : 's'} available`
    }, [adultSeats, availableSeats, kidsSeats])

    const maxMaleSeats = useMemo(() => {
        if (availableSeats == null) return 10
        return Math.max(0, availableSeats - Number(femaleSeats) - kidsSeats)
    }, [availableSeats, femaleSeats, kidsSeats])

    const maxFemaleSeats = useMemo(() => {
        if (availableSeats == null) return 10
        return Math.max(0, availableSeats - Number(maleSeats) - kidsSeats)
    }, [availableSeats, maleSeats, kidsSeats])

    const maxKidsSeats = useMemo(() => {
        if (availableSeats == null) return 10
        return Math.max(0, availableSeats - adultSeats)
    }, [adultSeats, availableSeats])

    useEffect(() => {
        if (Number(maleSeats) > maxMaleSeats) {
            setMaleSeats(String(maxMaleSeats))
        }
    }, [maleSeats, maxMaleSeats])

    useEffect(() => {
        if (Number(femaleSeats) > maxFemaleSeats) {
            setFemaleSeats(String(maxFemaleSeats))
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

    const totalAmount = priceBreakdown.total

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
        if (selectedTour?.isBookingClosed) {
            setFieldError('tourId', BOOKING_CLOSED_MESSAGE)
            toast.error(BOOKING_CLOSED_MESSAGE)
            return
        }

        if (seatCapacityError) {
            setFieldError('seatCapacity', seatCapacityError)
            toast.error(seatCapacityError)
            return
        }

        const parsed = bookingDetailsSchema.safeParse({
            firstName,
            lastName,
            phone,
            emergencyPhone,
            cnic,
            tourId: lockedTour?.id ?? tourId,
            maleSeats,
            femaleSeats,
            kidsSeats,
            note: note || undefined,
        })

        if (!parsed.success) {
            const nextErrors: Record<string, string> = {}
            parsed.error.issues.forEach((issue) => {
                const key = String(issue.path[0] ?? 'form')
                if (!nextErrors[key]) nextErrors[key] = issue.message
            })
            setFieldErrors((prev) => ({ ...prev, ...nextErrors }))
            toast.error('Please fill all the required fields.')
            return
        }

        if (!selectedTour || totalAmount <= 0) {
            toast.error('Select seats and a valid tour plan to continue.')
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
            totalAmount,
        )
    }

    return (
        <div className='flex h-max min-h-full flex-col justify-between'>
            <div className='grid gap-5 sm:grid-cols-2'>
                <FormInput
                    label='First Name'
                    placeholder='Jack'
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
                    placeholder='Smith'
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
                <FormSelect
                    label='Tour ID / Destination / Plan'
                    placeholder='Select tour or destination'
                    required
                    value={lockedTour?.id ?? tourId}
                    staticField={planLocked}
                    options={planOptions}
                    onChange={(event) => {
                        setTourId(event.target.value)
                        clearFieldErrors('tourId')
                    }}
                    className='sm:col-span-2'
                />
                {fieldErrors.tourId ? (
                    <p className='-mt-3 text-xs text-red-500 sm:col-span-2'>{fieldErrors.tourId}</p>
                ) : null}
                <FormSelect
                    label='Male Seats'
                    placeholder='Select male seats'
                    required
                    value={maleSeats}
                    staticField={false}
                    options={buildSeatSelectOptions(maxMaleSeats).map((opt) => ({
                        value: opt.value,
                        label: `${opt.label} Male ${opt.label === '1' ? 'Seat' : 'Seats'}`,
                    }))}
                    onChange={(event) => {
                        setMaleSeats(event.target.value)
                        clearFieldErrors('maleSeats', 'femaleSeats', 'seatCapacity')
                    }}
                    error={fieldErrors.maleSeats}
                />
                <FormSelect
                    label='Female Seats'
                    placeholder='Select female seats'
                    required
                    value={femaleSeats}
                    staticField={false}
                    options={buildSeatSelectOptions(maxFemaleSeats).map((opt) => ({
                        value: opt.value,
                        label: `${opt.label} Female ${opt.label === '1' ? 'Seat' : 'Seats'}`,
                    }))}
                    onChange={(event) => {
                        setFemaleSeats(event.target.value)
                        clearFieldErrors('maleSeats', 'femaleSeats', 'seatCapacity')
                    }}
                    error={fieldErrors.femaleSeats}
                />
                <QuantityStepper
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

'use client'

import { FormEvent, useEffect, useMemo, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import {
    EmailOtpChallenge,
    isBookingEmailVerified,
} from '@/components/auth/EmailOtpChallenge'
import { SeatStepper } from '@/components/booking/SeatStepper'
import { bookingRequestSchema } from '@/components/booking/booking-request.validation'
import { Select } from '@/components/ui/Select'
import { DateField } from '@/components/ui/DateField'
import { PhoneNumberInput } from '@/components/ui/PhoneNumberInput'
import { getApiErrorMessage } from '@/lib/api/errors'
import { MessageCode } from '@/lib/messages/codes'
import { mapZodIssuesToFieldErrors, getMessage } from '@/lib/messages/get-message'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { isClassicTemplate } from '@/lib/templates/chrome'
import { cn } from '@/lib/utils/cn'
import { useOptionalUser } from '@/services/auth/auth.query'
import { useCreateBookingRequest } from '@/services/booking-requests/booking-requests.queries'
import {
    BOOKING_REQUEST_CATEGORIES,
    BOOKING_REQUEST_CATEGORY_LABELS,
    type BookingRequestCategory,
} from '@/services/booking-requests/booking-requests.types'
import { useCountries, usePakistanCities } from '@/services/cities/cities.queries'
import { isValidAgencyId } from '@/services/specialization/specialization.service'
import type { AgencySpecializationCapabilities } from '@/services/specialization/specialization.types'
import {
    UMRAH_BOOKING_DESTINATIONS,
    UMRAH_BOOKING_EXCLUDED_CATEGORIES,
} from '@/components/pages/marketing/home/booking-request-umrah.defaults'

const FIELD =
    'box-border h-11 w-full min-w-0 rounded-xl border border-black/10 bg-white px-3.5 text-sm text-[#111] outline-none transition placeholder:text-[#999] focus:border-[#111]/25'

const CONTROL =
    'box-border h-11 w-full min-w-0 rounded-xl border border-black/10 bg-white px-3.5 text-sm text-[#111] outline-none transition hover:bg-white focus:border-[#111]/25'

function Field({
    label,
    error,
    children,
    className,
}: {
    label: string
    error?: string
    children: ReactNode
    className?: string
}) {
    return (
        <label className={cn('block min-w-0', className)}>
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#888]">
                {label}
            </span>
            {children}
            {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
        </label>
    )
}

export type BookingRequestFormProps = {
    agencyId: string
    capabilities: AgencySpecializationCapabilities
    lockedDestination?: string | null
    listingKind?: 'umrah' | 'international' | null
    umrahPlanId?: string | null
    internationalTourId?: string | null
    title?: string
    subtitle?: string
    submitLabel?: string
    className?: string
    compact?: boolean
}

export function BookingRequestForm({
    agencyId,
    capabilities,
    lockedDestination,
    listingKind,
    umrahPlanId,
    internationalTourId,
    title = 'Send a booking request',
    subtitle = 'Share your trip details and the agency will follow up.',
    submitLabel = 'Send request',
    className,
    compact,
}: BookingRequestFormProps) {
    const variant = useTemplateVariant()
    const classic = isClassicTemplate(variant)
    const { data: user } = useOptionalUser()
    const { mutateAsync: createRequest, isPending } = useCreateBookingRequest()

    const umrahOnly =
        capabilities.hasPackages &&
        !capabilities.hasTours &&
        !capabilities.hasInternational &&
        !capabilities.showTabs
    const internationalOnly =
        capabilities.hasInternational &&
        !capabilities.hasTours &&
        !capabilities.hasPackages &&
        !capabilities.showTabs

    const { data: cities = [] } = usePakistanCities(!umrahOnly && !internationalOnly)
    const { data: countries = [] } = useCountries(internationalOnly)

    const destinations = useMemo(() => {
        if (lockedDestination) return [lockedDestination]
        if (umrahOnly || listingKind === 'umrah') return [...UMRAH_BOOKING_DESTINATIONS]
        if (internationalOnly || listingKind === 'international') return countries
        return cities
    }, [
        lockedDestination,
        umrahOnly,
        internationalOnly,
        listingKind,
        cities,
        countries,
    ])

    const categories = useMemo(() => {
        const all = [...BOOKING_REQUEST_CATEGORIES]
        if (umrahOnly || listingKind === 'umrah') {
            return all.filter((c) => !UMRAH_BOOKING_EXCLUDED_CATEGORIES.includes(c))
        }
        return all
    }, [umrahOnly, listingKind])

    const [maleSeat, setMaleSeat] = useState(0)
    const [femaleSeat, setFemaleSeat] = useState(0)
    const [childSeat, setChildSeat] = useState(0)
    const [travelDate, setTravelDate] = useState('')
    const [destination, setDestination] = useState(lockedDestination || '')
    const [category, setCategory] = useState<BookingRequestCategory | ''>('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (user?.email) setEmail(user.email)
    }, [user?.email])

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formEl = event.currentTarget
        const form = new FormData(formEl)

        const parsed = bookingRequestSchema.safeParse({
            full_name: form.get('full_name'),
            email: email || user?.email || '',
            phone,
            travel_date: travelDate || form.get('travel_date'),
            destination: lockedDestination || destination,
            male_seat: maleSeat,
            female_seat: femaleSeat,
            child_seat: childSeat,
            category,
            request_message: form.get('request_message') || undefined,
            past_history: form.get('past_history') || undefined,
        })

        if (!parsed.success) {
            setFieldErrors(mapZodIssuesToFieldErrors(parsed.error.issues))
            toast.error(getMessage(MessageCode.VALIDATION_FIX_HIGHLIGHTED_FIELDS))
            return
        }

        setFieldErrors({})

        if (!isValidAgencyId(agencyId)) {
            toast.error('Agency context is missing. Reload the page and try again.')
            return
        }

        if (!isBookingEmailVerified(user?.email, parsed.data.email)) {
            setFieldErrors({
                email: getMessage(MessageCode.BOOKING_EMAIL_VERIFY_REQUIRED),
            })
            toast.message(getMessage(MessageCode.BOOKING_EMAIL_VERIFY_REQUIRED))
            return
        }

        try {
            await createRequest({
                ...parsed.data,
                request_message: parsed.data.request_message || undefined,
                past_history:
                    umrahOnly && parsed.data.past_history
                        ? parsed.data.past_history
                        : undefined,
                agency_id: agencyId,
                user_id: user?.id,
                listing_kind: listingKind || undefined,
                umrah_plan_id: umrahPlanId || undefined,
                international_tour_id: internationalTourId || undefined,
            })
            toast.success('Booking request sent')
            formEl.reset()
            setMaleSeat(0)
            setFemaleSeat(0)
            setChildSeat(0)
            setTravelDate('')
            setDestination(lockedDestination || '')
            setCategory('')
            setPhone('')
            if (!user?.email) setEmail('')
        } catch (error) {
            toast.error(
                getApiErrorMessage(error, MessageCode.API_BOOKING_REQUEST_SUBMIT_FAILED)
            )
        }
    }

    return (
        <form
            onSubmit={onSubmit}
            className={cn(
                'min-w-0 space-y-4',
                !compact &&
                    (classic
                        ? 'rounded-2xl border border-black/5 bg-white p-5 md:p-7'
                        : 'rounded-2xl bg-[#F1EBE3] p-5 md:p-7'),
                className
            )}
        >
            <div className="min-w-0">
                <h3 className="text-lg font-semibold tracking-tight text-[#111] md:text-xl">
                    {title}
                </h3>
                {subtitle ? (
                    <p className="mt-1 text-sm leading-relaxed text-[#666]">{subtitle}</p>
                ) : null}
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 pt-4">
                <Field label="Full name" error={fieldErrors.full_name}>
                    <input
                        name="full_name"
                        required
                        className={FIELD}
                        placeholder="Your full name"
                    />
                </Field>

                <div className="sm:col-span-2">
                    <EmailOtpChallenge
                        agencyId={agencyId}
                        email={email}
                        onEmailChange={setEmail}
                        inputClassName={FIELD}
                    />
                    {fieldErrors.email ? (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                    ) : null}
                </div>

                <PhoneNumberInput
                    label="Phone"
                    required
                    value={phone}
                    onChange={setPhone}
                    error={fieldErrors.phone}
                    placeholder="300 1234567"
                />

                <Field label="Travel date" error={fieldErrors.travel_date}>
                    <DateField
                        value={travelDate}
                        onChange={setTravelDate}
                        placeholder="Select date"
                        className={CONTROL}
                    />
                </Field>

                <Field label="Destination" error={fieldErrors.destination}>
                    {lockedDestination ? (
                        <input
                            value={lockedDestination}
                            readOnly
                            className={cn(FIELD, 'truncate text-[#555]')}
                        />
                    ) : (
                        <Select
                            value={destination}
                            onChange={setDestination}
                            placeholder="Select destination"
                            className={CONTROL}
                            options={destinations.map((item) => ({
                                value: item,
                                label: item,
                            }))}
                        />
                    )}
                </Field>

                <Field label="Category" error={fieldErrors.category}>
                    <Select
                        value={category}
                        onChange={(value) => setCategory(value as BookingRequestCategory)}
                        placeholder="Select category"
                        className={CONTROL}
                        options={categories.map((item) => ({
                            value: item,
                            label: BOOKING_REQUEST_CATEGORY_LABELS[item],
                        }))}
                    />
                </Field>
            </div>

            <div className="flex flex-wrap gap-3">
                <SeatStepper
                    label="Male"
                    value={maleSeat}
                    onChange={setMaleSeat}
                    min={0}
                    className="min-w-[11.75rem] flex-[1_0_11.75rem]"
                />
                <SeatStepper
                    label="Female"
                    value={femaleSeat}
                    onChange={setFemaleSeat}
                    min={0}
                    className="min-w-[11.75rem] flex-[1_0_11.75rem]"
                />
                <SeatStepper
                    label="Children"
                    value={childSeat}
                    onChange={setChildSeat}
                    min={0}
                    className="min-w-[11.75rem] flex-[1_0_11.75rem]"
                />
            </div>
            {fieldErrors.male_seat ? (
                <p className="text-xs text-red-600">{fieldErrors.male_seat}</p>
            ) : null}

            {umrahOnly ? (
                <Field label="Past Umrah history">
                    <textarea
                        name="past_history"
                        rows={3}
                        className={cn(FIELD, 'h-auto min-h-[88px] resize-y py-2.5')}
                        placeholder="Previous Umrah experience (optional)"
                    />
                </Field>
            ) : null}

            <Field label="Message">
                <textarea
                    name="request_message"
                    rows={3}
                    className={cn(FIELD, 'h-auto min-h-[88px] resize-y py-2.5')}
                    placeholder="Anything we should know?"
                />
            </Field>

            <button
                type="submit"
                disabled={isPending}
                className={cn(
                    'inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium disabled:opacity-60',
                    variant === 'temp3'
                        ? 'bg-[#0A2F53] text-white transition hover:bg-[#0c3a66]'
                        : 'btn-brand'
                )}
            >
                {isPending ? 'Sending…' : submitLabel}
            </button>
        </form>
    )
}

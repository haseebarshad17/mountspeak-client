'use client'

import {
    HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE,
    //  HP_THEME_LIGHT_BTN_CLASS,
    STATIC_UI_COLORS
} from '@/data/homepage'

import { QuantityStepper } from '@/components/pages/booking/QuantityStepper'
import { Button } from '@/components/ui/button'
import { PAGE_HERO_OVERLAY_CLASS } from '@/components/ui/page-hero-banner'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { getApiErrorMessage } from '@/lib/api/errors'
import { cn } from '@/lib/utils/clsxUtils'
import { getMessage, mapZodIssuesToFieldErrors } from '@/lib/messages/get-message'
import { MessageCode } from '@/lib/messages/codes'
import { useResolvedAgencyId } from '@/hooks/useResolvedAgencyId'
import { usePakistanCities } from '@/services/cities/cities.queries'
import {
    BOOKING_REQUEST_CATEGORIES,
    type BookingRequestCategory,
} from '@/services/booking-requests/booking-requests.types'
import { useCreateBookingRequest } from '@/services/booking-requests/booking-requests.queries'
import { ArrowRight, Calendar } from 'lucide-react'
import React, { FormEvent, useRef, useState } from 'react'
import { toast } from 'sonner'

import {
    bookingRequestSchema,
    getTodayDateInputValue,
    MAX_BOOKING_REQUEST_SEATS,
} from './booking-request.validation'
import { BookingFormSelect } from './BookingFormSelect'

/** Shared booking form field shell — full width in the form column, no per-field max-width that breaks grids. */
const FORM_CONTROL_CLASS =
    'box-border h-12 w-full min-w-0 max-w-full rounded-[10px] border-0 bg-white px-4 font-roboto text-sm font-normal leading-6 tracking-normal text-neutral-900 shadow-sm outline-none transition-shadow placeholder:text-neutral-400 focus:ring-2 focus:ring-white/40 sm:h-[58px] sm:text-base'

const inputClass = FORM_CONTROL_CLASS

const textareaClass = cn(
    FORM_CONTROL_CLASS,
    '!h-auto min-h-[7rem] resize-none py-3 align-top sm:min-h-[7.25rem] sm:py-4',
)

const dateInputClass = cn(
    FORM_CONTROL_CLASS,
    'relative block cursor-pointer pr-11',
    '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0',
)

const formRowClass = 'grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 md:gap-4'

function FormField({
    label,
    children,
    className,
    error,
    errorColor,
}: {
    label: string
    children: React.ReactNode
    className?: string
    error?: string
    errorColor: string
}) {
    return (
        <div className={cn('min-w-0 w-full', className)}>
            <label className='block min-w-0 w-full'>
                <span className='sr-only'>{label}</span>
                {children}
            </label>
            {error ? (
                <p className='mt-1 font-roboto text-xs' style={{ color: errorColor }} role='alert'>
                    {error}
                </p>
            ) : null}
        </div>
    )
}

const BookATour = ({ page }: HomepagePageProps) => {
    const section = page.sections.bookATour
    const colors = STATIC_UI_COLORS
    const formCopy = section.form

    const { mutateAsync: createBookingRequest, isPending } = useCreateBookingRequest()
    const { resolvedAgencyId, isAgencySite, isReady } = useResolvedAgencyId()
    const { data: pakistanCities = [], isLoading: isCitiesLoading } = usePakistanCities()
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [maleSeats, setMaleSeats] = useState(0)
    const [femaleSeats, setFemaleSeats] = useState(0)
    const [travelDate, setTravelDate] = useState('')
    const [destination, setDestination] = useState('')
    const [category, setCategory] = useState('')
    const dateInputRef = useRef<HTMLInputElement>(null)
    const minTravelDate = getTodayDateInputValue()

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
        setFieldErrors({})

        if (!isReady) {
            return
        }

        if (isAgencySite && !resolvedAgencyId) {
            toast.error(getMessage(MessageCode.BOOKING_MISSING_AGENCY))
            return
        }

        const form = event.currentTarget
        const formData = new FormData(form)
        const raw = {
            full_name: String(formData.get('full_name') ?? ''),
            email: String(formData.get('email') ?? ''),
            phone: String(formData.get('phone') ?? ''),
            travel_date: travelDate,
            destination: String(formData.get('destination') ?? ''),
            male_seat: maleSeats,
            female_seat: femaleSeats,
            category: String(formData.get('category') ?? '') as BookingRequestCategory,
            request_message: String(formData.get('request_message') ?? '').trim(),
        }

        const parsed = bookingRequestSchema.safeParse(raw)
        if (!parsed.success) {
            setFieldErrors(mapZodIssuesToFieldErrors(parsed.error.issues))
            toast.error(getMessage(MessageCode.VALIDATION_FIX_HIGHLIGHTED_FIELDS))
            return
        }

        const payload = {
            ...parsed.data,
            request_message: parsed.data.request_message || undefined,
            ...(resolvedAgencyId ? { agency_id: resolvedAgencyId } : {}),
        }

        try {
            await createBookingRequest(payload)
            toast.success(getMessage(MessageCode.SUCCESS_BOOKING_REQUEST_SUBMITTED))
            form.reset()
            setMaleSeats(0)
            setFemaleSeats(0)
            setTravelDate('')
            setDestination('')
            setCategory('')
        } catch (error) {
            toast.error(getApiErrorMessage(error, MessageCode.API_BOOKING_REQUEST_SUBMIT_FAILED))
        }
    }

    return (
        <section
            className='relative overflow-hidden bg-cover bg-center'
            style={{ backgroundImage: `url("${section.backgroundImage}")` }}
            aria-labelledby='book-a-tour-heading'
        >
            <div className={PAGE_HERO_OVERLAY_CLASS} aria-hidden />
            <div className='agency-container relative z-10 py-10 sm:py-16 lg:py-20 xl:py-24'>
                <div className='grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16'>
                    <div className='text-white'>
                        <div className='flex items-center gap-3'>
                            <span
                                className='text-[20px] leading-6 font-semibold uppercase tracking-[0.2em]'
                                style={{ color: colors.textOnDark, fontFamily: 'var(--hp-font-body)' }}
                            >
                                {section.eyebrow}
                            </span>
                            <span className='h-px w-10 bg-white/80 sm:w-12' aria-hidden />
                        </div>

                        <h2
                            className='agency-section-heading pt-4 text-[32px] font-medium leading-tight sm:text-[36px] sm:leading-[42px] lg:text-[40px] lg:leading-[48px]'
                            style={{ color: colors.titleOnDark, fontFamily: 'var(--hp-font-heading)' }}
                        >
                            {section.title}
                        </h2>

                        <p
                            className='pt-5 text-base font-normal leading-6 sm:text-base sm:leading-6'
                            style={{ color: colors.textOnDarkMuted, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {section.paragraphs[0]}
                        </p>

                        <p
                            className='pt-7 text-base font-normal leading-6 sm:text-base sm:leading-6'
                            style={{ color: colors.textOnDarkMuted, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {section.paragraphs[1].includes(section.promoHighlight) ? (
                                <>
                                    {section.paragraphs[1].split(section.promoHighlight)[0]}
                                    <span className='font-semibold' style={{ color: colors.accent }}>
                                        {section.promoHighlight}
                                    </span>
                                    {section.paragraphs[1].split(section.promoHighlight)[1]}
                                </>
                            ) : (
                                section.paragraphs[1]
                            )}
                        </p>

                        <Button
                            variant="link"
                            size='max'
                            className={cn('mt-8 sm:mt-10 text-white')}
                            href={section.cta.href ?? '/search'}
                        >
                            {section.cta.label} <ArrowRight className='h-4 w-4 shrink-0 mt-0.5' aria-hidden />
                        </Button>
                    </div>

                    <div className='min-w-0 w-full max-w-none lg:justify-self-end lg:max-w-[624px]'>
                        <h3
                            id='book-a-tour-heading'
                            className='text-[28px] font-medium leading-tight sm:text-[32px] lg:text-[36px]'
                            style={{ color: colors.titleOnDark, fontFamily: 'var(--hp-font-heading)' }}
                        >
                            {formCopy.title}
                        </h3>
                        <p
                            className='pt-2 text-base font-normal leading-6 tracking-normal'
                            style={{ color: colors.textOnDarkMuted, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {formCopy.subtitle}
                        </p>

                        <form
                            className='mt-5 flex w-full min-w-0 flex-col gap-3 sm:mt-8 sm:gap-4'
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <div className={formRowClass}>
                                <FormField errorColor={colors.error} label='Full name' error={fieldErrors.full_name}>
                                    <input
                                        type='text'
                                        name='full_name'
                                        placeholder={formCopy.placeholders.fullName}
                                        required
                                        className={inputClass}
                                    />
                                </FormField>
                                <FormField errorColor={colors.error} label='Email' error={fieldErrors.email}>
                                    <input
                                        type='email'
                                        name='email'
                                        placeholder={formCopy.placeholders.email}
                                        required
                                        className={inputClass}
                                    />
                                </FormField>
                            </div>

                            <div className={formRowClass}>
                                <FormField errorColor={colors.error} label='Phone' error={fieldErrors.phone}>
                                    <input
                                        type='tel'
                                        name='phone'
                                        placeholder={formCopy.placeholders.phone}
                                        required
                                        className={inputClass}
                                    />
                                </FormField>
                                <FormField errorColor={colors.error} label='Travel date' error={fieldErrors.travel_date}>
                                    <div className='relative min-w-0 w-full'>
                                        <input
                                            ref={dateInputRef}
                                            type='date'
                                            name='travel_date'
                                            value={travelDate}
                                            min={minTravelDate}
                                            required
                                            className={cn(dateInputClass, !travelDate && 'text-transparent')}
                                            onChange={(event) => {
                                                setTravelDate(event.target.value)
                                                clearFieldError('travel_date')
                                            }}
                                            onClick={openDatePicker}
                                        />
                                        {!travelDate ? (
                                            <span
                                                className='pointer-events-none absolute left-4 top-1/2 max-w-[calc(100%-3.25rem)] -translate-y-1/2 truncate font-roboto text-sm font-normal leading-6 tracking-normal text-neutral-400 sm:text-base'
                                                aria-hidden
                                            >
                                                {formCopy.placeholders.travelDate ?? 'Select Travel Date'}
                                            </span>
                                        ) : null}
                                        <button
                                            type='button'
                                            aria-label='Open calendar'
                                            className='absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400'
                                            onClick={openDatePicker}
                                        >
                                            <Calendar className='h-4 w-4 shrink-0' aria-hidden />
                                        </button>
                                    </div>
                                </FormField>
                            </div>

                            <div className={formRowClass}>
                                <FormField errorColor={colors.error} label='Destination' error={fieldErrors.destination}>
                                    <BookingFormSelect
                                        name='destination'
                                        value={destination}
                                        onChange={(next) => {
                                            setDestination(next)
                                            clearFieldError('destination')
                                        }}
                                        placeholder={
                                            isCitiesLoading
                                                ? formCopy.placeholders.destinationLoading
                                                : formCopy.placeholders.destination
                                        }
                                        options={pakistanCities.map((city) => ({
                                            value: city,
                                            label: city,
                                        }))}
                                        disabled={isCitiesLoading}
                                        searchable
                                        searchPlaceholder='Search destination...'
                                        noResultsMessage='No cities found'
                                        aria-label='Destination'
                                    />
                                </FormField>
                                <FormField errorColor={colors.error} label='Category' error={fieldErrors.category}>
                                    <BookingFormSelect
                                        name='category'
                                        value={category}
                                        onChange={(next) => {
                                            setCategory(next)
                                            clearFieldError('category')
                                        }}
                                        placeholder={formCopy.placeholders.category}
                                        options={BOOKING_REQUEST_CATEGORIES.map((item) => ({
                                            value: item,
                                            label: item.charAt(0) + item.slice(1).toLowerCase(),
                                        }))}
                                        aria-label='Category'
                                    />
                                </FormField>
                            </div>

                            <div className={formRowClass}>
                                <FormField errorColor={colors.error} label='Male Seats' error={fieldErrors.male_seat}>
                                    <QuantityStepper
                                        variant='field'
                                        label='Male Seats'
                                        value={maleSeats}
                                        max={MAX_BOOKING_REQUEST_SEATS}
                                        onChange={(value) => {
                                            setMaleSeats(value)
                                            clearFieldError('male_seat')
                                            clearFieldError('female_seat')
                                        }}
                                    />
                                </FormField>
                                <FormField errorColor={colors.error} label='Female Seats' error={fieldErrors.female_seat}>
                                    <QuantityStepper
                                        variant='field'
                                        label='Female Seats'
                                        value={femaleSeats}
                                        max={MAX_BOOKING_REQUEST_SEATS}
                                        onChange={(value) => {
                                            setFemaleSeats(value)
                                            clearFieldError('male_seat')
                                            clearFieldError('female_seat')
                                        }}
                                    />
                                </FormField>
                            </div>

                            <FormField errorColor={colors.error} label='Request message' className='block w-full' error={fieldErrors.request_message}>
                                <textarea
                                    name='request_message'
                                    rows={3}
                                    placeholder={formCopy.placeholders.message}
                                    className={textareaClass}
                                />
                            </FormField>

                            <Button
                                type='submit'
                                variant='default'
                                loading={isPending}
                                loadingText={formCopy.submittingLabel}
                                style={HP_THEME_BTN_STYLE}
                                className={cn('w-full', HP_THEME_BTN_CLASS)}
                            >
                                {formCopy.submitLabel}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BookATour

'use client'

import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE, STATIC_LIGHT_BUTTON, STATIC_UI_COLORS } from '@/data/homepage'

import { QuantityStepper } from '@/components/pages/booking/QuantityStepper'
import { Button } from '@/components/ui/button'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { getApiErrorMessage } from '@/lib/api/errors'
import { cn } from '@/lib/utils/clsxUtils'
import { getMessage, mapZodIssuesToFieldErrors } from '@/lib/messages/get-message'
import { MessageCode } from '@/lib/messages/codes'
import { usePakistanCities } from '@/services/cities/cities.queries'
import {
    BOOKING_REQUEST_CATEGORIES,
    type BookingRequestCategory,
} from '@/services/booking-requests/booking-requests.types'
import { useCreateBookingRequest } from '@/services/booking-requests/booking-requests.queries'
import { Calendar } from 'lucide-react'
import React, { FormEvent, useRef, useState } from 'react'
import { toast } from 'sonner'

import {
    bookingRequestSchema,
    getTodayDateInputValue,
    MAX_BOOKING_REQUEST_SEATS,
} from './booking-request.validation'

const fieldClass =
    'box-border h-[58px] w-full max-w-[304px] rounded-[10px] border-0 bg-white p-4 font-roboto text-base font-normal leading-6 tracking-normal text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-white/40'

const selectClass = `${fieldClass} appearance-none bg-[length:16px] bg-[right_16px_center] bg-no-repeat pr-10`

const textareaClass = `${fieldClass} !h-auto min-h-[58px] resize-none py-4 align-top`

const chevronBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`

const dateInputClass = `${fieldClass} relative w-full cursor-pointer pr-11 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`

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
        <div className={className}>
            <label>
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
    const { data: pakistanCities = [], isLoading: isCitiesLoading } = usePakistanCities()
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [maleSeats, setMaleSeats] = useState(0)
    const [femaleSeats, setFemaleSeats] = useState(0)
    const [travelDate, setTravelDate] = useState('')
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
        }

        try {
            await createBookingRequest(payload)
            toast.success(getMessage(MessageCode.SUCCESS_BOOKING_REQUEST_SUBMITTED))
            form.reset()
            setMaleSeats(0)
            setFemaleSeats(0)
            setTravelDate('')
        } catch (error) {
            toast.error(getApiErrorMessage(error, MessageCode.API_BOOKING_REQUEST_SUBMIT_FAILED))
        }
    }

    return (
        <section
            className='relative bg-cover bg-center'
            style={{ backgroundImage: `url("${section.backgroundImage}")` }}
            aria-labelledby='book-a-tour-heading'
        >
            <div className='agency-container relative z-10 py-14 sm:py-16 lg:py-20 xl:py-24'>
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
                            className='pt-5 text-base font-normal leading-7 sm:text-base sm:leading-8'
                            style={{ color: colors.textOnDarkMuted, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {section.paragraphs[0]}
                        </p>

                        <p
                            className='pt-7 text-base font-normal leading-7 sm:text-base sm:leading-8'
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
                            variant='secondary'
                            className='mt-8 min-w-[200px] sm:mt-10'
                            style={{
                                backgroundColor: STATIC_LIGHT_BUTTON.background,
                                color: STATIC_LIGHT_BUTTON.text,
                            }}
                            href={section.cta.href ?? '/search'}
                        >
                            {section.cta.label}
                        </Button>
                    </div>

                    <div className='w-full max-w-[624px] lg:justify-self-end'>
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
                            className='mt-6 flex w-full max-w-[624px] flex-col gap-4 sm:mt-8'
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <FormField errorColor={colors.error} label='Full name' error={fieldErrors.full_name}>
                                    <input
                                        type='text'
                                        name='full_name'
                                        placeholder={formCopy.placeholders.fullName}
                                        required
                                        className={fieldClass}
                                    />
                                </FormField>
                                <FormField errorColor={colors.error} label='Email' error={fieldErrors.email}>
                                    <input
                                        type='email'
                                        name='email'
                                        placeholder={formCopy.placeholders.email}
                                        required
                                        className={fieldClass}
                                    />
                                </FormField>
                            </div>

                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <FormField errorColor={colors.error} label='Phone' error={fieldErrors.phone}>
                                    <input
                                        type='tel'
                                        name='phone'
                                        placeholder={formCopy.placeholders.phone}
                                        required
                                        className={fieldClass}
                                    />
                                </FormField>
                                <FormField errorColor={colors.error} label='Travel date' error={fieldErrors.travel_date}>
                                    <div className='relative w-full max-w-[304px]'>
                                        <input
                                            ref={dateInputRef}
                                            type='date'
                                            name='travel_date'
                                            value={travelDate}
                                            min={minTravelDate}
                                            required
                                            className={dateInputClass}
                                            onChange={(event) => {
                                                setTravelDate(event.target.value)
                                                clearFieldError('travel_date')
                                            }}
                                            onClick={openDatePicker}
                                        />
                                        <button
                                            type='button'
                                            aria-label='Open calendar'
                                            className='absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500'
                                            onClick={openDatePicker}
                                        >
                                            <Calendar className='h-4 w-4' aria-hidden />
                                        </button>
                                    </div>
                                </FormField>
                            </div>

                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <FormField errorColor={colors.error} label='Destination' error={fieldErrors.destination}>
                                    <select
                                        name='destination'
                                        defaultValue=''
                                        required
                                        disabled={isCitiesLoading}
                                        className={selectClass}
                                        style={{ backgroundImage: chevronBg }}
                                        onChange={() => clearFieldError('destination')}
                                    >
                                        <option value='' disabled>
                                            {isCitiesLoading
                                                ? formCopy.placeholders.destinationLoading
                                                : formCopy.placeholders.destination}
                                        </option>
                                        {pakistanCities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>
                                <FormField errorColor={colors.error} label='Category' error={fieldErrors.category}>
                                    <select
                                        name='category'
                                        defaultValue=''
                                        required
                                        className={selectClass}
                                        style={{ backgroundImage: chevronBg }}
                                        onChange={() => clearFieldError('category')}
                                    >
                                        <option value='' disabled>
                                            {formCopy.placeholders.category}
                                        </option>
                                        {BOOKING_REQUEST_CATEGORIES.map((category) => (
                                            <option key={category} value={category}>
                                                {category.charAt(0) + category.slice(1).toLowerCase()}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>
                            </div>

                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
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
                                    className={`${textareaClass} !max-w-[624px] w-full`}
                                />
                            </FormField>

                            <Button
                                type='submit'
                                variant='default'
                                disabled={isPending}
                                style={HP_THEME_BTN_STYLE}
                                className={cn('w-full max-w-[624px]', HP_THEME_BTN_CLASS)}
                            >
                                {isPending ? formCopy.submittingLabel : formCopy.submitLabel}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BookATour

'use client'

import { Button } from '@/components/ui/button'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { getApiErrorMessage } from '@/lib/api/errors'
import Link from 'next/link'
import { usePakistanCities } from '@/services/cities/cities.queries'
import {
    BOOKING_REQUEST_CATEGORIES,
    type BookingRequestCategory,
} from '@/services/booking-requests/booking-requests.types'
import { useCreateBookingRequest } from '@/services/booking-requests/booking-requests.queries'
import { Calendar } from 'lucide-react'
import React, { FormEvent, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const fieldClass =
    'box-border h-[58px] w-full max-w-[304px] rounded-[10px] border-0 bg-white p-4 font-roboto text-base font-normal leading-6 tracking-normal text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-white/40'

const selectClass = `${fieldClass} appearance-none bg-[length:16px] bg-[right_16px_center] bg-no-repeat pr-10`

const textareaClass = `${fieldClass} !h-auto min-h-[58px] resize-none py-4 align-top`

const chevronBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`

const seatOptions = Array.from({ length: 11 }, (_, index) => index)

const bookingRequestSchema = z.object({
    full_name: z.string().trim().min(2, 'Full name is required.'),
    email: z.string().trim().email('Please enter a valid email.'),
    phone: z
        .string()
        .trim()
        .min(7, 'Phone number is required.')
        .regex(/^\+?[0-9\s-]{7,20}$/, 'Enter a valid phone number.'),
    travel_date: z.string().min(1, 'Travel date is required.'),
    destination: z.string().min(1, 'Please select a destination.'),
    male_seat: z.coerce.number().int().min(0).max(50),
    female_seat: z.coerce.number().int().min(0).max(50),
    category: z.enum(BOOKING_REQUEST_CATEGORIES),
    request_message: z.string().trim().optional(),
}).refine((data) => data.male_seat + data.female_seat >= 1, {
    message: 'At least one seat is required.',
    path: ['male_seat'],
})

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
    const { colors, buttons } = page.theme
    const formCopy = section.form

    const { mutateAsync: createBookingRequest, isPending } = useCreateBookingRequest()
    const { data: pakistanCities = [], isLoading: isCitiesLoading } = usePakistanCities()
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFieldErrors({})

        const form = event.currentTarget
        const formData = new FormData(form)
        const raw = {
            full_name: String(formData.get('full_name') ?? ''),
            email: String(formData.get('email') ?? ''),
            phone: String(formData.get('phone') ?? ''),
            travel_date: String(formData.get('travel_date') ?? ''),
            destination: String(formData.get('destination') ?? ''),
            male_seat: formData.get('male_seat'),
            female_seat: formData.get('female_seat'),
            category: String(formData.get('category') ?? '') as BookingRequestCategory,
            request_message: String(formData.get('request_message') ?? '').trim(),
        }

        const parsed = bookingRequestSchema.safeParse(raw)
        if (!parsed.success) {
            const nextErrors: Record<string, string> = {}
            parsed.error.issues.forEach((issue) => {
                const key = String(issue.path[0] ?? 'form')
                if (!nextErrors[key]) nextErrors[key] = issue.message
            })
            setFieldErrors(nextErrors)
            toast.error(formCopy.validationToast)
            return
        }

        const payload = {
            ...parsed.data,
            request_message: parsed.data.request_message || undefined,
        }

        try {
            await createBookingRequest(payload)
            toast.success(formCopy.successToast)
            form.reset()
        } catch (error) {
            toast.error(getApiErrorMessage(error, formCopy.errorToast))
        }
    }

    return (
        <section
            className='relative mb-[88px] bg-cover bg-center'
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
                            className='mt-8 h-12 min-w-[200px] rounded-full border-0 px-8 text-base font-medium sm:mt-10'
                            style={{
                                backgroundColor: buttons.secondary.background,
                                color: buttons.secondary.text,
                            }}
                            asChild
                        >
                            <Link href={section.cta.href ?? '/search'}>{section.cta.label}</Link>
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
                                            type='date'
                                            name='travel_date'
                                            required
                                            className={`${fieldClass} w-full pr-11 [&::-webkit-calendar-picker-indicator]:opacity-0`}
                                        />
                                        <Calendar
                                            className='pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500'
                                            aria-hidden
                                        />
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
                                <FormField errorColor={colors.error} label='Male seats' error={fieldErrors.male_seat}>
                                    <select
                                        name='male_seat'
                                        defaultValue='0'
                                        className={selectClass}
                                        style={{ backgroundImage: chevronBg }}
                                    >
                                        {seatOptions.map((count) => (
                                            <option key={`male-${count}`} value={count}>
                                                {count} Male {count === 1 ? 'Seat' : 'Seats'}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>
                                <FormField errorColor={colors.error} label='Female seats' error={fieldErrors.female_seat}>
                                    <select
                                        name='female_seat'
                                        defaultValue='0'
                                        className={selectClass}
                                        style={{ backgroundImage: chevronBg }}
                                    >
                                        {seatOptions.map((count) => (
                                            <option key={`female-${count}`} value={count}>
                                                {count} Female {count === 1 ? 'Seat' : 'Seats'}
                                            </option>
                                        ))}
                                    </select>
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
                                className='!flex h-[58px] w-full max-w-[624px] rounded-[100px] px-8 text-base font-normal leading-6 tracking-normal disabled:cursor-not-allowed disabled:opacity-70'
                                style={{
                                    backgroundColor: buttons.primary.background,
                                    color: buttons.primary.text,
                                }}
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

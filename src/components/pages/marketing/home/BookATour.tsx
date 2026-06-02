'use client'

import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/errors'
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
}: {
    label: string
    children: React.ReactNode
    className?: string
    error?: string
}) {
    return (
        <div className={className}>
            <label>
                <span className='sr-only'>{label}</span>
                {children}
            </label>
            {error ? (
                <p className='mt-1 font-roboto text-xs text-[#ffb4b4]' role='alert'>
                    {error}
                </p>
            ) : null}
        </div>
    )
}

const BookATour = () => {
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
            toast.error('Please fix the highlighted fields.')
            return
        }

        const payload = {
            ...parsed.data,
            request_message: parsed.data.request_message || undefined,
        }

        try {
            await createBookingRequest(payload)
            toast.success('Booking request submitted successfully. We will contact you soon.')
            form.reset()
        } catch (error) {
            toast.error(getApiErrorMessage(error, 'Unable to submit booking request. Please try again.'))
        }
    }

    return (
        <section
            className="relative mb-[88px] bg-[url('/images/pages/home/testimonial-background.png')] bg-cover bg-center"
            aria-labelledby='book-a-tour-heading'
        >
            <div className='agency-container relative z-10 py-14 sm:py-16 lg:py-20 xl:py-24'>
                <div className='grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16'>
                    <div className='text-white'>
                        <div className='flex items-center gap-3'>
                            <span className='font-roboto text-[20px] leading-6 font-semibold uppercase tracking-[0.2em] text-white'>
                                Booking
                            </span>
                            <span className='h-px w-10 bg-white/80 sm:w-12' aria-hidden />
                        </div>

                        <h2 className='agency-section-heading pt-4 text-[32px] font-medium leading-tight text-white sm:text-[36px] sm:leading-[42px] lg:text-[40px] lg:leading-[48px]'>
                            Online Booking
                        </h2>

                        <p className='pt-5 font-roboto text-base font-normal leading-7 text-white/90 sm:text-base sm:leading-8'>
                            North Trips &amp; Travel is a trusted travel agency in Pakistan, offering customized tour
                            packages, hotel bookings, and complete travel solutions for families, groups, and corporate
                            clients.
                        </p>

                        <p className='pt-7 font-roboto text-base font-normal leading-7 text-white/90 sm:text-base sm:leading-8'>
                            Get{' '}
                            <span className='font-semibold text-[#F5D547]'>50% Off</span> on your first adventure trip
                            with us. Submit your booking request today and enjoy unforgettable travel experiences at the
                            best prices.
                        </p>

                        <Button
                            variant='secondary'
                            className='mt-8 h-12 min-w-[200px] rounded-full border-0 bg-[#F2F2F2] px-8 font-roboto text-base font-medium text-[#276968] hover:bg-white sm:mt-10'
                        >
                            View All Packages
                        </Button>
                    </div>

                    <div className='w-full max-w-[624px] lg:justify-self-end'>
                        <h3
                            id='book-a-tour-heading'
                            className='font-jost text-[28px] font-medium leading-tight text-white sm:text-[32px] lg:text-[36px]'
                        >
                            Booking Request
                        </h3>
                        <p className='pt-2 font-roboto text-base font-normal leading-6 tracking-normal text-white/90'>
                            Share your travel details and our team will confirm availability for your trip.
                        </p>

                        <form
                            className='mt-6 flex w-full max-w-[624px] flex-col gap-4 sm:mt-8'
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <FormField label='Full name' error={fieldErrors.full_name}>
                                    <input
                                        type='text'
                                        name='full_name'
                                        placeholder='Your Name *'
                                        required
                                        className={fieldClass}
                                    />
                                </FormField>
                                <FormField label='Email' error={fieldErrors.email}>
                                    <input
                                        type='email'
                                        name='email'
                                        placeholder='Your Email *'
                                        required
                                        className={fieldClass}
                                    />
                                </FormField>
                            </div>

                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <FormField label='Phone' error={fieldErrors.phone}>
                                    <input
                                        type='tel'
                                        name='phone'
                                        placeholder='Your Phone *'
                                        required
                                        className={fieldClass}
                                    />
                                </FormField>
                                <FormField label='Travel date' error={fieldErrors.travel_date}>
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
                                <FormField label='Destination' error={fieldErrors.destination}>
                                    <select
                                        name='destination'
                                        defaultValue=''
                                        required
                                        disabled={isCitiesLoading}
                                        className={selectClass}
                                        style={{ backgroundImage: chevronBg }}
                                    >
                                        <option value='' disabled>
                                            {isCitiesLoading ? 'Loading cities...' : 'Select Destination'}
                                        </option>
                                        {pakistanCities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>
                                <FormField label='Category' error={fieldErrors.category}>
                                    <select
                                        name='category'
                                        defaultValue=''
                                        required
                                        className={selectClass}
                                        style={{ backgroundImage: chevronBg }}
                                    >
                                        <option value='' disabled>
                                            Select Category
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
                                <FormField label='Male seats' error={fieldErrors.male_seat}>
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
                                <FormField label='Female seats' error={fieldErrors.female_seat}>
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

                            <FormField label='Request message' className='block w-full' error={fieldErrors.request_message}>
                                <textarea
                                    name='request_message'
                                    rows={3}
                                    placeholder='Special Request (optional)'
                                    className={`${textareaClass} !max-w-[624px] w-full`}
                                />
                            </FormField>

                            <Button
                                type='submit'
                                variant='default'
                                disabled={isPending}
                                className='!flex h-[58px] w-full max-w-[624px] rounded-[100px] bg-[#276968] px-8 font-roboto text-base font-normal leading-6 tracking-normal text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70'
                            >
                                {isPending ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BookATour

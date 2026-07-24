'use client'

import {
    HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE,
    STATIC_UI_COLORS
} from '@/data/homepage'

import { QuantityStepper } from '@/components/pages/booking/QuantityStepper'
import { BookingEmailOtpGate } from '@/components/pages/booking/steps/BookingEmailOtpGate'
import { Button } from '@/components/ui/button'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { getApiErrorMessage } from '@/lib/api/errors'
import { cn } from '@/lib/utils/clsxUtils'
import { getMessage, mapZodIssuesToFieldErrors } from '@/lib/messages/get-message'
import { MessageCode } from '@/lib/messages/codes'
import { useBookingRequestEmailGate } from '@/hooks/useBookingRequestEmailGate'
import { useSiteListingCopy } from '@/hooks/useTourOrPackageCopy'
import { adaptTourCopyForUmrah } from '@/lib/homepage/specialization'
import { useCountries, usePakistanCities } from '@/services/cities/cities.queries'
import {
    BOOKING_REQUEST_CATEGORIES,
    BOOKING_REQUEST_CATEGORY_LABELS,
    type BookingRequestCategory,
} from '@/services/booking-requests/booking-requests.types'
import { useCreateBookingRequest } from '@/services/booking-requests/booking-requests.queries'
import { ArrowRight, Calendar } from 'lucide-react'
import React, { FormEvent, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import {
    UMRAH_BOOKING_DESTINATIONS,
    UMRAH_BOOKING_EXCLUDED_CATEGORIES,
} from './booking-request-umrah.defaults'

import {
    bookingRequestSchema,
    getTodayDateInputValue,
    MAX_BOOKING_REQUEST_SEATS,
} from './booking-request.validation'
import { BookingFormSelect } from './BookingFormSelect'
import { useTemplateStyles } from '@/components/providers/TemplateStylesProvider'

import {
    marketingFormInputClass,
    marketingFormRowClass,
    marketingFormTextareaClass,
    MarketingFormField,
} from '@/components/forms/marketing-form'

const dateInputClass = cn(
    marketingFormInputClass,
    'relative block cursor-pointer pr-11',
    '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0',
)

const BookATour = ({ page }: HomepagePageProps) => {
    const section = page.sections.bookATour
    const colors = STATIC_UI_COLORS
    const formCopy = section.form
    const bookATour = useTemplateStyles().pages.home.bookATour

    const { mutateAsync: createBookingRequest, isPending } = useCreateBookingRequest()
    const {
        resolvedAgencyId,
        isAgencySite,
        isReady,
        requireEmailVerification,
        emailVerified,
        verifiedEmail,
        userId,
        emailRedirectTo,
        handleEmailVerified,
        requireUser,
    } = useBookingRequestEmailGate({ returnPath: '/#book-a-tour-heading' })
    const { isUmrahSite, isMultiSpec, isInternationalSite, copy: listingCopy } = useSiteListingCopy()
    const usesUmrahBookingForm = isUmrahSite && !isMultiSpec
    const useCountryDestinations = isInternationalSite && !isMultiSpec
    const bookEyebrow = adaptTourCopyForUmrah(section.eyebrow, usesUmrahBookingForm)
    const bookTitle = adaptTourCopyForUmrah(section.title, usesUmrahBookingForm)
    const bookParagraphs = section.paragraphs.map((paragraph) =>
        adaptTourCopyForUmrah(paragraph, usesUmrahBookingForm),
    )
    const { data: pakistanCities = [], isLoading: isCitiesLoading } = usePakistanCities(
        !useCountryDestinations && !usesUmrahBookingForm,
    )
    const { data: countries = [], isLoading: isCountriesLoading } = useCountries(useCountryDestinations)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [maleSeats, setMaleSeats] = useState(0)
    const [femaleSeats, setFemaleSeats] = useState(0)
    const [childSeats, setChildSeats] = useState(0)
    const [travelDate, setTravelDate] = useState('')
    const [destination, setDestination] = useState('')
    const [category, setCategory] = useState('')
    const [pastHistory, setPastHistory] = useState('')
    const dateInputRef = useRef<HTMLInputElement>(null)
    const minTravelDate = getTodayDateInputValue()
    const showOtpGate =
        requireEmailVerification && !emailVerified && !!resolvedAgencyId && !!emailRedirectTo

    const categoryOptions = useMemo(() => {
        const categories = usesUmrahBookingForm
            ? BOOKING_REQUEST_CATEGORIES.filter(
                  (item) => !UMRAH_BOOKING_EXCLUDED_CATEGORIES.includes(item),
              )
            : BOOKING_REQUEST_CATEGORIES

        return categories.map((item) => ({
            value: item,
            label: BOOKING_REQUEST_CATEGORY_LABELS[item],
        }))
    }, [usesUmrahBookingForm])

    const destinationOptions = useMemo(() => {
        if (usesUmrahBookingForm) {
            return UMRAH_BOOKING_DESTINATIONS.map((city) => ({
                value: city,
                label: city,
            }))
        }

        if (useCountryDestinations) {
            return [...countries]
                .sort((a, b) => a.localeCompare(b))
                .map((country) => ({
                    value: country,
                    label: country,
                }))
        }

        return pakistanCities.map((city) => ({
            value: city,
            label: city,
        }))
    }, [usesUmrahBookingForm, useCountryDestinations, countries, pakistanCities])

    const isDestinationLoading = usesUmrahBookingForm
        ? false
        : useCountryDestinations
          ? isCountriesLoading
          : isCitiesLoading
    const destinationLoadingPlaceholder = useCountryDestinations
        ? 'Loading countries...'
        : formCopy.placeholders.destinationLoading
    const destinationSearchPlaceholder = useCountryDestinations
        ? 'Search country...'
        : 'Search destination...'
    const destinationNoResultsMessage = useCountryDestinations
        ? 'No countries found'
        : 'No cities found'

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
        const form = event.currentTarget
        setFieldErrors({})

        if (!isReady) {
            return
        }

        if (isAgencySite && !resolvedAgencyId) {
            toast.error(getMessage(MessageCode.BOOKING_MISSING_AGENCY))
            return
        }

        if (requireEmailVerification && !emailVerified) {
            toast.error('Verify your email to continue')
            return
        }

        const formData = new FormData(form)
        const sessionUser = await requireUser()
        const submitUserId = sessionUser?.id ?? userId
        if (resolvedAgencyId && !submitUserId) {
            toast.error('Verify your email to continue')
            return
        }

        const emailValue =
            (verifiedEmail && emailVerified
                ? verifiedEmail
                : String(formData.get('email') ?? '')
            ).trim().toLowerCase()
        const raw = {
            full_name: String(formData.get('full_name') ?? ''),
            email: emailValue,
            phone: String(formData.get('phone') ?? ''),
            travel_date: travelDate,
            destination: String(formData.get('destination') ?? ''),
            male_seat: maleSeats,
            female_seat: femaleSeats,
            child_seat: childSeats,
            category: String(formData.get('category') ?? '') as BookingRequestCategory,
            request_message: String(formData.get('request_message') ?? '').trim(),
        }

        const parsed = bookingRequestSchema.safeParse(raw)
        if (!parsed.success) {
            setFieldErrors(mapZodIssuesToFieldErrors(parsed.error.issues))
            toast.error(getMessage(MessageCode.VALIDATION_FIX_HIGHLIGHTED_FIELDS))
            return
        }

        const pastHistoryTrimmed = pastHistory.trim()
        const payload = {
            ...parsed.data,
            request_message: parsed.data.request_message || undefined,
            ...(resolvedAgencyId ? { agency_id: resolvedAgencyId } : {}),
            ...(submitUserId ? { user_id: submitUserId } : {}),
            ...(usesUmrahBookingForm && pastHistoryTrimmed
                ? { past_history: pastHistoryTrimmed }
                : {}),
        }

        try {
            await createBookingRequest(payload)
            toast.success(getMessage(MessageCode.SUCCESS_BOOKING_REQUEST_SUBMITTED))
            form.reset()
            setMaleSeats(0)
            setFemaleSeats(0)
            setChildSeats(0)
            setTravelDate('')
            setDestination('')
            setCategory('')
            setPastHistory('')
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
            <div
                className={cn(bookATour.overlay)}
                aria-hidden
            />
            <div className='agency-container relative z-10 py-10 sm:py-16 lg:py-20 xl:py-24'>
                <div className={cn(bookATour.grid)}>
                    <div className={cn(bookATour.copy)}>
                        <div className='flex items-center gap-3'>
                            <span
                                className='text-[20px] leading-6 font-semibold uppercase tracking-[0.2em]'
                                style={{ color: colors.textOnDark, fontFamily: 'var(--hp-font-body)' }}
                            >
                                {bookEyebrow}
                            </span>
                            <span className='h-px w-10 bg-white/80 sm:w-12' aria-hidden />
                        </div>

                        <h2
                            className='agency-section-heading pt-4 text-[32px] font-medium leading-tight sm:text-[36px] sm:leading-[42px] lg:text-[40px] lg:leading-[48px]'
                            style={{ color: colors.titleOnDark, fontFamily: 'var(--hp-font-heading)' }}
                        >
                            {bookTitle}
                        </h2>

                        <p
                            className='pt-5 text-base font-normal leading-6 sm:text-base sm:leading-6'
                            style={{ color: colors.textOnDarkMuted, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {bookParagraphs[0]}
                        </p>

                        <p
                            className='pt-7 text-base font-normal leading-6 sm:text-base sm:leading-6'
                            style={{ color: colors.textOnDarkMuted, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {bookParagraphs[1].includes(section.promoHighlight) ? (
                                <>
                                    {bookParagraphs[1].split(section.promoHighlight)[0]}
                                    <span className='font-semibold' style={{ color: colors.accent }}>
                                        {section.promoHighlight}
                                    </span>
                                    {bookParagraphs[1].split(section.promoHighlight)[1]}
                                </>
                            ) : (
                                bookParagraphs[1]
                            )}
                        </p>

                        <Button
                            variant="link"
                            size='max'
                            className={cn('mt-8 sm:mt-10 text-white')}
                            href={section.cta.href ?? '/search'}
                        >
                            {listingCopy.viewAllLabel} <ArrowRight className='h-4 w-4 shrink-0 mt-0.5' aria-hidden />
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

                        <div className={cn('mt-5 sm:mt-8', bookATour.formPanel)}>
                        <form
                            className='flex w-full min-w-0 flex-col gap-3 sm:gap-4'
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            {showOtpGate && resolvedAgencyId && emailRedirectTo ? (
                                <BookingEmailOtpGate
                                    agencyId={resolvedAgencyId}
                                    agencySiteUrl={undefined}
                                    emailRedirectTo={emailRedirectTo}
                                    onVerified={(email) => {
                                        void handleEmailVerified(email)
                                    }}
                                />
                            ) : null}

                            <div className={marketingFormRowClass}>
                                <MarketingFormField errorColor={colors.error} label='Full name' error={fieldErrors.full_name}>
                                    <input
                                        type='text'
                                        name='full_name'
                                        placeholder={formCopy.placeholders.fullName}
                                        required
                                        className={marketingFormInputClass}
                                    />
                                </MarketingFormField>
                                <MarketingFormField errorColor={colors.error} label='Email' error={fieldErrors.email}>
                                    <input
                                        type='email'
                                        name='email'
                                        placeholder={formCopy.placeholders.email}
                                        required
                                        readOnly={Boolean(emailVerified && verifiedEmail)}
                                        defaultValue={verifiedEmail ?? undefined}
                                        key={verifiedEmail ?? 'email-open'}
                                        className={cn(
                                            marketingFormInputClass,
                                            emailVerified && verifiedEmail ? 'bg-neutral-50 text-neutral-700' : null,
                                        )}
                                    />
                                </MarketingFormField>
                            </div>

                            <div className={marketingFormRowClass}>
                                <MarketingFormField errorColor={colors.error} label='Phone' error={fieldErrors.phone}>
                                    <input
                                        type='tel'
                                        name='phone'
                                        placeholder={formCopy.placeholders.phone}
                                        required
                                        className={marketingFormInputClass}
                                    />
                                </MarketingFormField>
                                <MarketingFormField errorColor={colors.error} label='Travel date' error={fieldErrors.travel_date}>
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
                                                className='pointer-events-none absolute left-4 top-1/2 max-w-[calc(100%-3.25rem)] -translate-y-1/2 truncate font-roboto text-sm font-normal leading-5 tracking-normal text-neutral-400'
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
                                </MarketingFormField>
                            </div>

                            <div className={marketingFormRowClass}>
                                <MarketingFormField errorColor={colors.error} label='Destination' error={fieldErrors.destination}>
                                    <BookingFormSelect
                                        name='destination'
                                        value={destination}
                                        onChange={(next) => {
                                            setDestination(next)
                                            clearFieldError('destination')
                                        }}
                                        placeholder={
                                            isDestinationLoading
                                                ? destinationLoadingPlaceholder
                                                : formCopy.placeholders.destination
                                        }
                                        options={destinationOptions}
                                        disabled={isDestinationLoading}
                                        searchable={!usesUmrahBookingForm}
                                        searchPlaceholder={destinationSearchPlaceholder}
                                        noResultsMessage={destinationNoResultsMessage}
                                        aria-label='Destination'
                                    />
                                </MarketingFormField>
                                <MarketingFormField errorColor={colors.error} label='Category' error={fieldErrors.category}>
                                    <BookingFormSelect
                                        name='category'
                                        value={category}
                                        onChange={(next) => {
                                            setCategory(next)
                                            clearFieldError('category')
                                        }}
                                        placeholder={formCopy.placeholders.category}
                                        options={categoryOptions}
                                        aria-label='Category'
                                    />
                                </MarketingFormField>
                            </div>

                            <div className={marketingFormRowClass}>
                                <MarketingFormField errorColor={colors.error} label='Male Seats' error={fieldErrors.male_seat}>
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
                                </MarketingFormField>
                                <MarketingFormField errorColor={colors.error} label='Female Seats' error={fieldErrors.female_seat}>
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
                                </MarketingFormField>
                            </div>

                            <MarketingFormField
                                errorColor={colors.error}
                                label='Children'
                                className='block w-full'
                                error={fieldErrors.child_seat}
                            >
                                <QuantityStepper
                                    variant='field'
                                    label='Children'
                                    value={childSeats}
                                    max={MAX_BOOKING_REQUEST_SEATS}
                                    onChange={(value) => {
                                        setChildSeats(value)
                                        clearFieldError('child_seat')
                                    }}
                                />
                            </MarketingFormField>

                            {usesUmrahBookingForm ? (
                                <MarketingFormField
                                    errorColor={colors.error}
                                    label='Past travel / Umrah history'
                                    className='block w-full'
                                >
                                    <textarea
                                        name='past_history'
                                        rows={3}
                                        value={pastHistory}
                                        onChange={(event) => setPastHistory(event.target.value)}
                                        placeholder='Share any previous Umrah or travel history (optional).'
                                        className={marketingFormTextareaClass}
                                    />
                                </MarketingFormField>
                            ) : null}

                            <MarketingFormField errorColor={colors.error} label='Request message' className='block w-full' error={fieldErrors.request_message}>
                                <textarea
                                    name='request_message'
                                    rows={3}
                                    placeholder={formCopy.placeholders.message}
                                    className={marketingFormTextareaClass}
                                />
                            </MarketingFormField>

                            <Button
                                type='submit'
                                variant='default'
                                loading={isPending}
                                loadingText={formCopy.submittingLabel}
                                shouldScale
                                disabled={Boolean(requireEmailVerification && !emailVerified)}
                                style={HP_THEME_BTN_STYLE}
                                className={cn('w-full', HP_THEME_BTN_CLASS)}
                            >
                                {formCopy.submitLabel}
                            </Button>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BookATour

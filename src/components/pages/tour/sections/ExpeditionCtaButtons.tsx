'use client'

import { Button } from '@/components/ui/button'
import { useBookingHref } from '@/hooks/useAgencyPreviewBase'
import { cn } from '@/lib/utils/clsxUtils'
import {
    isInquiryOnlyTourPage,
    scrollToPackageBookingRequest,
} from '@/lib/tours/tour-inquiry-cta'

import type { TourPage } from './tour-page.types'

type ExpeditionCtaButton = TourPage['finalCtaSection']['buttons'][number]

type ExpeditionCtaButtonsProps = {
    buttons: ExpeditionCtaButton[]
    theme: TourPage['theme']
    tourSlug: string
    listingKind?: TourPage['listingKind']
    className?: string
    buttonClassName?: string
    /** Disables primary booking CTAs (past start date). */
    bookingClosed?: boolean
}

export function ExpeditionCtaButtons({
    buttons,
    theme,
    tourSlug,
    listingKind,
    className,
    buttonClassName,
    bookingClosed = false,
}: ExpeditionCtaButtonsProps) {
    const bookingHref = useBookingHref(tourSlug, null, listingKind)
    const inquiryOnly = isInquiryOnlyTourPage({ listingKind })

    if (buttons.length === 0) return null

    return (
        <div className={cn('flex flex-wrap gap-4', className)}>
            {buttons.map((btn) => {
                const isPrimary = btn.style === 'primary'
                const isDisabledBooking = isPrimary && bookingClosed

                return (
                    <Button
                        key={btn.label}
                        href={
                            isDisabledBooking
                                ? undefined
                                : isPrimary && inquiryOnly
                                  ? undefined
                                  : isPrimary
                                    ? bookingHref
                                    : btn.url
                        }
                        onClick={
                            isPrimary && inquiryOnly && !bookingClosed
                                ? scrollToPackageBookingRequest
                                : undefined
                        }
                        disabled={isDisabledBooking}
                        variant={isPrimary ? 'default' : 'outline'}
                        className={cn(
                            'w-full sm:max-w-[257px]',
                            !isPrimary && 'border-[#737879] text-neutral-900 hover:bg-neutral-50',
                            isDisabledBooking && 'opacity-60',
                            buttonClassName,
                        )}
                        style={
                            isPrimary
                                ? {
                                      backgroundColor: theme.secondaryColor,
                                      borderColor: theme.secondaryColor,
                                  }
                                : undefined
                        }
                    >
                        {isDisabledBooking ? 'Booking Closed' : btn.label}
                    </Button>
                )
            })}
        </div>
    )
}

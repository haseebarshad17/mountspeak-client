'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useBookingHref } from '@/hooks/useAgencyPreviewBase'
import { cn } from '@/lib/utils/clsxUtils'
import {
    isInquiryOnlyTourPage,
    scrollToPackageBookingRequest,
} from '@/lib/tours/tour-inquiry-cta'

import type { TourPage } from './tour-page.types'

type TourFloatingBookBarProps = {
    page: TourPage
}

export function TourFloatingBookBar({ page }: TourFloatingBookBarProps) {
    const { finalCtaSection, theme, isBookingClosed } = page
    const primaryButton = finalCtaSection.buttons.find((btn) => btn.style === 'primary')
    const bookingHref = useBookingHref(page.slug)
    const inquiryOnly = isInquiryOnlyTourPage(page)
    const [isFooterVisible, setIsFooterVisible] = useState(false)

    useEffect(() => {
        const scrollRoot = document.getElementById('app-scroll-container')
        const footer = document.getElementById('marketing-footer')

        if (!scrollRoot || !footer) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsFooterVisible(entry.isIntersecting)
            },
            {
                root: scrollRoot,
                threshold: 0,
                rootMargin: '0px 0px 0px 0px',
            },
        )

        observer.observe(footer)

        return () => observer.disconnect()
    }, [])

    if (!primaryButton) return null

    return (
        <div
            className={cn(
                'pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex justify-center transition-all duration-300 ease-out lg:hidden',
                'pb-[max(1rem,env(safe-area-inset-bottom))]',
                isFooterVisible
                    ? 'translate-y-[calc(100%+1rem)] opacity-0'
                    : 'translate-y-0 opacity-100',
            )}
            aria-label={
                inquiryOnly
                    ? 'Request booking for this tour'
                    : isBookingClosed
                      ? 'Booking closed for this tour'
                      : 'Book this tour'
            }
            aria-hidden={isFooterVisible}
        >
            <Button
                href={
                    inquiryOnly || isBookingClosed ? undefined : bookingHref
                }
                onClick={
                    inquiryOnly && !isBookingClosed
                        ? scrollToPackageBookingRequest
                        : undefined
                }
                disabled={isBookingClosed === true && !inquiryOnly}
                variant="default"
                className={cn(
                    'pointer-events-auto h-11 rounded-full px-12 text-xs shadow-[0_8px_28px_rgba(0,0,0,0.22)]',
                    isFooterVisible && 'pointer-events-none',
                    isBookingClosed && !inquiryOnly && 'opacity-60 shadow-none',
                )}
                style={{
                    backgroundColor: theme.secondaryColor,
                    borderColor: theme.secondaryColor,
                }}
            >
                {isBookingClosed && !inquiryOnly ? 'Booking Closed' : primaryButton.label}
            </Button>
        </div>
    )
}

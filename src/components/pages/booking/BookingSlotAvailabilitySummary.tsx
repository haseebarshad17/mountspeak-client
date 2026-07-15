'use client'

import { HP_THEME_TEXT_CLASS } from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'

import type { BookingTourOption, BookingTourSlot } from './booking.types'
import {
    formatBookingSlotLabel,
    formatBookingSlotSeatSummary,
    formatTourSeatSummary,
} from './booking.types'

type BookingSlotAvailabilitySummaryProps = {
    slot: BookingTourSlot | null
    tour: BookingTourOption | null
    className?: string
}

export function BookingSlotAvailabilitySummary({
    slot,
    tour,
    className,
}: BookingSlotAvailabilitySummaryProps) {
    if (slot) {
        return (
            <div
                className={cn(
                    'rounded-[10px] border border-[#D5DADD] bg-[#F8FAFB] px-4 py-3.5 sm:col-span-2',
                    className,
                )}
            >
                <p className='text-xs font-semibold uppercase tracking-wide text-neutral-500'>
                    Selected departure
                </p>
                <p className='mt-1 text-sm font-medium text-neutral-900'>
                    {slot.label || formatBookingSlotLabel(slot)}
                </p>
                <p className={cn('mt-1 text-sm tabular-nums', HP_THEME_TEXT_CLASS)}>
                    {formatBookingSlotSeatSummary(slot)}
                </p>
            </div>
        )
    }

    const tourSummary = tour ? formatTourSeatSummary(tour) : null

    if (!tourSummary) return null

    return (
        <div
            className={cn(
                'rounded-[10px] border border-[#D5DADD] bg-[#F8FAFB] px-4 py-3.5 sm:col-span-2',
                className,
            )}
        >
            <p className='text-xs font-semibold uppercase tracking-wide text-neutral-500'>
                Overall tour capacity
            </p>
            <p className={cn('mt-1 text-sm tabular-nums', HP_THEME_TEXT_CLASS)}>{tourSummary}</p>
        </div>
    )
}

'use client'

import type { BookingPriceBreakdown } from './booking.types'
import { formatBookingDiscountAmount, formatBookingTotalAmount } from './booking.types'

type BookingPriceSummaryProps = {
    breakdown: BookingPriceBreakdown
    adultSeats: number
    kidsSeats: number
    adultDiscountPercent: number
    kidsDiscountPercent: number
}

function SummaryRow({
    label,
    value,
    valueClassName,
    hint,
}: {
    label: string
    value: string
    valueClassName?: string
    hint?: string
}) {
    return (
        <div className='flex items-start justify-between gap-4 text-sm'>
            <div className='min-w-0'>
                <span className='text-neutral-600'>{label}</span>
                {hint ? <p className='mt-0.5 text-xs text-neutral-400'>{hint}</p> : null}
            </div>
            <span className={`shrink-0 font-medium tabular-nums ${valueClassName ?? 'text-neutral-800'}`}>
                {value}
            </span>
        </div>
    )
}

export function BookingPriceSummary({
    breakdown,
    adultSeats,
    kidsSeats,
    adultDiscountPercent,
    kidsDiscountPercent,
}: BookingPriceSummaryProps) {
    const hasTravelers = breakdown.subtotal > 0

    return (
        <div className='flex flex-col gap-2 sm:col-span-2'>
            <span className='text-sm font-medium text-neutral-700'>Total Amount</span>

            <div
                className='overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50'
            >
                <div className='space-y-3 px-4 py-4'>
                    <SummaryRow
                        label='Subtotal'
                        hint={
                            hasTravelers
                                ? `${adultSeats} adult${adultSeats === 1 ? '' : 's'}${kidsSeats > 0 ? `, ${kidsSeats} kid${kidsSeats === 1 ? '' : 's'}` : ''}`
                                : undefined
                        }
                        value={formatBookingTotalAmount(breakdown.subtotal)}
                    />

                    {breakdown.adultDiscount > 0 && adultSeats > 0 ? (
                        <SummaryRow
                            label='Adult discount'
                            hint={`${adultDiscountPercent}% off`}
                            value={formatBookingDiscountAmount(breakdown.adultDiscount)}
                            valueClassName='text-emerald-700'
                        />
                    ) : null}

                    {breakdown.kidsDiscount > 0 && kidsSeats > 0 ? (
                        <SummaryRow
                            label='Kids discount'
                            hint={`${kidsDiscountPercent}% off kids seats (ages 4–8)`}
                            value={formatBookingDiscountAmount(breakdown.kidsDiscount)}
                            valueClassName='text-emerald-700'
                        />
                    ) : null}
                </div>

                <div
                    className='flex items-center justify-between gap-4 border-t border-neutral-200 bg-white px-4 py-3.5'
                >
                    <span className='text-xs font-semibold uppercase tracking-wide text-neutral-700'>
                        Total payable
                    </span>
                    <span className='text-xl font-semibold tabular-nums text-primary-700'>
                        {formatBookingTotalAmount(breakdown.total)}
                    </span>
                </div>
            </div>
        </div>
    )
}

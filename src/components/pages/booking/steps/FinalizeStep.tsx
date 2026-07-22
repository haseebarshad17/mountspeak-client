'use client'

import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    HP_OUTLINE_BTN_STYLE,
    HP_THEME_BTN_CLASS,
    HP_THEME_BTN_STYLE,
    HP_THEME_OUTLINE_BTN_CLASS,
    HP_THEME_TEXT_CLASS,
} from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'

import { FileUploadField } from '../FileUploadField'
import { formatBookingTotalAmount } from '../booking.types'
import type { AgencyPaymentAccount } from '@/services/agency-payment/agency-payment.types'

type FinalizeStepProps = {
    tourTitle?: string
    totalAmount: number
    advanceAmountDue: number
    balanceDue: number
    currency?: string
    paymentAccounts: AgencyPaymentAccount[]
    paymentAccountsLoading?: boolean
    showFallbackPaymentMethods?: boolean
    paymentScreenshot: File | null
    onPaymentScreenshotChange: (file: File | null) => void
    onBack: () => void
    onSubmit: () => void
    isSubmitting?: boolean
}

const paymentMethods = [
    { name: 'JazzCash', className: 'text-[#f15a24]' },
    { name: 'easypaisa', className: 'text-[#00a651]' },
] as const

export function FinalizeStep({
    tourTitle,
    totalAmount,
    advanceAmountDue,
    balanceDue,
    currency = 'PKR',
    paymentAccounts,
    paymentAccountsLoading = false,
    showFallbackPaymentMethods = false,
    paymentScreenshot,
    onPaymentScreenshotChange,
    onBack,
    onSubmit,
    isSubmitting = false,
}: FinalizeStepProps) {
    const hasPartialAdvance = balanceDue > 0
    const amountDueNow = advanceAmountDue > 0 ? advanceAmountDue : totalAmount
    const hasPaymentDetails =
        showFallbackPaymentMethods || paymentAccounts.length > 0
    const canSubmit = hasPaymentDetails && !paymentAccountsLoading && !isSubmitting

    return (
        <div className='flex flex-col gap-5'>
            <div className='rounded-[8px] bg-neutral-100 px-5 py-5'>
                <div className='flex items-start justify-between gap-5'>
                    <div>
                        <p className='text-sm font-semibold text-neutral-700'>
                            {hasPartialAdvance ? 'Advance payment' : 'Expedition total'}
                        </p>
                        {tourTitle ? (
                            <p className='mt-1 text-xs text-neutral-500'>{tourTitle}</p>
                        ) : null}
                    </div>
                    <p className='text-xl font-semibold text-neutral-900'>
                        {formatBookingTotalAmount(amountDueNow, currency)}
                    </p>
                </div>

                {hasPartialAdvance ? (
                    <div className='mt-3 space-y-1 border-t border-neutral-200 pt-3 text-sm text-neutral-600'>
                        <div className='flex justify-between gap-4'>
                            <span>Trip total</span>
                            <span className='tabular-nums'>
                                {formatBookingTotalAmount(totalAmount, currency)}
                            </span>
                        </div>
                        <div className='flex justify-between gap-4'>
                            <span>Balance due later</span>
                            <span className='tabular-nums'>
                                {formatBookingTotalAmount(balanceDue, currency)}
                            </span>
                        </div>
                    </div>
                ) : null}

                <div className='mt-4 flex items-end justify-between gap-4 border-t border-neutral-200 pt-4'>
                    <span className='text-xs font-semibold uppercase tracking-wide text-neutral-700'>
                        {hasPartialAdvance ? 'Pay now' : 'Total payable'}
                    </span>
                    <span className='text-right'>
                        <span className='block text-[10px] text-neutral-400'>inc. all local taxes</span>
                        <span className={cn('text-3xl font-semibold leading-none', HP_THEME_TEXT_CLASS)}>
                            {formatBookingTotalAmount(amountDueNow, currency)}
                        </span>
                    </span>
                </div>
            </div>

            {paymentAccountsLoading ? (
                <div className='grid gap-4 sm:grid-cols-2'>
                    {[0, 1].map((index) => (
                        <div
                            key={index}
                            className='min-h-[96px] animate-pulse border border-neutral-200 bg-neutral-50 px-4 py-4'
                        />
                    ))}
                </div>
            ) : paymentAccounts.length > 0 ? (
                <div
                    className={cn(
                        'grid gap-4',
                        paymentAccounts.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1',
                    )}
                >
                    {paymentAccounts.map((account) => (
                        <div
                            key={account.id || `${account.bank}-${account.value}`}
                            className='min-h-[96px] border border-neutral-300 bg-white px-4 py-4 text-center'
                        >
                            <span className='block text-xl font-bold text-neutral-800'>
                                {account.bank}
                            </span>
                            <span className='mt-3 block break-all text-xs text-neutral-500'>
                                {account.value}
                            </span>
                        </div>
                    ))}
                </div>
            ) : showFallbackPaymentMethods ? (
                <div className='grid gap-4 sm:grid-cols-2'>
                    {paymentMethods.map((method) => (
                        <div
                            key={method.name}
                            className='min-h-[96px] border border-neutral-300 bg-white px-4 py-4 text-center'
                        >
                            <span className={cn('block text-xl font-bold', method.className)}>
                                {method.name}
                            </span>
                            <span className='mt-3 block text-xs text-neutral-500'>0300 0000 000</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='rounded-[8px] border border-dashed border-neutral-300 bg-neutral-50 px-4 py-5 text-center text-sm text-neutral-600'>
                    Payment account details are not available yet. Please contact the agency before
                    transferring funds.
                </div>
            )}

            <div className='flex gap-3 bg-neutral-50 px-5 py-4 text-neutral-700'>
                <Info className='mt-0.5 h-5 w-5 shrink-0 text-orange-500' />
                <div>
                    <p className='text-xs font-semibold uppercase tracking-wide text-neutral-800'>
                        Payment instruction
                    </p>
                    <p className='mt-1 text-xs leading-5'>
                        Transfer {formatBookingTotalAmount(amountDueNow, currency)}
                        {hasPartialAdvance ? ' as your advance payment' : ''}. After transferring,
                        attach a screenshot of the payment below.
                    </p>
                </div>
            </div>

            <FileUploadField
                label='Upload payment screenshot'
                required
                mode='image'
                value={paymentScreenshot}
                onChange={onPaymentScreenshotChange}
            />

            <div className='mt-6 flex w-full flex-wrap items-center justify-between gap-3'>
                <Button
                    type='button'
                    variant='outline'
                    size='lg'
                    onClick={onBack}
                    disabled={isSubmitting}
                    style={HP_OUTLINE_BTN_STYLE}
                    className={cn('min-w-[120px] rounded-md px-8', HP_THEME_OUTLINE_BTN_CLASS)}
                >
                    Back
                </Button>
                <Button
                    size='lg'
                    variant='default'
                    type='button'
                    onClick={onSubmit}
                    disabled={!canSubmit}
                    className={cn('w-full rounded-md px-12 sm:ml-auto sm:w-auto', HP_THEME_BTN_CLASS)}
                    style={HP_THEME_BTN_STYLE}
                >
                    {isSubmitting ? 'Submitting…' : 'Submit'}
                </Button>
            </div>
        </div>
    )
}

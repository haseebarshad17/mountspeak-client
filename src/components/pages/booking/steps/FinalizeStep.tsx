'use client'

import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/clsxUtils'

import { FileUploadField } from '../FileUploadField'
import { formatBookingTotalAmount } from '../booking.types'

type FinalizeStepProps = {
    tourTitle?: string
    totalAmount: number
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
    paymentScreenshot,
    onPaymentScreenshotChange,
    onBack,
    onSubmit,
    isSubmitting = false,
}: FinalizeStepProps) {
    return (
        <div className='flex flex-col gap-5'>
            <div className='rounded-[8px] bg-neutral-100 px-5 py-5'>
                <div className='flex items-start justify-between gap-5'>
                    <div>
                        <p className='text-sm font-semibold text-neutral-700'>Expedition Total</p>
                        {tourTitle ? (
                            <p className='mt-1 text-xs text-neutral-500'>{tourTitle}</p>
                        ) : null}
                    </div>
                    <p
                        className='text-xl font-semibold text-neutral-900'
                    >
                        {formatBookingTotalAmount(totalAmount)}
                    </p>
                </div>

                <div className='mt-4 flex items-end justify-between gap-4 border-t border-neutral-200 pt-4'>
                    <span
                        className='text-xs font-semibold uppercase tracking-wide text-neutral-700'
                    >
                        Total Payable
                    </span>
                    <span className='text-right'>
                        <span className='block text-[10px] text-neutral-400'>inc. all local taxes</span>
                        <span
                            className='text-3xl font-semibold leading-none text-primary-700'
                        >
                            {formatBookingTotalAmount(totalAmount)}
                        </span>
                    </span>
                </div>
            </div>

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

            <div className='flex gap-3 bg-neutral-50 px-5 py-4 text-neutral-700'>
                <Info className='mt-0.5 h-5 w-5 shrink-0 text-orange-500' />
                <div>
                    <p className='text-xs font-semibold uppercase tracking-wide text-neutral-800'>
                        Payment Instruction
                    </p>
                    <p className='mt-1 text-xs leading-5'>
                        After transferring the payment, please attach a screenshot of the payment
                        below.
                    </p>
                </div>
            </div>

            <FileUploadField
                label='Upload Screenshot'
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
                    className='min-w-[120px] rounded-full px-8'
                >
                    Back
                </Button>
                <Button
                    size='lg'
                    variant='default'
                    type='button'
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className='w-full rounded-full bg-primary-700 px-12 hover:bg-primary-800 sm:ml-auto sm:w-auto'
                >
                    {isSubmitting ? 'Submitting…' : 'Submit'}
                </Button>
            </div>
        </div>
    )
}

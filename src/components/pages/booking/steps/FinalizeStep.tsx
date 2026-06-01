'use client'

import { Info } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/clsxUtils'
import { FileUploadField } from '../FileUploadField'
import { FormInput } from '../FormInput'
import { PARTNER_FEE_AMOUNT } from '../booking.types'

type FinalizeStepProps = {
    onBack: () => void
    onSubmit: () => void
}

const paymentMethods = [
    { name: 'JazzCash', className: 'text-[#f15a24]' },
    { name: 'easypaisa', className: 'text-[#00a651]' },
] as const

const formatPkr = (amount: number) => `PKR ${amount.toLocaleString('en-PK')}`

export function FinalizeStep({ onBack, onSubmit }: FinalizeStepProps) {
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null)

    return (
        <div className='flex flex-col gap-5'>
            <div className='rounded-[8px] bg-neutral-100 px-5 py-5'>
                <div className='flex items-start justify-between gap-5'>
                    <p className='text-sm font-semibold text-neutral-700'>Annual Partner Fee</p>
                    <p
                        className='text-xl font-semibold text-neutral-900'
                        style={{ fontFamily: 'var(--font-booking-heading), ui-sans-serif' }}
                    >
                        {formatPkr(PARTNER_FEE_AMOUNT)}
                    </p>
                </div>

                <div className='mt-4 grid gap-3 border-b border-neutral-200 pb-4 text-sm text-neutral-600'>
                    <div className='flex justify-between gap-4'>
                        <span>Platform Maintenance</span>
                        <span>Included</span>
                    </div>
                    <div className='flex justify-between gap-4'>
                        <span>Marketing Kit Allocation</span>
                        <span>Included</span>
                    </div>
                </div>

                <div className='mt-4 flex items-end justify-between gap-4'>
                    <span
                        className='text-xs font-semibold uppercase tracking-wide text-neutral-700'
                        style={{ fontFamily: 'var(--font-booking-heading), ui-sans-serif' }}
                    >
                        Total Payable
                    </span>
                    <span className='text-right'>
                        <span className='block text-[10px] text-neutral-400'>inc. all local taxes</span>
                        <span
                            className='text-3xl font-semibold leading-none text-primary-700'
                            style={{ fontFamily: 'var(--font-booking-heading), ui-sans-serif' }}
                        >
                            {formatPkr(PARTNER_FEE_AMOUNT)}
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
                        <span className={cn('block text-xl font-bold', method.className)}>{method.name}</span>
                        <span className='mt-3 block text-xs text-neutral-500'>0300 0000 000</span>
                    </div>
                ))}
            </div>

            <FormInput
                label='Transaction Reference'
                placeholder='e.g. EP-DEMO-001'
                required
                defaultValue=''
            />

            <div className='flex gap-3 bg-neutral-50 px-5 py-4 text-neutral-700'>
                <Info className='mt-0.5 h-5 w-5 shrink-0 text-orange-500' />
                <div>
                    <p className='text-xs font-semibold uppercase tracking-wide text-neutral-800'>
                        Payment Instruction
                    </p>
                    <p className='mt-1 text-xs leading-5'>
                        After transferring the payment, please attach a screenshot of the payment below.
                    </p>
                </div>
            </div>

            <FileUploadField
                label='Upload Screenshot'
                required
                mode='image'
                value={paymentScreenshot}
                onChange={setPaymentScreenshot}
            />

            <div className='mt-6 flex w-full flex-wrap items-center justify-between gap-3'>
                <Button
                    type='button'
                    variant='outline'
                    size='lg'
                    onClick={onBack}
                    className='min-w-[120px] rounded-full px-8'
                >
                    Back
                </Button>
                <Button
                    size='lg'
                    variant='default'
                    type='button'
                    onClick={onSubmit}
                    className='w-full rounded-full bg-primary-700 px-12 hover:bg-primary-800 sm:ml-auto sm:w-auto'
                >
                    Submit
                </Button>
            </div>
        </div>
    )
}

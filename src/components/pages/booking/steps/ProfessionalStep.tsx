'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileUploadField } from '../FileUploadField'
import { FormInput } from '../FormInput'
import { FormSelect } from '../FormSelect'
import { SPECIALIZATION_OPTIONS } from '../booking.types'

type ProfessionalStepProps = {
    onContinue: () => void
    onBack: () => void
}

export function ProfessionalStep({ onContinue, onBack }: ProfessionalStepProps) {
    const [businessRegistration, setBusinessRegistration] = useState<File | null>(null)

    return (
        <div>
            <div>
                <h3
                    className='text-[30px] font-semibold leading-tight text-neutral-800 sm:text-[34px]'
                    style={{ fontFamily: 'var(--font-booking-heading), ui-sans-serif' }}
                >
                    Credential Verification
                </h3>
                <p className='mt-3 max-w-[430px] text-sm leading-6 text-neutral-700'>
                    Please provide your industry-standard registration and operational history details below.
                </p>
            </div>

            <div className='mt-7 grid gap-5 sm:grid-cols-2'>
                <FormInput
                    label='License Number'
                    placeholder='PK-EXP-2024-001'
                    required
                    defaultValue=''
                />
                <FormInput label='License Expiry' type='date' required defaultValue='' />
                <FormInput
                    label='Years In Operation'
                    placeholder='Number of years'
                    type='number'
                    required
                    className='sm:col-span-2'
                    defaultValue=''
                />
            </div>

            <div className='mt-7 flex flex-col gap-5'>
                <FormSelect
                    label='Primary Specialization'
                    placeholder='Select specialization'
                    required
                    defaultValue=''
                    options={[...SPECIALIZATION_OPTIONS]}
                />

                <FileUploadField
                    label='Business Registration (PDF/JPG)'
                    required
                    value={businessRegistration}
                    onChange={setBusinessRegistration}
                />
            </div>

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
                    onClick={onContinue}
                    className='w-full rounded-full bg-primary-700 px-12 hover:bg-primary-800 sm:ml-auto sm:w-auto'
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FormInput } from '../FormInput'
import { FormSelect } from '../FormSelect'
import { PROGRAM_OPTIONS } from '../booking.types'

type IdentityStepProps = {
    onContinue: () => void
}

export function IdentityStep({ onContinue }: IdentityStepProps) {
    return (
        <div className='flex h-max min-h-full flex-col justify-between'>
            <div className='grid gap-5 sm:grid-cols-2'>
                <FormInput label='Full Name' placeholder='Jack Smith' required defaultValue='' />
                <FormInput
                    label='Email Address'
                    placeholder='jack.smith@example.com'
                    type='email'
                    required
                    defaultValue=''
                />
                <FormInput
                    label='Phone Number'
                    placeholder='+923001234567'
                    type='tel'
                    required
                    defaultValue=''
                />
                <FormSelect
                    label='Programs'
                    placeholder='Select a program'
                    required
                    defaultValue=''
                    options={[...PROGRAM_OPTIONS]}
                />
                <FormInput
                    label='Write Your Message'
                    placeholder='Your message'
                    required
                    textarea
                    className='sm:col-span-2'
                    defaultValue=''
                />

            </div>

            <div className='pt-5'>
                <label className='flex max-w-[420px] items-start gap-2 leading-4 text-neutral-700'>
                    <input
                        type='checkbox'
                        disabled
                        className='mt-0.5 h-[14px] w-[14px] shrink-0 accent-primary-700'
                    />
                    <span className='text-xs tracking-normal'>
                        I verify that I am authorized to represent this agency and agree to Karakoram&apos;s{' '}
                        <Link href='/contact-us' className='inline-block font-semibold text-primary-700 hover:underline'>
                            Privacy Policy
                        </Link>
                    </span>
                </label>
            </div>

            <div className='mt-6 flex justify-end'>
                <Button
                    size='lg'
                    variant='default'
                    type='button'
                    onClick={onContinue}
                    className='w-full rounded-full bg-primary-700 px-12 hover:bg-primary-800 sm:w-auto'
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}

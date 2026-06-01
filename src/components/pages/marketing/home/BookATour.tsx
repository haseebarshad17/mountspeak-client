'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import React from 'react'

const fieldClass =
    'box-border h-[58px] w-full max-w-[304px] rounded-[10px] border-0 bg-white p-4 font-roboto text-base font-normal leading-6 tracking-normal text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-white/40'

const selectClass = `${fieldClass} appearance-none bg-[length:16px] bg-[right_16px_center] bg-no-repeat pr-10`

const textareaClass = `${fieldClass} !h-auto min-h-[58px] resize-none py-4 align-top`

const chevronBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`

function FormField({
    label,
    children,
    className,
}: {
    label: string
    required?: boolean
    children: React.ReactNode
    className?: string
}) {
    return (
        <label className={className}>
            <span className='sr-only'>{label}</span>
            {children}
        </label>
    )
}

const BookATour = () => {
    return (
        <section
            className="relative mb-[88px] bg-[url('/images/pages/home/testimonial-background.png')] bg-cover bg-center"
            aria-labelledby='book-a-tour-heading'
        >
            <div className='agency-container relative z-10 py-14 sm:py-16 lg:py-20 xl:py-24'>
                <div className='grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16'>
                    {/* Left — Online Booking */}
                    <div className='text-white'>
                        <div className='flex items-center gap-3'>
                            <span className='font-roboto text-[20px] leading-6 font-semibold uppercase tracking-[0.2em] text-white'>
                                Booking
                            </span>
                            <span className='h-px w-10 bg-white/80 sm:w-12' aria-hidden />
                        </div>

                        <h2 className='agency-section-heading pt-4 text-[32px] font-medium leading-tight text-white sm:text-[36px] sm:leading-[42px] lg:text-[40px] lg:leading-[48px]'>
                            Online Booking
                        </h2>

                        <p className='pt-5 font-roboto text-base font-normal leading-7 text-white/90 sm:text-base sm:leading-8'>
                            North Trips &amp; Travel is a trusted travel agency in Pakistan, offering customized tour
                            packages, hotel bookings, and complete travel solutions for families, groups, and corporate
                            clients.
                        </p>

                        <p className='pt-7 font-roboto text-base font-normal leading-7 text-white/90 sm:text-base sm:leading-8'>
                            Get{' '}
                            <span className='font-semibold text-[#F5D547]'>50% Off</span> on your first adventure trip
                            with us. Book your tour today and enjoy unforgettable travel experiences at the best prices.
                        </p>

                        <Button
                            variant='secondary'
                            className='mt-8 h-12 min-w-[200px] rounded-full border-0 bg-[#F2F2F2] px-8 font-roboto text-base font-medium text-[#276968] hover:bg-white sm:mt-10'
                        >
                            View All Packages
                        </Button>
                    </div>

                    {/* Right — Form (Figma: 624px wide, 16px gaps, inputs 304×58) */}
                    <div className='w-full max-w-[624px] lg:justify-self-end'>
                        <h3
                            id='book-a-tour-heading'
                            className='font-jost text-[28px] font-medium leading-tight text-white sm:text-[32px] lg:text-[36px]'
                        >
                            Book A Tour
                        </h3>
                        <p className='pt-2 font-roboto text-base font-normal leading-6 tracking-normal text-white/90'>
                            Get <span className='font-semibold text-[#F5D547]'>50% Off</span> On Your First Adventure
                            Trip With North Trips &amp; Travel.
                        </p>

                        <form
                            className='mt-6 flex w-full max-w-[624px] flex-col gap-4 sm:mt-8'
                            onSubmit={(e) => e.preventDefault()}
                            noValidate
                        >
                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <FormField label='Your Name' required>
                                    <input
                                        type='text'
                                        name='name'
                                        placeholder='Your Name *'
                                        required
                                        className={fieldClass}
                                    />
                                </FormField>
                                <FormField label='Your Email' required>
                                    <input
                                        type='email'
                                        name='email'
                                        placeholder='Your Email *'
                                        required
                                        className={fieldClass}
                                    />
                                </FormField>
                            </div>

                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <FormField label='Your Phone'>
                                    <input
                                        type='tel'
                                        name='phone'
                                        placeholder='Your Phone'
                                        className={fieldClass}
                                    />
                                </FormField>
                                <FormField label='Date'>
                                    <div className='relative w-full max-w-[304px]'>
                                        <input
                                            type='date'
                                            name='date'
                                            placeholder='mm/dd/yyyy'
                                            className={`${fieldClass} w-full pr-11 [&::-webkit-calendar-picker-indicator]:opacity-0`}
                                        />
                                        <Calendar
                                            className='pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500'
                                            aria-hidden
                                        />
                                    </div>
                                </FormField>
                            </div>

                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <FormField label='Select Destination'>
                                    <select
                                        name='destination'
                                        defaultValue=''
                                        className={selectClass}
                                        style={{ backgroundImage: chevronBg }}
                                    >
                                        <option value='' disabled>
                                            Select Destination
                                        </option>
                                        <option value='skardu'>Skardu</option>
                                        <option value='hunza'>Hunza</option>
                                        <option value='naran'>Naran</option>
                                        <option value='swat'>Swat</option>
                                    </select>
                                </FormField>
                                <FormField label='Select Persons'>
                                    <select
                                        name='persons'
                                        defaultValue=''
                                        className={selectClass}
                                        style={{ backgroundImage: chevronBg }}
                                    >
                                        <option value='' disabled>
                                            Select Persons
                                        </option>
                                        <option value='1'>1 Person</option>
                                        <option value='2'>2 Persons</option>
                                        <option value='3'>3 Persons</option>
                                        <option value='4+'>4+ Persons</option>
                                    </select>
                                </FormField>
                            </div>

                            <FormField label='Select Category' className='block w-full max-w-[304px]'>
                                <select
                                    name='category'
                                    defaultValue=''
                                    className={selectClass}
                                    style={{ backgroundImage: chevronBg }}
                                >
                                    <option value='' disabled>
                                        Select Category
                                    </option>
                                    <option value='adventure'>Adventure</option>
                                    <option value='family'>Family</option>
                                    <option value='honeymoon'>Honeymoon</option>
                                    <option value='corporate'>Corporate</option>
                                </select>
                            </FormField>

                            <FormField label='Special Request' className='block w-full'>
                                <textarea
                                    name='specialRequest'
                                    rows={3}
                                    placeholder='Special Request'
                                    className={`${textareaClass} !max-w-[624px] w-full`}
                                />
                            </FormField>

                            <Button
                                type='submit'
                                variant='default'
                                className='!flex h-[58px] w-full max-w-[624px] rounded-[100px] bg-[#276968] px-8 font-roboto text-base font-normal leading-6 tracking-normal text-white hover:bg-primary-700'
                            >
                                Book Now
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BookATour

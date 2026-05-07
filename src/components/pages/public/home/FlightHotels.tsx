import { Button } from '@/components/ui/button'
import { MousePointer2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const FlightHotels = () => {
    return (
        <section className='pb-16 sm:pb-20 lg:pb-[112px]'>
            <div className='agency-container'>
                <main className='grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-6 lg:gap-10'>
                    <div className='rounded-[16px] overflow-hidden relative'>
                        <Image
                            src='/images/pages/home/flights-background.png'
                            alt='Flight Hotels'
                            width={656}
                            height={603}
                            className='h-[380px] w-full max-w-[656px] object-cover sm:h-[460px] lg:h-max'
                        />

                        <div className='absolute inset-0 flex h-full w-full items-end justify-center p-5 text-white sm:p-7 lg:p-[35px]'>
                            <div className='w-full max-w-[389px] mx-auto flex flex-col justify-center items-center text-center'>
                                <h5 className='text-[32px] font-normal sm:text-[36px] lg:text-[40px]'>Flights</h5>
                                <p className='text-sm font-normal sm:text-base'>Search flights & places and book for your amazing trips.</p>
                                <Button
                                    variant='secondary'
                                    className='mt-4 w-max gap-1.5 px-5 text-sm'
                                >
                                    <MousePointer2 size={16} className='rotate-[90deg]' />
                                    Show flights
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className='rounded-[16px] overflow-hidden relative'>
                        <Image
                            src='/images/pages/home/hotels-background.png'
                            alt='Flight Hotels'
                            width={656}
                            height={603}
                            className='h-[380px] w-full max-w-[656px] object-cover sm:h-[460px] lg:h-max'
                        />

                        <div className='absolute inset-0 flex h-full w-full items-end justify-center p-5 text-white sm:p-7 lg:p-[35px]'>
                            <div className='w-full max-w-[389px] mx-auto flex flex-col justify-center items-center text-center'>
                                <h5 className='text-[32px] font-normal sm:text-[36px] lg:text-[40px]'>Hotels</h5>
                                <p className='text-sm font-normal sm:text-base'>Search our best hotels & places and book for your  amazing trips.</p>
                                <Button
                                    variant='secondary'
                                    className='mt-4 w-max gap-1.5 px-5 text-sm'
                                >
                                    <MousePointer2 size={16} className='rotate-[90deg]' />
                                    Show hotels
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </section>
    )
}

export default FlightHotels
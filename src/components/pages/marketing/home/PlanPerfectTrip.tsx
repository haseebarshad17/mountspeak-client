import Image from 'next/image'
import React from 'react'

const PLAN_PERFECT_TRIP_IMAGE =
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'

const features = [
    { title: '150+', description: 'Flight Destinations' },
    { title: '250+', description: 'Hotels' },
    { title: '80', description: 'Elite Transportation' },
    { title: '40+', description: 'We help to find your dream place' },
] as const

const PlanPerfectTrip = () => {
    return (
        <section
            className='pb-16 sm:pb-20 lg:pb-[112px]'
            aria-labelledby='plan-perfect-trip-heading'
        >
            <div className='agency-container'>
                <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-8 lg:gap-12 xl:gap-[100px]'>
                    <div className='w-full max-w-[580px] justify-self-center md:justify-self-start'>
                        <Image
                            src={PLAN_PERFECT_TRIP_IMAGE}
                            alt='Traveler planning a trip'
                            width={580}
                            height={448}
                            className='h-max w-full max-w-[580px]  object-cover'
                        />
                    </div>

                    <div className='w-full max-w-[612px] pt-0 md:pt-2 lg:pt-0 xl:pt-[38px]'>
                        <span className='text-sm font-semibold uppercase tracking-[0.12em] text-primary-500 sm:text-base'>
                            about
                        </span>

                        <h2
                            id='plan-perfect-trip-heading'
                            className='agency-section-heading pt-1 text-neutral-900'
                        >
                            Plan your perfect trip
                        </h2>

                        <p className='pt-4 text-sm font-normal leading-7 text-neutral-700 sm:pt-5 sm:text-base'>
                            Are you looking for an adventurous travel, or just carrying your work alongside you while you
                            travel and explore new places, then your perfect trip is one with us, Phnes travels help you
                            search flights & places, book your most convenient hotels/places at your comfort while we
                            help you discover the world. Welcome to a new dispensation.
                        </p>

                        <dl className='grid w-full grid-cols-2 gap-x-4 gap-y-5 pt-6 sm:gap-x-6 sm:gap-y-6 sm:pt-8'>
                            {features.map((item) => (
                                <div key={item.title}>
                                    <dt className='text-2xl font-semibold leading-none text-primary-500 sm:text-[28px]'>
                                        {item.title}
                                    </dt>
                                    <dd className='pt-1 text-sm font-normal text-neutral-700 sm:text-base'>
                                        {item.description}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PlanPerfectTrip

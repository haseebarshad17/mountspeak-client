'use client'

import { Button } from '@/components/ui/button'
import { filterDestinationCards } from '@/data/popular-destinations'
import Image from 'next/image'
import React, { useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

const avatars = [
    'https://i.pravatar.cc/100?img=12',
    'https://i.pravatar.cc/100?img=20',
]

type TopDestinationsProps = {
    activeFilter: string
}

const TopDestinations = ({ activeFilter }: TopDestinationsProps) => {
    const destinations = useMemo(
        () => filterDestinationCards(activeFilter),
        [activeFilter],
    )

    return (
        <section className='bg-white pb-16 sm:pb-20 lg:pb-[226px]' aria-labelledby='top-destinations-heading'>
            <div className='agency-container'>
                <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end'>
                    <div>
                        <span className='font-roboto text-base font-normal leading-6 text-[#276968]'>
                            Top Destinations
                        </span>
                        <h2
                            id='top-destinations-heading'
                            className='agency-section-heading pt-1 text-[40px] font-medium leading-[48px] text-[#14141F]'
                        >
                            Discover your love
                        </h2>
                    </div>

                    <Button
                        variant='outline'
                        className='h-10 w-max rounded-md border border-neutral-300 bg-white px-5 text-sm font-normal text-[#14141F] hover:bg-neutral-50'
                    >
                        See all
                    </Button>
                </div>

                <div className='overflow-x-hidden pt-8 sm:pt-10 lg:pt-12'>
                    {destinations.length > 0 ? (
                        <Swiper
                            key={activeFilter}
                            spaceBetween={37}
                            slidesPerView='auto'
                            className='select-none !overflow-hidden'
                        >
                            {destinations.map((destination) => (
                                <SwiperSlide key={destination.id} className='!w-[520px] shrink-0'>
                                    <article className='h-[459px] w-full rounded-[20px] bg-white p-3 shadow-[0_4px_30px_rgba(0,0,0,0.08)] sm:p-3.5'>
                                        <div className='relative h-[190px] w-full overflow-hidden rounded-[16px] sm:h-[332px]'>
                                            <Image
                                                src={destination.image}
                                                alt={destination.name}
                                                fill
                                                className='object-cover'
                                                sizes='(max-width: 640px) 90vw, (max-width: 1170px) 33vw, 400px'
                                            />
                                        </div>

                                        <div className='flex items-center justify-between gap-3 px-1 pb-1 pt-4'>
                                            <h3 className='font-jost text-[28px] font-medium leading-8 text-[#276968] sm:text-[32px]'>
                                                {destination.name}
                                            </h3>

                                            <div className='flex shrink-0 items-center'>
                                                {avatars.map((avatar, idx) => (
                                                    <div
                                                        key={avatar}
                                                        className='relative h-9 w-9 overflow-hidden rounded-full border-2 border-white'
                                                        style={{ marginLeft: idx === 0 ? 0 : -10 }}
                                                    >
                                                        <Image
                                                            src={avatar}
                                                            alt=''
                                                            fill
                                                            className='object-cover'
                                                            sizes='36px'
                                                        />
                                                    </div>
                                                ))}
                                                <span className='-ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FF7875] text-xs font-semibold text-white ring-2 ring-white'>
                                                    +10
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <p className='py-12 text-center font-roboto text-base text-neutral-500'>
                            No destinations found for this filter.
                        </p>
                    )}
                </div>
            </div>
        </section>
    )
}

export default TopDestinations

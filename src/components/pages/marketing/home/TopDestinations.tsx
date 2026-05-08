"use client"

import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

const destinations = [
    {
        name: 'Phuket',
        country: 'Thailand',
        image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80',
    },
    {
        name: 'Santorini',
        country: 'Greece',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    },
    {
        name: 'Paris',
        country: 'France',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    },
    {
        name: 'Bali',
        country: 'Indonesia',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    },
]

const avatars = [
    'https://i.pravatar.cc/100?img=12',
    'https://i.pravatar.cc/100?img=20',
]

const TopDestinations = () => {
    return (
        <section className='pb-16 sm:pb-20 lg:pb-[112px]'>
            <div className='agency-container'>
                <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end'>
                    <div>
                        <span className='text-xs font-semibold uppercase tracking-[0.12em] text-[#2D6A6A]'>Top Destinations</span>
                        <h2 className='pt-1 agency-section-heading'>Discover your love</h2>
                    </div>

                    <Button
                        variant='outline'
                        className='h-10 w-max rounded-md border-[#2D6A6A] px-4 text-sm text-[#2D6A6A] hover:bg-[#2D6A6A]/5 sm:px-5'
                    >
                        See all
                    </Button>
                </div>

                <div className='pt-8 sm:pt-10 lg:pt-[50px]'>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1.08}
                        breakpoints={{
                            480: { slidesPerView: 1.2 },
                            640: { slidesPerView: 1.6 },
                            768: { slidesPerView: 2.1 },
                            1024: { slidesPerView: 2.3 },
                            1170: { slidesPerView: 2.5 },
                        }}
                        className='user-select-none select-none'
                    >
                        {destinations.map((destination) => (
                            <SwiperSlide key={destination.name}>
                                <article className='rounded-[18px] bg-gray-100 p-2.5 sm:p-3'>
                                    <div className='relative h-[178px] w-full overflow-hidden rounded-[14px] sm:h-[190px]'>
                                        <Image
                                            src={destination.image}
                                            alt={destination.name}
                                            fill
                                            className='object-cover'
                                            sizes='(max-width: 640px) 90vw, (max-width: 1170px) 45vw, 32vw'
                                        />
                                    </div>

                                    <div className='flex items-end justify-between gap-3 pb-1 pt-3 sm:pt-4'>
                                        <div>
                                            <h3 className='text-[28px] font-semibold leading-none text-[#2D6A6A] sm:text-[34px]'>
                                                {destination.name}
                                            </h3>
                                            <div className='mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500 sm:mt-2 sm:text-sm'>
                                                <MapPin className='h-4 w-4' />
                                                <span>{destination.country}</span>
                                            </div>
                                        </div>

                                        <div className='flex items-center pl-2'>
                                            {avatars.map((avatar, idx) => (
                                                <div
                                                    key={avatar}
                                                    className='relative h-8 w-8 overflow-hidden rounded-full border-2 border-white sm:h-9 sm:w-9'
                                                    style={{ marginLeft: idx === 0 ? 0 : -10 }}
                                                >
                                                    <Image
                                                        src={avatar}
                                                        alt='traveler avatar'
                                                        fill
                                                        className='object-cover'
                                                        sizes='36px'
                                                    />
                                                </div>
                                            ))}
                                            <span className='-ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B6B] text-[11px] font-semibold text-white ring-2 ring-white sm:h-9 sm:w-9 sm:text-xs'>
                                                +10
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    )
}

export default TopDestinations
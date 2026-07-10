'use client'

import { HP_CSS_VARS, STATIC_UI_COLORS } from '@/data/homepage'

import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { PrefixedLink } from '@/components/ui/prefixed-link'
import { SectionEmptyState } from '@/components/ui/section-empty-state'
import {
    configureSwiperNavigation,
    SwiperSideNavigation,
    useSwiperNavigationRefs,
} from '@/components/ui/swiper-side-navigation'
import { filterDestinationCards, type DestinationCard } from '@/data/popular-destinations'
import { buildTourSearchPath } from '@/services/tours/tours.search.utils'
import { MapPin } from 'lucide-react'
import { HomepageMediaImage } from '@/components/ui/homepage-media-image'
import React, { useMemo } from 'react'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

type TopDestinationsProps = HomepagePageProps & {
    activeFilter: string
}

type DestinationsSwiperProps = {
    activeFilter: string
    destinations: DestinationCard[]
    canSlide: boolean
}

function DestinationsSwiper({ activeFilter, destinations, canSlide }: DestinationsSwiperProps) {
    const { prevRef, nextRef } = useSwiperNavigationRefs()

    return (
        <Swiper
            key={activeFilter}
            modules={[Navigation, Autoplay]}
            slidesPerView={1}
            spaceBetween={16}
            breakpoints={{
                640: {
                    slidesPerView: 2.2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3.5,
                    spaceBetween: 24,
                },
            }}
            loop={canSlide}
            speed={600}
            autoplay={
                canSlide
                    ? {
                        delay: 4500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }
                    : false
            }
            navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
                configureSwiperNavigation(swiper, prevRef.current, nextRef.current)
            }}
            className='select-none !overflow-hidden'
        >
            {destinations.map((destination) => (
                <SwiperSlide key={destination.id} className='!h-auto'>
                    <article className='my-2 h-auto w-full rounded-[20px] bg-white p-3 pb-3 shadow-[0_4px_30px_rgba(0,0,0,0.08)] sm:my-7 sm:p-3.5 sm:pb-4'>
                        <PrefixedLink
                            href={buildTourSearchPath({ to: destination.region })}
                            className='group block'
                            aria-label={`Search tours to ${destination.name}`}
                        >
                            <div className='relative h-[190px] w-full overflow-hidden rounded-[16px] sm:h-[240px] lg:h-[260px]'>
                                <HomepageMediaImage
                                    src={destination.image}
                                    alt={destination.name}
                                    fill
                                    className='object-cover transition-transform duration-300 group-hover:scale-[1.02]'
                                    sizes='(max-width: 640px) 100vw, (max-width: 1170px) 33vw, 400px'
                                />
                            </div>

                            <div className='px-1 pt-3 sm:pt-4'>
                                <h3
                                    className='font-jost text-[22px] font-medium leading-7 transition-colors group-hover:text-[var(--hp-color-primary)]/80'
                                    style={{ color: HP_CSS_VARS.primary, fontFamily: 'var(--hp-font-heading)' }}
                                >
                                    {destination.name}
                                </h3>
                            </div>
                        </PrefixedLink>
                    </article>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

const TopDestinations = ({ page, activeFilter }: TopDestinationsProps) => {
    const section = page.sections.popularDestination.topDestinations

    const destinations = useMemo(
        () => filterDestinationCards(page, activeFilter),
        [page, activeFilter],
    )

    const canSlide = destinations.length > 1

    return (
        <section className='bg-white' aria-labelledby='top-destinations-heading'>
            <div className='agency-container'>
                <div>
                    <span
                        className='text-base font-normal leading-6'
                        style={{ color: HP_CSS_VARS.primary, fontFamily: 'var(--hp-font-body)' }}
                    >
                        {section.subtitle}
                    </span>
                    <h2
                        id='top-destinations-heading'
                        className='agency-section-heading pt-1 text-[28px] font-medium leading-tight sm:text-[34px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]'
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                </div>

                <div className='overflow-x-hidden pt-4 sm:pt-6'>
                    {destinations.length > 0 ? (
                        <SwiperSideNavigation
                            enabled={canSlide}
                            prevLabel='Previous destinations'
                            nextLabel='Next destinations'
                        >
                            <DestinationsSwiper
                                activeFilter={activeFilter}
                                destinations={destinations}
                                canSlide={canSlide}
                            />
                        </SwiperSideNavigation>
                    ) : (
                        <div className='py-8 sm:py-10'>
                            <SectionEmptyState
                                icon={MapPin}
                                title='No destinations yet'
                                description={section.emptyMessage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default TopDestinations

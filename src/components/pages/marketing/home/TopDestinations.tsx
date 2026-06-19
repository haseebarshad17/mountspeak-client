'use client'

import { HP_CSS_VARS, HP_OUTLINE_BTN_STYLE, HP_THEME_OUTLINE_BTN_CLASS, HP_THEME_TEXT_CLASS, STATIC_UI_COLORS } from '@/data/homepage'

import { Button } from '@/components/ui/button'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { filterDestinationCards } from '@/data/popular-destinations'
import { cn } from '@/lib/utils/clsxUtils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import React, { useMemo, useRef } from 'react'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

type TopDestinationsProps = HomepagePageProps & {
    activeFilter: string
}

const TopDestinations = ({ page, activeFilter }: TopDestinationsProps) => {
    const section = page.sections.popularDestination.topDestinations
    const prevRef = useRef<HTMLButtonElement>(null)
    const nextRef = useRef<HTMLButtonElement>(null)

    const destinations = useMemo(
        () => filterDestinationCards(page, activeFilter),
        [page, activeFilter],
    )

    const canSlide = destinations.length > 1

    return (
        <section className='bg-white' aria-labelledby='top-destinations-heading'>
            <div className='agency-container'>
                <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end'>
                    <div>
                        <span
                            className='text-base font-normal leading-6'
                            style={{ color: HP_CSS_VARS.primary, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {section.subtitle}
                        </span>
                        <h2
                            id='top-destinations-heading'
                            className='agency-section-heading pt-1 text-[40px] font-medium leading-[48px]'
                            style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                        >
                            {section.title}
                        </h2>
                    </div>

                    <div className='flex items-center gap-3'>
                        {canSlide ? (
                            <div className='flex items-center gap-2'>
                                <button
                                    ref={prevRef}
                                    type='button'
                                    aria-label='Previous destinations'
                                    className={cn(
                                        'inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#C0C8C966] bg-white transition hover:border-[var(--hp-color-primary)]/40 disabled:cursor-not-allowed disabled:opacity-40',
                                        HP_THEME_TEXT_CLASS,
                                    )}
                                >
                                    <ChevronLeft className='h-5 w-5' aria-hidden />
                                </button>
                                <button
                                    ref={nextRef}
                                    type='button'
                                    aria-label='Next destinations'
                                    className={cn(
                                        'inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#C0C8C966] bg-white transition hover:border-[var(--hp-color-primary)]/40 disabled:cursor-not-allowed disabled:opacity-40',
                                        HP_THEME_TEXT_CLASS,
                                    )}
                                >
                                    <ChevronRight className='h-5 w-5' aria-hidden />
                                </button>
                            </div>
                        ) : null}

                        <Button
                            variant='outline'
                            style={HP_OUTLINE_BTN_STYLE}
                            className={cn('w-max', HP_THEME_OUTLINE_BTN_CLASS)}
                            href={section.seeAllHref ?? '/search'}
                        >
                            {section.seeAllLabel}
                        </Button>
                    </div>
                </div>

                <div className='overflow-x-hidden pt-6'>
                    {destinations.length > 0 ? (
                        <Swiper
                            key={activeFilter}
                            modules={[Navigation, Autoplay]}
                            spaceBetween={37}
                            slidesPerView='auto'
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
                                if (
                                    swiper.params.navigation &&
                                    typeof swiper.params.navigation !== 'boolean'
                                ) {
                                    swiper.params.navigation.prevEl = prevRef.current
                                    swiper.params.navigation.nextEl = nextRef.current
                                }
                            }}
                            className='select-none !overflow-hidden'
                        >
                            {destinations.map((destination) => (
                                <SwiperSlide key={destination.id} className='!w-[520px] shrink-0'>
                                    <article className='my-7 h-[459px] w-full rounded-[20px] bg-white p-3 shadow-[0_4px_30px_rgba(0,0,0,0.08)] sm:p-3.5'>
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
                                            <h3
                                                className='font-jost text-[28px] font-medium leading-8 sm:text-[32px]'
                                                style={{ color: HP_CSS_VARS.primary, fontFamily: 'var(--hp-font-heading)' }}
                                            >
                                                {destination.name}
                                            </h3>

                                            <div className='flex shrink-0 items-center'>
                                                {section.avatars.map((avatar, idx) => (
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
                                                <span
                                                    className='-ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white ring-2 ring-white'
                                                    style={{ backgroundColor: STATIC_UI_COLORS.avatarBadge }}
                                                >
                                                    {section.moreTravelersLabel}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <p
                            className='py-12 text-center text-base'
                            style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {section.emptyMessage}
                        </p>
                    )}
                </div>
            </div>
        </section>
    )
}

export default TopDestinations

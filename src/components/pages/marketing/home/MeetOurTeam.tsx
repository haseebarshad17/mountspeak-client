'use client'

import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { HP_THEME_TEXT_CLASS, STATIC_UI_COLORS } from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'
import type { Member } from '@/services/homepage/homepage.page.types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import React, { useRef } from 'react'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

function TeamCard({ name, role, image }: Member) {
    return (
        <article className='h-auto w-full overflow-hidden rounded-xl bg-neutral-100 shadow-sm sm:max-w-[306px] sm:rounded-2xl sm:h-[424px]'>
            <div className='relative aspect-[3/4] w-full bg-neutral-200 sm:aspect-auto sm:h-[300px]'>
                <Image
                    src={image}
                    alt={name}
                    fill
                    className='object-cover object-top'
                    sizes='(max-width: 640px) 45vw, (max-width: 1024px) 50vw, 25vw'
                />
            </div>
            <div
                className='h-auto px-2 py-3 text-center sm:h-[124px] sm:max-w-[306px] sm:px-5 sm:py-6'
                style={{ backgroundColor: STATIC_UI_COLORS.backgroundMuted }}
            >
                <h3
                    className='text-sm font-medium leading-5 sm:text-xl sm:leading-7 lg:text-2xl'
                    style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                >
                    {name}
                </h3>
                <p
                    className='pt-0.5 text-xs font-normal leading-5 sm:pt-1 sm:text-sm sm:leading-6 lg:text-base'
                    style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                >
                    {role}
                </p>
            </div>
        </article>
    )
}

const TEAM_CAROUSEL_THRESHOLD = 4

const MeetOurTeam = ({ page }: HomepagePageProps) => {
    const section = page.sections.meetOurTeam
    const members = section.members ?? []
    const useCarousel = members.length > TEAM_CAROUSEL_THRESHOLD
    const prevRef = useRef<HTMLButtonElement>(null)
    const nextRef = useRef<HTMLButtonElement>(null)

    return (
        <section className='bg-white' aria-labelledby='meet-our-team-heading'>
            <div className='agency-container'>
                <header className='mx-auto max-w-3xl text-center'>
                    <SectionEyebrow name={section.eyebrow} />
                    <h2
                        id='meet-our-team-heading'
                        className='agency-section-heading pt-3 text-[40px] font-medium leading-[48px] sm:pt-4'
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>

                    {useCarousel ? (
                        <div className='mt-5 flex items-center justify-center gap-2 sm:mt-6'>
                            <button
                                ref={prevRef}
                                type='button'
                                aria-label='Previous team members'
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
                                aria-label='Next team members'
                                className={cn(
                                    'inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#C0C8C966] bg-white transition hover:border-[var(--hp-color-primary)]/40 disabled:cursor-not-allowed disabled:opacity-40',
                                    HP_THEME_TEXT_CLASS,
                                )}
                            >
                                <ChevronRight className='h-5 w-5' aria-hidden />
                            </button>
                        </div>
                    ) : null}
                </header>

                {useCarousel ? (
                    <div className='mx-auto max-w-[1200px] overflow-x-hidden pt-6 sm:pt-8 lg:pt-10'>
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            slidesPerView={2}
                            spaceBetween={12}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 24,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 32,
                                },
                            }}
                            loop
                            speed={600}
                            autoplay={{
                                delay: 4500,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
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
                            {members.map((member) => (
                                <SwiperSlide key={member.name} className='!h-auto'>
                                    <TeamCard {...member} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                ) : (
                    <div className='mx-auto grid max-w-[1200px] grid-cols-2 gap-3 pt-8 sm:gap-8 sm:pt-12 lg:grid-cols-4 lg:gap-8 lg:pt-14'>
                        {members.map((member) => (
                            <TeamCard key={member.name} {...member} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default MeetOurTeam

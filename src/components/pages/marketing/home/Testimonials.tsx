'use client'

import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import type { HomepagePage } from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'
import { Star } from 'lucide-react'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper/types'
import 'swiper/css'

const DOT_COUNT = 32
const DOT_RADIUS = 46
const DOT_SIZE = 2.2

function DottedAvatarFrame({
    src,
    alt,
    clipId,
    accentColor,
}: {
    src: string
    alt: string
    clipId: string
    accentColor: string
}) {
    const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
        const angle = (i / DOT_COUNT) * Math.PI * 2 - Math.PI / 2
        const cx = 50 + DOT_RADIUS * Math.cos(angle)
        const cy = 50 + DOT_RADIUS * Math.sin(angle)
        return { cx, cy, isTopHalf: cy <= 50.5 }
    })

    return (
        <div className='relative h-[92px] w-[92px] sm:h-[100px] sm:w-[100px]'>
            <svg
                className='testimonial-dots-full absolute inset-0 h-full w-full'
                viewBox='0 0 100 100'
                aria-hidden
            >
                {dots.map((dot, i) => (
                    <circle key={`gold-${i}`} cx={dot.cx} cy={dot.cy} r={DOT_SIZE} fill={accentColor} />
                ))}
            </svg>

            <svg
                className='testimonial-dots-arc absolute inset-0 hidden h-full w-full'
                viewBox='0 0 100 100'
                aria-hidden
            >
                <defs>
                    <clipPath id={clipId}>
                        <rect x='0' y='0' width='100' height='52' />
                    </clipPath>
                </defs>
                <g clipPath={`url(#${clipId})`}>
                    {dots.map(
                        (dot, i) =>
                            dot.isTopHalf && (
                                <circle key={`white-${i}`} cx={dot.cx} cy={dot.cy} r={DOT_SIZE} fill='#FFFFFF' />
                            ),
                    )}
                </g>
            </svg>

            <div className='absolute left-1/2 top-1/2 h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-[2.5px] border-white sm:h-20 sm:w-20'>
                <Image src={src} alt={alt} fill className='object-cover' sizes='80px' />
            </div>
        </div>
    )
}

function TestimonialCard({
    quote,
    name,
    location,
    avatar,
    clipId,
    colors,
}: {
    quote: string
    name: string
    location: string
    avatar: string
    clipId: string
    colors: HomepagePage['theme']['colors']
}) {
    return (
        <div className='flex flex-col items-center px-2 pb-4 pt-2'>
            <div
                className='testimonial-quote relative mx-auto w-full max-w-[400px] rounded-xl px-5 pb-16 pt-8 text-center transition-colors duration-300 sm:px-7 sm:pb-[72px] sm:pt-10'
                style={{ backgroundColor: colors.quoteBackground, color: colors.textBody, fontFamily: 'var(--hp-font-body)' }}
            >
                <p className='text-readable text-sm font-normal leading-7 sm:text-base'>{quote}</p>

                <div className='testimonial-avatar-wrap absolute -bottom-11 left-1/2 -translate-x-1/2 sm:-bottom-12'>
                    <DottedAvatarFrame
                        src={avatar}
                        alt={name}
                        clipId={clipId}
                        accentColor={colors.accent}
                    />
                </div>
            </div>

            <div className='mt-14 text-center sm:mt-16'>
                <h3
                    className='text-readable text-base font-semibold tracking-normal sm:text-xl'
                    style={{ color: colors.cardTitle, fontFamily: 'var(--hp-font-body)' }}
                >
                    {name}
                </h3>
                <p
                    className='text-readable pt-0.5 text-base font-normal capitalize'
                    style={{ color: colors.textNeutral, fontFamily: 'var(--hp-font-body)' }}
                >
                    {location}
                </p>
                <div className='mt-2 flex items-center justify-center gap-1'>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className='h-4 w-4' style={{ fill: colors.accent, color: colors.accent }} aria-hidden />
                    ))}
                </div>
            </div>
        </div>
    )
}

const Testimonials = ({ page }: HomepagePageProps) => {
    const section = page.sections.testimonials
    const { colors } = page.theme

    const swiperRef = useRef<SwiperType | null>(null)
    const [activeIndex, setActiveIndex] = useState(1)

    return (
        <section className='overflow-hidden bg-white pb-16 sm:pb-20 lg:pb-[112px]' aria-labelledby='testimonials-heading'>
            <div className='agency-container py-10 sm:py-12 lg:py-14'>
                <header className='mx-auto max-w-3xl text-center'>
                    <SectionEyebrow name={section.eyebrow} color={colors.eyebrow} />
                    <h2
                        id='testimonials-heading'
                        className='agency-section-heading pt-3 text-[40px] font-medium leading-[48px] sm:pt-4'
                        style={{ color: colors.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                </header>

                <div className='relative mx-auto mt-8 max-w-[1280px] sm:mt-10 lg:mt-12'>
                    <Swiper
                        slidesPerView={1}
                        centeredSlides
                        loop
                        speed={500}
                        spaceBetween={20}
                        initialSlide={1}
                        breakpoints={{
                            640: { slidesPerView: 1.4, spaceBetween: 24 },
                            900: { slidesPerView: 2.2, spaceBetween: 28 },
                            1100: { slidesPerView: 3, spaceBetween: 32 },
                        }}
                        onBeforeInit={(swiper) => {
                            swiperRef.current = swiper
                        }}
                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                        className='testimonials-swiper !overflow-visible px-2'
                    >
                        {(section.items ?? []).map((item, index) => (
                            <SwiperSlide key={`${item.name}-${index}`} className='!h-auto'>
                                <TestimonialCard
                                    {...item}
                                    clipId={`testimonial-arc-${index}`}
                                    colors={colors}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className='mx-auto mt-8 flex items-center justify-center gap-3 sm:mt-10'>
                    {(section.items ?? []).map((_, idx) => (
                        <button
                            key={idx}
                            type='button'
                            aria-label={`Go to testimonial ${idx + 1}`}
                            onClick={() => swiperRef.current?.slideToLoop(idx)}
                            className={cn(
                                'transition-all duration-300',
                                idx === activeIndex
                                    ? 'h-2 w-10 rounded-full'
                                    : 'h-2.5 w-2.5 rounded-full border-2 bg-transparent',
                            )}
                            style={
                                idx === activeIndex
                                    ? { backgroundColor: colors.primary }
                                    : { borderColor: colors.accent }
                            }
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials

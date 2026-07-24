'use client'

import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { HP_CSS_VARS, STATIC_UI_COLORS } from '@/data/homepage'
import { useTemplateStyles } from '@/components/providers/TemplateStylesProvider'
import {
    configureSwiperNavigation,
    SwiperSideNavigation,
    useSwiperNavigationRefs,
} from '@/components/ui/swiper-side-navigation'
import { cn } from '@/lib/utils/clsxUtils'
import { Quote, Star, User } from 'lucide-react'
import { HomepageMediaImage } from '@/components/ui/homepage-media-image'
import React, { useRef, useState } from 'react'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper/types'
import 'swiper/css'

const DOT_COUNT = 32
const DOT_RADIUS = 46
const DOT_SIZE = 2.2

type TestimonialItem = {
    quote: string
    name: string
    location: string
    avatar: string
}

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
                <HomepageMediaImage src={src} alt={alt} fill className='object-cover' sizes='80px' />
            </div>
        </div>
    )
}

function ClassicTestimonialCard({
    quote,
    name,
    location,
    avatar,
    clipId,
}: TestimonialItem & { clipId: string }) {
    const testimonials = useTemplateStyles().pages.home.testimonials

    return (
        <div className='flex flex-col items-center px-2 pb-4 pt-2'>
            <div
                className={cn(testimonials.quote)}
                style={{ backgroundColor: STATIC_UI_COLORS.quoteBackground, color: STATIC_UI_COLORS.textBody, fontFamily: 'var(--hp-font-body)' }}
            >
                <p className='text-readable text-sm font-normal leading-6 sm:text-base'>{quote}</p>

                <div className='testimonial-avatar-wrap absolute -bottom-11 left-1/2 -translate-x-1/2 sm:-bottom-12'>
                    <DottedAvatarFrame
                        src={avatar}
                        alt={name}
                        clipId={clipId}
                        accentColor={STATIC_UI_COLORS.accent}
                    />
                </div>
            </div>

            <div className={cn(testimonials.meta)}>
                <h3
                    className='text-readable text-base font-semibold tracking-normal sm:text-xl'
                    style={{ color: STATIC_UI_COLORS.cardTitle, fontFamily: 'var(--hp-font-body)' }}
                >
                    {name}
                </h3>
                <p
                    className='text-readable pt-0.5 text-base font-normal capitalize'
                    style={{ color: STATIC_UI_COLORS.textNeutral, fontFamily: 'var(--hp-font-body)' }}
                >
                    {location}
                </p>
                <div className='mt-2 flex items-center justify-center gap-1'>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className='h-4 w-4' style={{ fill: STATIC_UI_COLORS.accent, color: STATIC_UI_COLORS.accent }} aria-hidden />
                    ))}
                </div>
            </div>
        </div>
    )
}

function PremiumTestimonialCard({
    quote,
    name,
    location,
    avatar,
}: TestimonialItem) {
    const testimonials = useTemplateStyles().pages.home.testimonials
    const hasAvatar = Boolean(avatar?.trim())

    return (
        <article className={cn(testimonials.quote)}>
            <div className='mb-5 flex items-start justify-between gap-3'>
                <div className='relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#EEF2F3] sm:h-14 sm:w-14'>
                    {hasAvatar ? (
                        <HomepageMediaImage
                            src={avatar}
                            alt={name}
                            fill
                            className='object-cover'
                            sizes='56px'
                        />
                    ) : (
                        <span className='flex h-full w-full items-center justify-center text-[var(--hp-color-primary)]/45'>
                            <User className='h-6 w-6' aria-hidden />
                        </span>
                    )}
                </div>
                <Quote
                    className='h-6 w-6 shrink-0 text-[var(--hp-color-primary)] sm:h-7 sm:w-7'
                    aria-hidden
                />
            </div>

            <p
                className='text-readable flex-1 text-sm font-normal leading-7 sm:text-[15px] sm:leading-7'
                style={{ color: STATIC_UI_COLORS.textBody, fontFamily: 'var(--hp-font-body)' }}
            >
                {quote}
            </p>

            <div className={cn(testimonials.meta)}>
                <h3
                    className='text-readable text-base font-semibold tracking-normal sm:text-lg'
                    style={{ color: HP_CSS_VARS.primary, fontFamily: 'var(--hp-font-heading)' }}
                >
                    {name}
                </h3>
                <p
                    className='text-readable pt-0.5 text-sm font-normal capitalize sm:text-[15px]'
                    style={{ color: STATIC_UI_COLORS.textNeutral, fontFamily: 'var(--hp-font-body)' }}
                >
                    {location}
                </p>
            </div>
        </article>
    )
}

type CarouselHandlers = {
    onReady: (swiper: SwiperType) => void
    onIndexChange: (index: number) => void
}

function ClassicTestimonialsCarousel({
    items,
    canSlide,
    onReady,
    onIndexChange,
}: {
    items: TestimonialItem[]
    canSlide: boolean
} & CarouselHandlers) {
    return (
        <Swiper
            key={`classic-${items.length}-${items.map((item) => item.name).join('|')}`}
            modules={[Autoplay]}
            slidesPerView={1}
            loop={false}
            speed={500}
            spaceBetween={20}
            autoplay={
                canSlide
                    ? {
                        delay: 4500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }
                    : false
            }
            breakpoints={{
                640: { slidesPerView: 1.4, spaceBetween: 24 },
                900: { slidesPerView: 2.2, spaceBetween: 28 },
                1100: { slidesPerView: 3, spaceBetween: 32 },
            }}
            onBeforeInit={(swiper) => {
                onReady(swiper)
            }}
            onSwiper={onReady}
            onSlideChange={(swiper) => {
                onIndexChange(swiper.activeIndex)
            }}
            className='testimonials-swiper !overflow-visible px-2'
        >
            {items.map((item, index) => (
                <SwiperSlide key={`${item.name}-${index}`} className='!h-auto'>
                    <ClassicTestimonialCard
                        {...item}
                        clipId={`testimonial-arc-${index}`}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

function PremiumTestimonialsCarousel({
    items,
    canSlide,
    onReady,
    onIndexChange,
}: {
    items: TestimonialItem[]
    canSlide: boolean
} & CarouselHandlers) {
    const { prevRef, nextRef } = useSwiperNavigationRefs()

    return (
        <Swiper
            key={`premium-${items.length}-${items.map((item) => item.name).join('|')}`}
            modules={[Autoplay, Navigation]}
            slidesPerView={1}
            loop={false}
            speed={500}
            spaceBetween={16}
            watchOverflow
            autoplay={
                canSlide
                    ? {
                        delay: 4500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }
                    : false
            }
            breakpoints={{
                640: { slidesPerView: 1.35, spaceBetween: 18 },
                900: { slidesPerView: 2.15, spaceBetween: 20 },
                1100: { slidesPerView: 3, spaceBetween: 22 },
            }}
            navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
                onReady(swiper)
                configureSwiperNavigation(swiper, prevRef.current, nextRef.current)
            }}
            onSwiper={(swiper) => {
                onReady(swiper)
                configureSwiperNavigation(swiper, prevRef.current, nextRef.current)
                swiper.navigation.init()
                swiper.navigation.update()
            }}
            onSlideChange={(swiper) => {
                onIndexChange(swiper.activeIndex)
            }}
            className='testimonials-premium-swiper !overflow-hidden [&_.swiper-wrapper]:items-stretch'
        >
            {items.map((item, index) => (
                <SwiperSlide key={`${item.name}-${index}`} className='!h-auto'>
                    <PremiumTestimonialCard {...item} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

function PaginationDots({
    count,
    activeIndex,
    onSelect,
}: {
    count: number
    activeIndex: number
    onSelect: (index: number) => void
}) {
    return (
        <div className='mx-auto mt-8 flex items-center justify-center gap-3 sm:mt-10'>
            {Array.from({ length: count }).map((_, idx) => (
                <button
                    key={idx}
                    type='button'
                    aria-label={`Go to testimonial ${idx + 1}`}
                    onClick={() => onSelect(idx)}
                    className={cn(
                        'transition-all duration-300',
                        idx === activeIndex
                            ? 'h-2 w-10 rounded-full'
                            : 'h-2.5 w-2.5 rounded-full border-2 bg-transparent',
                    )}
                    style={
                        idx === activeIndex
                            ? { backgroundColor: HP_CSS_VARS.primary }
                            : { borderColor: STATIC_UI_COLORS.textNeutral }
                    }
                />
            ))}
        </div>
    )
}

const Testimonials = ({ page }: HomepagePageProps) => {
    const section = page.sections.testimonials
    const items = section.items ?? []
    const canSlide = items.length > 1
    const testimonials = useTemplateStyles().pages.home.testimonials
    const sectionHeader = useTemplateStyles().pages.home.sectionHeader
    const isPremium = testimonials.variant === 'premium'

    const swiperRef = useRef<SwiperType | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    const handlers: CarouselHandlers = {
        onReady: (instance) => {
            swiperRef.current = instance
        },
        onIndexChange: setActiveIndex,
    }

    return (
        <section
            className={cn(
                testimonials.section ?? 'overflow-hidden bg-white',
                !testimonials.section && isPremium && 'bg-[#F7F9FA]',
            )}
            aria-labelledby='testimonials-heading'
        >
            <div className='agency-container pb-12 sm:pb-20 lg:pb-[100px]'>
                <header className={cn(testimonials.header)}>
                    <SectionEyebrow name={section.eyebrow} className={sectionHeader.eyebrow} />
                    <h2
                        id='testimonials-heading'
                        className={cn(
                            sectionHeader.title,
                            'pt-3 text-[40px] font-medium leading-[48px] sm:pt-4',
                        )}
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                </header>

                <div
                    className={cn(
                        'relative mx-auto mt-8 max-w-[1280px] sm:mt-10 lg:mt-12',
                        isPremium && testimonials.carouselWrap,
                    )}
                >
                    {isPremium ? (
                        <SwiperSideNavigation
                            enabled={canSlide}
                            prevLabel='Previous testimonials'
                            nextLabel='Next testimonials'
                        >
                            <PremiumTestimonialsCarousel
                                items={items}
                                canSlide={canSlide}
                                {...handlers}
                            />
                        </SwiperSideNavigation>
                    ) : (
                        <ClassicTestimonialsCarousel
                            items={items}
                            canSlide={canSlide}
                            {...handlers}
                        />
                    )}
                </div>

                <PaginationDots
                    count={items.length}
                    activeIndex={activeIndex}
                    onSelect={(index) => swiperRef.current?.slideTo(index)}
                />
            </div>
        </section>
    )
}

export default Testimonials

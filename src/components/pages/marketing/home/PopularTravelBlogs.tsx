'use client'

import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { Button } from '@/components/ui/button'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import type { HomepagePage } from '@/data/homepage'
import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE, HP_THEME_TEXT_CLASS, STATIC_UI_COLORS } from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'
import { Calendar, ChevronLeft, ChevronRight, MessageCircle, ThumbsUp } from 'lucide-react'
import { StorageMediaImage } from '@/components/ui/storage-media-image'
import React, { useRef } from 'react'
import { blogDetailPath } from '@/services/blog/blog.utils'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

function BlogCard({
    title,
    author,
    date,
    likes,
    comments,
    excerpt,
    image,
    href,
    section,
}: HomepagePage['sections']['popularTravelBlogs']['posts'][number] & {
    section: HomepagePage['sections']['popularTravelBlogs']
}) {
    return (
        <article
            className='flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
            style={{ borderColor: STATIC_UI_COLORS.borderLight }}
        >
            <div className='relative aspect-[4/3] w-full shrink-0 overflow-hidden border-b border-white/20'>
                <StorageMediaImage
                    src={image}
                    alt={title}
                    fill
                    className='object-cover'
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                />
                <div className='absolute inset-x-0 bottom-0 flex items-stretch border-t border-white/25 bg-black/35'>
                    <div className='flex min-w-0 flex-1 items-center justify-center gap-1 border-r border-white/80 px-2 py-2 text-[11px] font-normal leading-4 text-white sm:gap-1.5 sm:px-3 sm:py-2.5 sm:text-sm sm:leading-5'>
                        <Calendar className='h-3 w-3 shrink-0 stroke-[1.5] sm:h-3.5 sm:w-3.5' aria-hidden />
                        <span className='truncate'>{date}</span>
                    </div>
                    <div className='flex min-w-0 flex-1 items-center justify-center gap-1 border-r border-white/80 px-2 py-2 text-[11px] font-normal leading-4 text-white sm:gap-1.5 sm:px-3 sm:py-2.5 sm:text-sm sm:leading-5'>
                        <ThumbsUp className='h-3 w-3 shrink-0 stroke-[1.5] sm:h-3.5 sm:w-3.5' aria-hidden />
                        <span className='truncate'>{likes}</span>
                    </div>
                    <div className='flex min-w-0 flex-1 items-center justify-center gap-1 px-2 py-2 text-[11px] font-normal leading-4 text-white sm:gap-1.5 sm:px-3 sm:py-2.5 sm:text-sm sm:leading-5'>
                        <MessageCircle className='h-3 w-3 shrink-0 stroke-[1.5] sm:h-3.5 sm:w-3.5' aria-hidden />
                        <span className='truncate'>{comments}</span>
                    </div>
                </div>
            </div>

            <div className='flex min-w-0 flex-1 flex-col p-4 sm:p-6'>
                <p
                    className='pb-2 text-sm font-normal leading-5 sm:pb-3 sm:text-base sm:leading-6'
                    style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                >
                    {section.postedByPrefix} <span>{author}</span>
                </p>
                <h3
                    className='pb-2 text-base font-semibold leading-6 sm:pb-4 sm:text-xl sm:leading-7 lg:text-2xl'
                    style={{ color: STATIC_UI_COLORS.cardTitle, fontFamily: 'var(--hp-font-body)' }}
                >
                    {title}
                </h3>
                <p
                    className='flex-1 text-sm font-normal leading-5 sm:text-base sm:leading-6'
                    style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                >
                    {excerpt}
                </p>
                <Button
                    variant='default'
                    style={HP_THEME_BTN_STYLE}
                    className={cn('mt-3 w-max min-w-[100px] sm:mt-4 sm:min-w-[110px]', HP_THEME_BTN_CLASS)}
                    href={href || blogDetailPath()}
                >
                    {section.readMoreLabel}
                </Button>
            </div>
        </article>
    )
}

const BLOG_CAROUSEL_THRESHOLD = 3

const PopularTravelBlogs = ({ page }: HomepagePageProps) => {
    const section = page.sections.popularTravelBlogs
    const posts = section.posts ?? []
    const useCarousel = posts.length > BLOG_CAROUSEL_THRESHOLD
    const prevRef = useRef<HTMLButtonElement>(null)
    const nextRef = useRef<HTMLButtonElement>(null)

    return (
        <section className='bg-white' aria-labelledby='popular-travel-blogs-heading'>
            <div className='agency-container'>
                <header className='mx-auto max-w-[861px] text-center'>
                    <SectionEyebrow name={section.eyebrow} />
                    <h2
                        id='popular-travel-blogs-heading'
                        className='agency-section-heading pt-3 text-[40px] font-medium leading-[48px] sm:pt-4'
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                    <p
                        className='mx-auto pt-4 text-base font-normal leading-7 sm:pt-5'
                        style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                    >
                        {section.paragraph}
                    </p>

                    {useCarousel ? (
                        <div className='mt-5 flex items-center justify-center gap-2 sm:mt-6'>
                            <button
                                ref={prevRef}
                                type='button'
                                aria-label='Previous blog posts'
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
                                aria-label='Next blog posts'
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
                            slidesPerView={1}
                            spaceBetween={16}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 24,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 24,
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
                            {posts.map((post) => (
                                <SwiperSlide key={post.title} className='!h-auto'>
                                    <BlogCard {...post} section={section} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                ) : (
                    <div className='mx-auto grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 sm:gap-6 sm:pt-12 lg:grid-cols-3 lg:gap-6 lg:pt-14'>
                        {posts.map((post) => (
                            <BlogCard key={post.title} {...post} section={section} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default PopularTravelBlogs

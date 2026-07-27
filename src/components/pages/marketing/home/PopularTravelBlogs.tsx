'use client'

import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { Button } from '@/components/ui/button'
import {
    configureSwiperNavigation,
    SwiperSideNavigation,
    useSwiperNavigationRefs,
} from '@/components/ui/swiper-side-navigation'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import type { HomepagePage } from '@/data/homepage'
import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE, STATIC_UI_COLORS } from '@/data/homepage'
import { useTemplateStyles } from '@/components/providers/TemplateStylesProvider'
import { cn } from '@/lib/utils/clsxUtils'
import { Calendar } from 'lucide-react'
import { HomepageMediaImage } from '@/components/ui/homepage-media-image'
import React from 'react'
import { resolveBlogPostHref } from '@/services/blog/blog.utils'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

function BlogCard({
    title,
    author,
    date,
    excerpt,
    image,
    href,
    section,
}: HomepagePage['sections']['popularTravelBlogs']['posts'][number] & {
    section: HomepagePage['sections']['popularTravelBlogs']
}) {
    const blogs = useTemplateStyles().pages.home.blogs

    return (
        <article
            className={cn(blogs.card)}
            style={{ borderColor: STATIC_UI_COLORS.borderLight }}
        >
            <div className='relative aspect-[4/3] w-full shrink-0 overflow-hidden border-b border-white/20'>
                <HomepageMediaImage
                    src={image}
                    alt={title}
                    fill
                    className='object-cover'
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                />
                <div className='absolute inset-x-0 bottom-0 flex items-stretch border-t border-white/25 bg-black/35'>
                    <div className='flex min-w-0 flex-1 items-center justify-center gap-1 px-2 py-2 text-[11px] font-normal leading-4 text-white sm:gap-1.5 sm:px-3 sm:py-2.5 sm:text-sm sm:leading-5'>
                        <Calendar className='h-3 w-3 shrink-0 stroke-[1.5] sm:h-3.5 sm:w-3.5' aria-hidden />
                        <span className='truncate'>{date}</span>
                    </div>
                </div>
            </div>

            <div className={cn(blogs.cardContent)}>
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
                    className={cn(
                        'swiper-no-swiping mt-3 w-max min-w-[100px] sm:mt-4 sm:min-w-[110px]',
                        HP_THEME_BTN_CLASS,
                    )}
                    href={resolveBlogPostHref(href)}
                >
                    {section.readMoreLabel}
                </Button>
            </div>
        </article>
    )
}

const BLOG_CAROUSEL_THRESHOLD = 3

function BlogPostsSwiper({
    posts,
    section,
}: {
    posts: HomepagePage['sections']['popularTravelBlogs']['posts']
    section: HomepagePage['sections']['popularTravelBlogs']
}) {
    const { prevRef, nextRef } = useSwiperNavigationRefs()

    return (
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
                configureSwiperNavigation(swiper, prevRef.current, nextRef.current)
            }}
            className='select-none !overflow-hidden'
        >
            {posts.map((post) => (
                <SwiperSlide key={post.title} className='!h-auto'>
                    <BlogCard {...post} section={section} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

const PopularTravelBlogs = ({ page }: HomepagePageProps) => {
    const section = page.sections.popularTravelBlogs
    const posts = section.posts ?? []
    const useCarousel = posts.length > BLOG_CAROUSEL_THRESHOLD
    const blogs = useTemplateStyles().pages.home.blogs
    const sectionHeader = useTemplateStyles().pages.home.sectionHeader

    return (
        <section className='bg-white' aria-labelledby='popular-travel-blogs-heading'>
            <div className='agency-container'>
                <header className={cn(blogs.header)}>
                    <SectionEyebrow name={section.eyebrow} className={sectionHeader.eyebrow} />
                    <h2
                        id='popular-travel-blogs-heading'
                        className={cn(
                            sectionHeader.title,
                            'pt-3 text-[40px] font-medium leading-[48px] sm:pt-4',
                        )}
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                    <p
                        className={cn(
                            'pt-4 text-base font-normal leading-6 sm:pt-5',
                            'mx-auto md:mx-0',
                        )}
                        style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                    >
                        {section.paragraph}
                    </p>
                </header>

                {useCarousel ? (
                    <div className='mx-auto max-w-[1240px] overflow-x-hidden pt-6 sm:pt-8 lg:pt-10'>
                        <SwiperSideNavigation
                            prevLabel='Previous blog posts'
                            nextLabel='Next blog posts'
                        >
                            <BlogPostsSwiper posts={posts} section={section} />
                        </SwiperSideNavigation>
                    </div>
                ) : (
                    <div className={cn(blogs.grid)}>
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

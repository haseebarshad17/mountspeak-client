'use client'

import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { Button } from '@/components/ui/button'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import type { HomepagePage } from '@/data/homepage'
import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE, STATIC_UI_COLORS } from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'
import { Calendar, MessageCircle, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

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
            className='flex h-full w-full flex-col overflow-hidden rounded-xl border bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
            style={{ borderColor: STATIC_UI_COLORS.borderLight }}
        >
            <div className='relative aspect-[4/3] shrink-0 overflow-hidden border-b border-white/20 w-[416px] h-[250px]'>
                <Image src={image} alt={title} fill className='object-cover' sizes='(max-width: 768px) 100vw, 33vw' />
                <div className='absolute inset-x-0 bottom-0 flex items-stretch border-t border-white/25 bg-transparent'>
                    <div
                        className='flex flex-1 items-center justify-center gap-1.5 border-r border-white/80 px-3 py-2.5 text-sm font-normal leading-5 text-white'
                    >
                        <Calendar className='h-3.5 w-3.5 shrink-0 stroke-[1.5]' aria-hidden />
                        {date}
                    </div>
                    <div
                        className='flex flex-1 items-center justify-center gap-1.5 border-r border-white/80 px-3 py-2.5 text-sm font-normal leading-5 text-white'
                    >
                        <ThumbsUp className='h-3.5 w-3.5 shrink-0 stroke-[1.5]' aria-hidden />
                        {likes}
                    </div>
                    <div
                        className='flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-normal leading-5 text-white'
                    >
                        <MessageCircle className='h-3.5 w-3.5 shrink-0 stroke-[1.5]' aria-hidden />
                        {comments}
                    </div>
                </div>
            </div>

            <div className='flex flex-1 flex-col p-6 w-[416px] h-[269px]'>
                <p
                    className='text-base font-normal leading-6 pb-3'
                    style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                >
                    {section.postedByPrefix} <span>{author}</span>
                </p>
                <h3
                    className='pt-2 sm:text-2xl font-semibold text-[17px] leading-7 pb-4'
                    style={{ color: STATIC_UI_COLORS.cardTitle, fontFamily: 'var(--hp-font-body)' }}
                >
                    {title}
                </h3>
                <p
                    className='pt-2 flex-1 text-base font-normal leading-6'
                    style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                >
                    {excerpt}
                </p>
                <Button
                    asChild
                    variant='default'
                    style={HP_THEME_BTN_STYLE}
                    className={cn('mt-4 w-max min-w-[110px]', HP_THEME_BTN_CLASS)}
                >
                    <Link href={href || '#'}>{section.readMoreLabel}</Link>
                </Button>
            </div>
        </article>
    )
}

const PopularTravelBlogs = ({ page }: HomepagePageProps) => {
    const section = page.sections.popularTravelBlogs

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
                </header>

                <div className='mx-auto grid grid-cols-1 gap-6 pt-10 sm:grid-cols-2 sm:gap-6 sm:pt-12 lg:grid-cols-3 lg:gap-6 lg:pt-14'>
                    {section.posts.map((post) => (
                        <BlogCard
                            key={post.title}
                            {...post}
                            section={section}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default PopularTravelBlogs

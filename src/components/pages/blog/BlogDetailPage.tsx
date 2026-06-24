'use client'

import { Button } from '@/components/ui/button'
import { PageHeroBanner, PAGE_HERO_CONTENT_CLASS } from '@/components/ui/page-hero-banner'
import { StorageMediaImage } from '@/components/ui/storage-media-image'
import type { BlogContentBlock, BlogDetailPageContent } from '@/components/pages/blog/blog.types'
import {
    HP_THEME_BG_CLASS,
    HP_THEME_BTN_CLASS,
    HP_THEME_BTN_STYLE,
    HP_THEME_TEXT_CLASS,
    STATIC_UI_COLORS,
} from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'
import { Calendar, ChevronLeft, MessageCircle, ThumbsUp } from 'lucide-react'

function BlogContentBlockView({ block }: { block: BlogContentBlock }) {
    switch (block.type) {
        case 'heading':
            return (
                <h2
                    className='pt-2 text-2xl font-semibold leading-8 sm:text-[28px] sm:leading-9'
                    style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                >
                    {block.content}
                </h2>
            )
        case 'quote':
            return (
                <blockquote
                    className='border-l-4 py-1 pl-5 sm:pl-6'
                    style={{ borderColor: 'var(--hp-color-primary)' }}
                >
                    <p
                        className='text-lg font-medium italic leading-8 sm:text-xl'
                        style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-body)' }}
                    >
                        &ldquo;{block.content}&rdquo;
                    </p>
                    {block.attribution ? (
                        <footer
                            className='mt-3 text-sm font-normal'
                            style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                        >
                            — {block.attribution}
                        </footer>
                    ) : null}
                </blockquote>
            )
        case 'image':
            return (
                <figure className='overflow-hidden rounded-xl border' style={{ borderColor: STATIC_UI_COLORS.borderLight }}>
                    <div className='relative aspect-[16/10] w-full'>
                        <StorageMediaImage
                            src={block.src}
                            alt={block.alt}
                            fill
                            className='object-cover'
                            sizes='(max-width: 768px) 100vw, 800px'
                        />
                    </div>
                    {block.caption ? (
                        <figcaption
                            className='px-4 py-3 text-sm leading-6'
                            style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {block.caption}
                        </figcaption>
                    ) : null}
                </figure>
            )
        case 'list':
            return (
                <ul className='space-y-2 pl-5'>
                    {block.items.map((item) => (
                        <li
                            key={item}
                            className='list-disc text-base leading-7'
                            style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )
        case 'paragraph':
        default:
            return (
                <p
                    className='text-base leading-7 sm:text-[17px] sm:leading-8'
                    style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                >
                    {block.content}
                </p>
            )
    }
}

type BlogDetailPageProps = {
    page: BlogDetailPageContent['page']
}

export default function BlogDetailPage({ page }: BlogDetailPageProps) {
    const { hero, article, tags, relatedCta } = page

    return (
        <>
            <PageHeroBanner backgroundImage={hero.image} fixedHeight='tall' overlayClassName='bg-black/40'>
                <div className={PAGE_HERO_CONTENT_CLASS}>
                    <p className='text-xs font-semibold uppercase tracking-[0.6px] text-white/80'>
                        {hero.eyebrow}
                    </p>
                    <h1 className='mx-auto mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl xl:text-[45px]'>
                        {hero.title}
                    </h1>

                    <div className='mx-auto mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/90 sm:gap-6 sm:text-base'>
                        <span>Posted by {hero.author}</span>
                        <span className='hidden h-4 w-px bg-white/40 sm:block' aria-hidden />
                        <span className='inline-flex items-center gap-1.5'>
                            <Calendar className='h-4 w-4' aria-hidden />
                            {hero.date}
                        </span>
                        <span className='hidden h-4 w-px bg-white/40 sm:block' aria-hidden />
                        <span className='inline-flex items-center gap-1.5'>
                            <ThumbsUp className='h-4 w-4' aria-hidden />
                            {hero.likes}
                        </span>
                        <span className='inline-flex items-center gap-1.5'>
                            <MessageCircle className='h-4 w-4' aria-hidden />
                            {hero.comments}
                        </span>
                    </div>
                </div>
            </PageHeroBanner>

            <main className='bg-[#F7F8FA] pb-20 pt-10 sm:pt-12 lg:pt-16'>
                <div className='agency-container'>
                    <div className='mx-auto max-w-[860px] px-[15px]'>
                        <Button
                            variant='ghost'
                            href='/'
                            className='mb-6 -ml-2 inline-flex items-center gap-1.5 px-2 text-sm font-medium'
                            style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                        >
                            <ChevronLeft className='h-4 w-4' aria-hidden />
                            Back to Home
                        </Button>

                        <article className='rounded-2xl border bg-white px-5 py-8 shadow-sm sm:px-10 sm:py-12'>
                            <p
                                className='text-lg font-medium leading-8 sm:text-xl sm:leading-9'
                                style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-body)' }}
                            >
                                {article.intro}
                            </p>

                            <div className='mt-8 space-y-6 sm:mt-10 sm:space-y-8'>
                                {article.sections.map((block, index) => (
                                    <BlogContentBlockView key={`${block.type}-${index}`} block={block} />
                                ))}
                            </div>

                            {tags.length > 0 ? (
                                <div className='mt-10 border-t pt-8' style={{ borderColor: STATIC_UI_COLORS.borderLight }}>
                                    <p
                                        className='text-xs font-semibold uppercase tracking-[0.6px]'
                                        style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                                    >
                                        Tags
                                    </p>
                                    <div className='mt-4 flex flex-wrap gap-2'>
                                        {tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className={cn(
                                                    'rounded-full border px-3 py-1.5 text-sm font-medium',
                                                    HP_THEME_TEXT_CLASS,
                                                )}
                                                style={{
                                                    borderColor: STATIC_UI_COLORS.borderLight,
                                                    fontFamily: 'var(--hp-font-body)',
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </article>

                        <section
                            className={cn(
                                'mt-10 rounded-2xl px-6 py-10 text-center text-white sm:px-10 sm:py-12',
                                HP_THEME_BG_CLASS,
                            )}
                        >
                            <h2
                                className='text-2xl font-semibold leading-8 sm:text-3xl'
                                style={{ fontFamily: 'var(--hp-font-heading)' }}
                            >
                                {relatedCta.title}
                            </h2>
                            <p
                                className='mx-auto mt-4 max-w-xl text-sm leading-7 text-white/90 sm:text-base'
                                style={{ fontFamily: 'var(--hp-font-body)' }}
                            >
                                {relatedCta.description}
                            </p>
                            <Button
                                variant='default'
                                href={relatedCta.buttonHref}
                                className={cn('mt-6', HP_THEME_BTN_CLASS)}
                                style={HP_THEME_BTN_STYLE}
                            >
                                {relatedCta.buttonLabel}
                            </Button>
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
}

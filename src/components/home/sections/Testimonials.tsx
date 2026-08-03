'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Temp3SectionHeader } from '@/components/home/Temp3SectionHeader'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { TestimonialsSection } from '@/services/agency/agency.types'
import { cn } from '@/lib/utils/cn'

function StarRating() {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
        </div>
    )
}

function Temp3StarRating() {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-t3-gold text-t3-gold"
                />
            ))}
        </div>
    )
}

function Temp3Testimonials({
    eyebrow,
    title,
    items,
}: {
    eyebrow: string
    title: string
    items: NonNullable<TestimonialsSection['items']>
}) {
    const scrollerRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const [progress, setProgress] = useState(0)
    const [canPrev, setCanPrev] = useState(false)
    const [canNext, setCanNext] = useState(false)
    const [controlsWidth, setControlsWidth] = useState<number | undefined>()

    const updateScrollState = useCallback(() => {
        const el = scrollerRef.current
        const track = trackRef.current
        if (!el) return

        if (track) {
            setControlsWidth(Math.min(track.offsetWidth, el.clientWidth))
        }

        const max = el.scrollWidth - el.clientWidth
        if (max <= 0) {
            setProgress(0)
            setCanPrev(false)
            setCanNext(false)
            return
        }
        const nextProgress = el.scrollLeft / max
        setProgress(Math.min(1, Math.max(0, nextProgress)))
        setCanPrev(el.scrollLeft > 4)
        setCanNext(el.scrollLeft < max - 4)
    }, [])

    useEffect(() => {
        const el = scrollerRef.current
        if (!el) return
        updateScrollState()
        el.addEventListener('scroll', updateScrollState, { passive: true })
        window.addEventListener('resize', updateScrollState)
        return () => {
            el.removeEventListener('scroll', updateScrollState)
            window.removeEventListener('resize', updateScrollState)
        }
    }, [items.length, updateScrollState])

    const scrollByCard = (dir: -1 | 1) => {
        const el = scrollerRef.current
        if (!el) return
        const card = el.querySelector<HTMLElement>('[data-t3-review]')
        const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.8
        el.scrollBy({ left: dir * amount, behavior: 'smooth' })
    }

    const thumbWidth =
        items.length <= 1 ? 100 : Math.max(18, 100 / Math.min(items.length, 5))
    const thumbLeft = (100 - thumbWidth) * progress

    return (
        <section className="t3-section t3-section-soft">
            <div className="t3-wrap">
                <Temp3SectionHeader eyebrow={eyebrow} title={title} tone="cream" />

                {items.length === 0 ? (
                    <EmptyState
                        title="No testimonials yet"
                        description="Client reviews from the site theme will show up here."
                    />
                ) : (
                    <>
                        <div className="mx-auto w-full" style={{ maxWidth: controlsWidth }}>
                            <div
                                ref={scrollerRef}
                                className="scrollbar-hide overflow-x-auto pb-2 pt-1"
                            >
                                <div
                                    ref={trackRef}
                                    className="mx-auto flex w-max snap-x snap-mandatory gap-4 md:gap-5"
                                >
                                    {items.map((item, i) => {
                                        const avatar = resolveThemeAssetUrl(item.avatar)
                                        const initial = (item.name || '?')
                                            .trim()
                                            .charAt(0)
                                            .toUpperCase()

                                        return (
                                            <blockquote
                                                key={`${item.name}-${i}`}
                                                data-t3-review
                                                className={cn(
                                                    'group flex h-[280px] w-[240px] shrink-0 snap-center flex-col',
                                                    'rounded-[20px] bg-white p-5 xs:w-[260px] sm:h-[300px] sm:w-[280px] sm:p-6',
                                                    'shadow-[0_14px_40px_rgba(14,27,51,0.07)]',
                                                    'transition duration-300 ease-out',
                                                    'hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(14,27,51,0.11)]'
                                                )}
                                            >
                                                <Temp3StarRating />
                                                <p className="mt-3.5 line-clamp-5 flex-1 font-ui text-[13px] italic leading-relaxed text-t3-navy/75 sm:text-[13.5px]">
                                                    &ldquo;{item.quote}&rdquo;
                                                </p>
                                                <div className="mt-4 flex items-center gap-2.5">
                                                    {avatar ? (
                                                        <div
                                                            className="h-9 w-9 shrink-0 rounded-full bg-cover bg-center"
                                                            style={{
                                                                backgroundImage: `url(${avatar})`,
                                                            }}
                                                            role="img"
                                                            aria-label={item.name}
                                                        />
                                                    ) : (
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#3D8B9C] to-[#1F6F7A] font-ui text-xs font-semibold text-white">
                                                            {initial}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="truncate font-display text-sm font-semibold text-t3-navy">
                                                            {item.name}
                                                        </p>
                                                        {item.location ? (
                                                            <p className="mt-0.5 truncate font-ui text-xs text-t3-dim">
                                                                {item.location}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </blockquote>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="mt-8 flex w-full items-center gap-4 md:mt-10 md:gap-5">
                                <button
                                    type="button"
                                    aria-label="Previous testimonials"
                                    disabled={!canPrev}
                                    onClick={() => scrollByCard(-1)}
                                    className={cn(
                                        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-t3-navy/15 bg-white text-t3-navy/55 transition sm:h-11 sm:w-11',
                                        'hover:border-t3-gold hover:text-t3-gold',
                                        'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-t3-navy/15 disabled:hover:text-t3-navy/55'
                                    )}
                                >
                                    <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                                </button>

                                <div
                                    className="relative h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-t3-navy/10"
                                    aria-hidden
                                >
                                    <span
                                        className="absolute inset-y-0 rounded-full bg-t3-gold transition-[left] duration-300 ease-out"
                                        style={{
                                            width: `${thumbWidth}%`,
                                            left: `${thumbLeft}%`,
                                        }}
                                    />
                                </div>

                                <button
                                    type="button"
                                    aria-label="Next testimonials"
                                    disabled={!canNext}
                                    onClick={() => scrollByCard(1)}
                                    className={cn(
                                        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-t3-navy/15 bg-white text-t3-navy/55 transition sm:h-11 sm:w-11',
                                        'hover:border-t3-gold hover:text-t3-gold',
                                        'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-t3-navy/15 disabled:hover:text-t3-navy/55'
                                    )}
                                >
                                    <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export function Testimonials({ data }: { data: TestimonialsSection }) {
    const variant = useTemplateVariant()
    const items = useMemo(() => data.items ?? [], [data.items])
    const [page, setPage] = useState(0)

    const pageSize = items.length >= 3 ? 3 : Math.max(items.length, 0)
    const pageCount = pageSize > 0 ? Math.ceil(items.length / pageSize) : 0

    useEffect(() => {
        setPage(0)
    }, [items.length])

    const visible = useMemo(() => {
        if (items.length === 0) return []
        if (items.length <= 3) return items
        const start = page * 3
        return items.slice(start, start + 3)
    }, [items, page])

    const modernItems = items.slice(0, 3)

    if (variant === 'temp1') {
        return (
            <section className="section-spacing section-spacing-top bg-[#F7FAFA]">
                <div className="site-container">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-brand text-sm font-medium uppercase">
                            {data.eyebrow}
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                            {data.title}
                        </h2>
                    </div>

                    {modernItems.length === 0 ? (
                        <div className="mt-10">
                            <EmptyState
                                title="No testimonials yet"
                                description="Client reviews from the site theme will show up here."
                            />
                        </div>
                    ) : (
                        <div className="mt-10 grid gap-6 md:grid-cols-3">
                            {modernItems.map((item, i) => {
                                const avatar = resolveThemeAssetUrl(item.avatar)
                                return (
                                    <blockquote
                                        key={`${item.name}-${i}`}
                                        className="flex h-full flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
                                    >
                                        <StarRating />
                                        <p className="mt-4 flex-1 text-[0.98rem] leading-relaxed text-[#222]/80">
                                            &ldquo;{item.quote}&rdquo;
                                        </p>
                                        <div className="mt-6 flex items-center gap-3 border-t border-black/5 pt-5">
                                            <div
                                                className="h-11 w-11 shrink-0 rounded-full bg-[#EDE7DE] bg-cover bg-center"
                                                style={
                                                    avatar
                                                        ? { backgroundImage: `url(${avatar})` }
                                                        : undefined
                                                }
                                            />
                                            <div>
                                                <p className="font-semibold text-[#111]">
                                                    {item.name}
                                                </p>
                                                {item.location ? (
                                                    <p className="text-sm capitalize text-[#666]">
                                                        {item.location}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                    </blockquote>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
        )
    }

    if (variant === 'temp3') {
        return (
            <Temp3Testimonials
                eyebrow={data.eyebrow}
                title={data.title}
                items={items}
            />
        )
    }

    if (variant === 'temp2') {
        return (
            <section className="bg-[#FCF8F3] py-16 md:pb-24 md:pt-20">
                <div className="site-container">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#888]">
                                {data.eyebrow}
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                                {data.title}
                            </h2>
                        </div>
                        {items.length > 3 ? (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    aria-label="Previous testimonials"
                                    onClick={() =>
                                        setPage((current) =>
                                            current === 0 ? pageCount - 1 : current - 1
                                        )
                                    }
                                    className="rounded-full border border-black/10 bg-white p-2 text-[#111]"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next testimonials"
                                    onClick={() =>
                                        setPage((current) =>
                                            current === pageCount - 1 ? 0 : current + 1
                                        )
                                    }
                                    className="rounded-full border border-black/10 bg-white p-2 text-[#111]"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        ) : null}
                    </div>

                    {visible.length === 0 ? (
                        <div className="mt-10">
                            <EmptyState
                                title="No testimonials yet"
                                description="Client reviews from the site theme will show up here."
                            />
                        </div>
                    ) : (
                        <div
                            className={cn(
                                'mt-10 grid gap-6',
                                visible.length === 1 && 'md:grid-cols-1 md:justify-items-center',
                                visible.length === 2 && 'md:grid-cols-2',
                                visible.length >= 3 && 'md:grid-cols-3'
                            )}
                        >
                            {visible.map((item, i) => (
                                <blockquote
                                    key={`${item.name}-${i}-${page}`}
                                    className={cn(
                                        'rounded-[24px] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.05)]',
                                        visible.length === 1 && 'md:max-w-2xl'
                                    )}
                                >
                                    <p className="text-[1.02rem] leading-relaxed text-[#222]/80">
                                        &ldquo;{item.quote}&rdquo;
                                    </p>
                                    <div className="mt-6 flex items-center gap-3">
                                        <div
                                            className="h-11 w-11 rounded-full bg-[#EDE7DE] bg-cover bg-center"
                                            style={{
                                                backgroundImage: resolveThemeAssetUrl(item.avatar)
                                                    ? `url(${resolveThemeAssetUrl(item.avatar)})`
                                                    : undefined,
                                            }}
                                        />
                                        <div>
                                            <p className="font-semibold text-[#111]">{item.name}</p>
                                            <p className="text-sm capitalize text-[#666]">
                                                {item.location}
                                            </p>
                                        </div>
                                    </div>
                                </blockquote>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        )
    }

    return null
}

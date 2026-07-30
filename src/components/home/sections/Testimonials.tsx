'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
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

'use client'

import { AgencyLink } from '@/components/links/AgencyLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { Temp3SectionHeader } from '@/components/home/Temp3SectionHeader'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { PopularTravelBlogsSection } from '@/services/agency/agency.types'

export function Blog({ data }: { data: PopularTravelBlogsSection }) {
    const variant = useTemplateVariant()
    const posts = data.posts ?? []

    if (variant === 'temp1') {
        return (
            <section className="section-spacing section-spacing-top bg-white">
                <div className="site-container">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-brand text-sm font-medium uppercase">
                            {data.eyebrow}
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                            {data.title}
                        </h2>
                        <p className="mt-3 text-[#333]/70">{data.paragraph}</p>
                    </div>

                    {posts.length === 0 ? (
                        <div className="mt-10">
                            <EmptyState
                                title="No blog posts yet"
                                description="Travel stories from the site theme will appear in this section."
                            />
                        </div>
                    ) : (
                        <div className="mt-10 grid gap-6 md:grid-cols-3">
                            {posts.map((post) => {
                                const image = resolveThemeAssetUrl(post.image)
                                return (
                                    <article
                                        key={post.title}
                                        className="flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
                                    >
                                        <div
                                            className="aspect-[16/10] bg-cover bg-center"
                                            style={{
                                                backgroundImage: image
                                                    ? `url(${image})`
                                                    : 'linear-gradient(135deg, var(--color-brand), color-mix(in srgb, var(--color-brand) 55%, #000))',
                                            }}
                                        />
                                        <div className="flex flex-1 flex-col p-5">
                                            <p className="text-xs text-[#888]">{post.date}</p>
                                            <h3 className="mt-2 text-lg font-semibold leading-snug text-[#111]">
                                                {post.title}
                                            </h3>
                                            {post.excerpt ? (
                                                <p className="mt-2 flex-1 text-sm text-[#666]">
                                                    {post.excerpt}
                                                </p>
                                            ) : null}
                                            <AgencyLink
                                                href={post.href || '#'}
                                                className="btn-brand mt-4 inline-flex w-fit rounded-full px-4 py-2 text-sm font-medium"
                                            >
                                                {data.readMoreLabel}
                                            </AgencyLink>
                                        </div>
                                    </article>
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
            <section className="t3-section t3-section-soft">
                <div className="t3-wrap">
                    <Temp3SectionHeader
                        eyebrow={data.eyebrow}
                        title={data.title}
                        subtitle={data.paragraph}
                        tone="cream"
                    />

                    {posts.length === 0 ? (
                        <EmptyState
                            title="No blog posts yet"
                            description="Travel stories from the site theme will appear in this section."
                        />
                    ) : (
                        <div className="grid gap-6 md:grid-cols-3">
                            {posts.map((post) => {
                                const image = resolveThemeAssetUrl(post.image)
                                return (
                                    <article
                                        key={post.title}
                                        className="group flex h-full flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_16px_40px_rgba(14,27,51,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(14,27,51,0.12)]"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden bg-t3-cream">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.04]"
                                                style={{
                                                    backgroundImage: image
                                                        ? `url(${image})`
                                                        : 'linear-gradient(135deg, #0E1B33, #24365C)',
                                                }}
                                            />
                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E1B33]/55 via-transparent to-transparent" />
                                            {post.date ? (
                                                <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 font-ui text-[11px] font-semibold text-t3-navy shadow-sm">
                                                    {post.date}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                                            <h3 className="font-display text-lg font-semibold leading-snug text-t3-navy">
                                                {post.title}
                                            </h3>
                                            {post.excerpt ? (
                                                <p className="mt-2 flex-1 font-ui text-sm leading-relaxed text-t3-dim">
                                                    {post.excerpt}
                                                </p>
                                            ) : null}
                                            {post.author ? (
                                                <p className="mt-3 font-ui text-xs text-t3-dim">
                                                    {data.postedByPrefix} {post.author}
                                                </p>
                                            ) : null}
                                            <AgencyLink
                                                href={post.href || '#'}
                                                className="mt-5 inline-flex w-fit items-center justify-center rounded-full bg-t3-navy px-5 py-2.5 font-ui text-[12px] font-semibold text-t3-cream transition hover:bg-[#152844]"
                                            >
                                                {data.readMoreLabel}
                                            </AgencyLink>
                                        </div>
                                    </article>
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
            <section className="bg-[#FCF8F3] py-16 md:py-20">
                <div className="site-container">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#888]">
                        {data.eyebrow}
                    </p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                        {data.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-[#333]/70">{data.paragraph}</p>

                    {posts.length === 0 ? (
                        <div className="mt-10">
                            <EmptyState
                                title="No blog posts yet"
                                description="Travel stories from the site theme will appear in this section."
                            />
                        </div>
                    ) : (
                        <div className="mt-10 grid gap-6 md:grid-cols-3">
                            {posts.map((post) => {
                                const image = resolveThemeAssetUrl(post.image)
                                return (
                                    <article
                                        key={post.title}
                                        className="overflow-hidden rounded-2xl bg-white shadow-sm"
                                    >
                                        <div
                                            className="aspect-[16/10] bg-cover bg-center"
                                            style={{
                                                backgroundImage: image
                                                    ? `linear-gradient(135deg, rgba(244,162,97,0.25), rgba(69,123,157,0.3)), url(${image})`
                                                    : 'linear-gradient(135deg, #F4A261, #457B9D)',
                                            }}
                                        />
                                        <div className="p-5">
                                            <p className="text-xs text-[#888]">{post.date}</p>
                                            <h3 className="mt-2 text-lg font-semibold leading-snug text-[#111]">
                                                {post.title}
                                            </h3>
                                            {post.excerpt ? (
                                                <p className="mt-2 text-sm text-[#666]">
                                                    {post.excerpt}
                                                </p>
                                            ) : null}
                                            {post.author ? (
                                                <p className="mt-3 text-xs text-[#888]">
                                                    {data.postedByPrefix} {post.author}
                                                </p>
                                            ) : null}
                                            <AgencyLink
                                                href={post.href || '#'}
                                                className="mt-4 inline-flex text-sm font-medium text-[#06403D]"
                                            >
                                                {data.readMoreLabel} →
                                            </AgencyLink>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
        )
    }

    return null
}

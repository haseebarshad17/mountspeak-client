'use client'

import { AgencyLink } from '@/components/links/AgencyLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { PopularTravelBlogsSection } from '@/services/agency/agency.types'

export function Blog({ data }: { data: PopularTravelBlogsSection }) {
    const variant = useTemplateVariant()
    const posts = data.posts ?? []

    if (variant !== 'classic') return null

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

'use client'

import { AgencyLink } from '@/components/links/AgencyLink'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { PlanPerfectTripSection } from '@/services/agency/agency.types'

export function Intro({ data }: { data: PlanPerfectTripSection }) {
    const variant = useTemplateVariant()
    const stats = data.stats?.slice(0, 4) ?? []
    const image = resolveThemeAssetUrl(data.image?.src)

    if (variant !== 'classic') return null

    return (
        <section className="bg-[#FCF8F3] py-16 md:py-24">
            <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div
                    className="aspect-[4/5] overflow-hidden rounded-[28px] bg-cover bg-center shadow-lg"
                    style={{
                        backgroundImage: image
                            ? `linear-gradient(135deg, rgba(42,157,143,0.35), rgba(69,123,157,0.45)), url(${image})`
                            : 'linear-gradient(135deg, #2A9D8F, #457B9D)',
                        backgroundBlendMode: 'overlay',
                    }}
                    role="img"
                    aria-label={data.image?.alt || data.title}
                />

                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#888]">
                        {data.eyebrow}
                    </p>
                    <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#111] md:text-4xl">
                        {data.title}
                    </h2>
                    <p className="mt-4 text-[0.98rem] leading-relaxed text-[#333]/70">
                        {data.paragraph}
                    </p>
                    <AgencyLink
                        href="/about-us"
                        className="mt-6 inline-flex rounded-full border border-[#111]/15 px-5 py-2.5 text-sm font-medium text-[#111]"
                    >
                        Learn more
                    </AgencyLink>

                    {stats.length > 0 ? (
                        <div className="mt-10 grid grid-cols-2 gap-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-2xl bg-white px-4 py-4 shadow-sm"
                                >
                                    <p className="text-2xl font-bold text-[#06403D]">
                                        {stat.value}
                                    </p>
                                    <p className="mt-1 text-xs leading-snug text-[#666]">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    )
}

'use client'

import { Temp3SectionHeader } from '@/components/home/Temp3SectionHeader'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import type { FaqPageContent as FaqContent } from '@/services/agency/agency.types'

export function FaqPageContent({ data }: { data: FaqContent }) {
    const variant = useTemplateVariant()
    const items = data.items ?? []

    if (variant === 'temp3') {
        return (
            <section className="t3-section t3-section-cream">
                <div className="t3-wrap mx-auto max-w-3xl">
                    <Temp3SectionHeader
                        eyebrow="FAQ"
                        title={data.title}
                        subtitle={data.subtitle}
                        tone="cream"
                    />
                    <div className="mt-2 space-y-4">
                        {items.map((item) => (
                            <article
                                key={item.question}
                                className="rounded-[14px] border border-t3-navy/10 bg-white p-5 shadow-[0_10px_30px_rgba(14,27,51,0.05)] md:p-6"
                            >
                                <h3 className="font-display text-lg font-semibold text-t3-navy">
                                    {item.question}
                                </h3>
                                <p className="mt-2 font-ui text-sm leading-relaxed text-t3-dim">
                                    {item.answer}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="section-spacing section-spacing-top bg-white">
            <div className="site-container mx-auto max-w-3xl">
                <div className="mb-8 text-center">
                    <p className="text-brand text-sm font-medium uppercase">FAQ</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111]">
                        {data.title}
                    </h2>
                    {data.subtitle ? (
                        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#666] md:text-base">
                            {data.subtitle}
                        </p>
                    ) : null}
                </div>
                <div className="space-y-4">
                    {items.map((item) => (
                        <article
                            key={item.question}
                            className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm md:p-6"
                        >
                            <h3 className="text-lg font-semibold text-[#111]">
                                {item.question}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-[#666]">
                                {item.answer}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

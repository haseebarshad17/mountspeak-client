'use client'

import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import type { LegalDocument } from '@/services/agency/agency.types'

export function LegalDocumentContent({ document }: { document: LegalDocument }) {
    const variant = useTemplateVariant()
    const sections = document.sections ?? []

    if (variant === 'temp3') {
        return (
            <section className="t3-section t3-section-cream">
                <div className="t3-wrap mx-auto max-w-3xl">
                    {document.lastUpdated ? (
                        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-t3-dim">
                            Last updated · {document.lastUpdated}
                        </p>
                    ) : null}
                    <div className="mt-8 space-y-8">
                        {sections.map((section) => (
                            <article key={section.heading}>
                                <h2 className="font-display text-xl font-semibold text-t3-navy">
                                    {section.heading}
                                </h2>
                                <p className="mt-3 font-ui text-sm leading-relaxed text-t3-dim md:text-base">
                                    {section.body}
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
                {document.lastUpdated ? (
                    <p className="text-sm text-[#888]">
                        Last updated · {document.lastUpdated}
                    </p>
                ) : null}
                <div className="mt-8 space-y-8">
                    {sections.map((section) => (
                        <article key={section.heading}>
                            <h2 className="text-xl font-semibold tracking-tight text-[#111]">
                                {section.heading}
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-[#555] md:text-base">
                                {section.body}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

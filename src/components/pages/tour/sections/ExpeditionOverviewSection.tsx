import React from 'react'
import Image from 'next/image'

import type { TourPage } from './tour-page.types'

type ExpeditionOverviewSectionProps = {
    page: TourPage
}

export function ExpeditionOverviewSection({ page }: ExpeditionOverviewSectionProps) {
    const { overviewSection, theme } = page

    return (
        <section
            id={overviewSection.id}
            style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
        >
            <div className="agency-container py-16 sm:py-20 lg:py-24">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
                    <div>
                        <h2 className="font-heading text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.5rem]">
                            {overviewSection.title}
                        </h2>
                        <p className="mt-5 max-w-xl text-base font-normal leading-relaxed text-neutral-600 lg:text-lg">
                            {overviewSection.description}
                        </p>

                        <dl className="mt-10 grid gap-8 border-t border-black/[0.08] pt-10 sm:grid-cols-2">
                            {overviewSection.statistics.map((stat) => (
                                <div key={stat.label}>
                                    <dt className="text-xs font-normal uppercase tracking-wider text-neutral-500">
                                        {stat.label}
                                    </dt>
                                    <dd className="mt-2 font-heading text-2xl font-semibold text-neutral-900">
                                        {stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-black/[0.08] bg-neutral-100 shadow-sm">
                        <div className="relative aspect-square w-full sm:aspect-[4/3] lg:aspect-square">
                            <Image
                                src={overviewSection.sideCard.image}
                                alt={overviewSection.sideCard.alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                            <span className="rounded-md bg-white px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-neutral-900 shadow-md">
                                {overviewSection.sideCard.title}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

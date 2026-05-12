import React from 'react'
import Image from 'next/image'
import { CircleCheck, CircleMinus, MapPin, Sunrise, type LucideIcon } from 'lucide-react'

import type { TourPage } from './tour-page.types'
import { Separator } from '@radix-ui/react-dropdown-menu'

const overviewColumnIcons: Record<string, LucideIcon> = {
    sunrise: Sunrise,
    'circle-check': CircleCheck,
    'circle-minus': CircleMinus,
}

type ExpeditionOverviewSectionProps = {
    page: TourPage
}

export function ExpeditionOverviewSection({ page }: ExpeditionOverviewSectionProps) {
    const { overviewSection, theme } = page
    const columns =
        'highlightColumns' in overviewSection
            ? overviewSection.highlightColumns
            : undefined

    return (
        <section
            id={overviewSection.id}
            className="border-t border-black/[0.06] py-16 sm:py-20 lg:py-24"
            style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
        >
            <div className="agency-container">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
                    <div>
                        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.5rem]">
                            {overviewSection.title}
                        </h2>
                        <p className="mt-5 max-w-xl text-lg font-normal leading-relaxed text-neutral-700">
                            {overviewSection.description}
                        </p>

                        <hr className="my-10 border-layout-separator" />
                        <dl className="mt-10 grid gap-8 sm:grid-cols-2">
                            {overviewSection.statistics.map((stat) => (
                                <div key={stat.label}>
                                    <dt className="text-base font-normal uppercase tracking-wider text-neutral-500">
                                        {stat.label}
                                    </dt>
                                    <dd className="mt-2 font-heading text-2xl font-semibold">
                                        {stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-neutral-100 shadow-sm">
                        <div className="relative aspect-square w-full sm:aspect-[4/3] lg:aspect-square">
                            <Image
                                src={overviewSection.sideCard.image}
                                alt={overviewSection.sideCard.alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>

                {columns && columns.length > 0 ? (
                    <div className="mt-16 grid gap-10 border-t border-black/[0.06] pt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                        {columns.map((col) => {
                            const Icon = overviewColumnIcons[col.icon] ?? MapPin
                            return (
                                <div key={col.title}>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="flex h-10 w-10 items-center justify-center rounded-full"
                                            style={{
                                                backgroundColor: `${theme.secondaryColor}18`,
                                                color: theme.secondaryColor,
                                            }}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <h3 className="font-heading text-lg font-semibold">
                                            {col.title}
                                        </h3>
                                    </div>
                                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-neutral-700">
                                        {col.items.map((line) => (
                                            <li key={line} className="flex gap-2">
                                                <span
                                                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-40"
                                                    style={{ color: theme.secondaryColor }}
                                                />
                                                <span>{line}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                ) : null}
            </div>
        </section>
    )
}

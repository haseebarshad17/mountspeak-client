'use client'

import { AgencyLink } from '@/components/links/AgencyLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { OurServicesSection } from '@/services/agency/agency.types'
import {
    Compass,
    Plane,
    Building2,
    MapPinned,
    Car,
    Camera,
    Ticket,
    Mountain,
} from 'lucide-react'

const FALLBACK_ICONS = [Compass, Plane, Building2, MapPinned, Car, Camera, Ticket, Mountain]

export function Services({ data }: { data: OurServicesSection }) {
    const variant = useTemplateVariant()
    const items = data.items ?? []

    if (variant === 'temp1') {
        return (
            <section className="section-spacing bg-white">
                <div className="site-container">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-brand text-sm font-medium uppercase">
                            {data.eyebrow}
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111] md:text-4xl">
                            {data.title}
                        </h2>
                    </div>

                    {items.length === 0 ? (
                        <div className="mt-10">
                            <EmptyState
                                title="Services coming soon"
                                description="Service items from the site theme will appear in this grid."
                            />
                        </div>
                    ) : (
                        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {items.map((item, i) => {
                                const Icon = FALLBACK_ICONS[i % FALLBACK_ICONS.length]
                                const iconSrc = resolveThemeAssetUrl(item.iconSrc)
                                return (
                                    <div
                                        key={`${item.title}-${i}`}
                                        className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="bg-brand-soft flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
                                            {iconSrc ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={iconSrc}
                                                    alt={item.iconAlt || item.title}
                                                    className="h-6 w-6 object-contain"
                                                />
                                            ) : (
                                                <Icon className="h-5 w-5" />
                                            )}
                                        </div>
                                        <p className="mt-4 text-base font-semibold leading-snug text-[#111]">
                                            {item.title}
                                        </p>
                                        {item.description ? (
                                            <p className="mt-2 text-sm leading-relaxed text-[#666]">
                                                {item.description}
                                            </p>
                                        ) : null}
                                    </div>
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
            <section className="px-4 py-16 md:px-6 md:py-20">
                <div
                    className="mx-auto rounded-[32px] px-6 py-12 text-black md:px-10 md:py-16"
                    style={{ backgroundColor: data.backgroundColor || '#06403D' }}
                >
                    <div className="site-container">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-[0.18em] text-black">
                                    {data.eyebrow}
                                </p>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                                    {data.title}
                                </h2>
                            </div>
                            {data.cta?.href ? (
                                <AgencyLink
                                    href={data.cta.href}
                                    className="rounded-full bg-black/85 px-5 py-2.5 text-sm font-medium text-white"
                                >
                                    {data.cta.label}
                                </AgencyLink>
                            ) : null}
                        </div>

                        {items.length === 0 ? (
                            <div className="mt-10">
                                <EmptyState
                                    className="border-white/20 bg-white/5 text-left"
                                    title="Services coming soon"
                                    description="Service items from the site theme will appear in this grid."
                                />
                            </div>
                        ) : (
                            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {items.map((item, i) => {
                                    const Icon = FALLBACK_ICONS[i % FALLBACK_ICONS.length]
                                    const iconSrc = resolveThemeAssetUrl(item.iconSrc)
                                    return (
                                        <div
                                            key={`${item.title}-${i}`}
                                            className="rounded-2xl bg-white/5 p-5 transition hover:bg-white/10 border border-black/10"
                                        >
                                            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white/30">
                                                {iconSrc ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={iconSrc}
                                                        alt={item.iconAlt || item.title}
                                                        className="h-6 w-6 object-contain"
                                                    />
                                                ) : (
                                                    <Icon className="h-5 w-5" />
                                                )}
                                            </div>
                                            <p className="mt-4 text-sm font-medium leading-snug">
                                                {item.title}
                                            </p>
                                            {item.description ? (
                                                <p className="mt-2 text-xs leading-relaxed text-black/65">
                                                    {item.description}
                                                </p>
                                            ) : null}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        )
    }

    return null
}

'use client'

import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AgencyLink } from '@/components/links/AgencyLink'
import { DateField } from '@/components/ui/DateField'
import { Select } from '@/components/ui/Select'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import type { HeroSection } from '@/services/agency/agency.types'
import type { AgencySpecializationCapabilities } from '@/services/specialization/specialization.types'
import type { SpecializationKind } from '@/services/specialization/specialization.types'
import { cn } from '@/lib/utils/cn'

const CARD_STYLES = [
    'absolute right-0 top-6 h-[78%] w-[72%] rotate-6',
    'absolute left-2 top-0 h-[82%] w-[70%] -rotate-3',
    'absolute bottom-0 left-10 h-[55%] w-[58%] rotate-2',
] as const

const FALLBACK_GRADIENTS = [
    'bg-gradient-to-br from-[#F4A261] via-[#E76F51] to-[#9B5DE5] opacity-90',
    'bg-gradient-to-br from-[#2A9D8F] via-[#457B9D] to-[#1D3557]',
    'bg-gradient-to-tr from-[#E9C46A] to-[#F4A261] opacity-95',
] as const

function HeroImageStack({ images }: { images: string[] }) {
    return (
        <div className="relative mx-auto h-[280px] w-full max-w-md md:h-[380px]">
            {CARD_STYLES.map((position, index) => {
                const src = images[index]
                return (
                    <div
                        key={position}
                        className={cn(
                            position,
                            'overflow-hidden rounded-[28px] shadow-xl',
                            !src && FALLBACK_GRADIENTS[index]
                        )}
                    >
                        {src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={src}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : null}
                    </div>
                )
            })}
        </div>
    )
}

function withHost(href: string, host: string | null) {
    if (!host) return href
    const [path, query = ''] = href.split('?')
    const params = new URLSearchParams(query)
    if (!params.has('host')) params.set('host', host)
    const q = params.toString()
    return q ? `${path}?${q}` : path
}

export function Hero({
    data,
    capabilities,
    cardImages = [],
    destinationsByKind,
    previewHost = null,
}: {
    data: HeroSection
    capabilities: AgencySpecializationCapabilities
    cardImages?: string[]
    destinationsByKind: Record<SpecializationKind, string[]>
    previewHost?: string | null
}) {
    const variant = useTemplateVariant()
    const router = useRouter()
    const filters = data.searchFilters
    const [activeKind, setActiveKind] = useState(capabilities.defaultKind)
    const [destination, setDestination] = useState('')
    const [departureDate, setDepartureDate] = useState('')
    const [travelers, setTravelers] = useState('2')

    const destinationOptions = useMemo(() => {
        const values = destinationsByKind[activeKind] ?? []
        return values.map((value) => ({ value, label: value }))
    }, [activeKind, destinationsByKind])

    const destinationLabel =
        activeKind === 'international'
            ? 'Country'
            : activeKind === 'packages'
              ? 'Holy city'
              : 'City'

    function onSearch(e: React.FormEvent) {
        e.preventDefault()
        const params = new URLSearchParams()
        params.set('kind', activeKind)
        if (destination) params.set('destination', destination)
        if (departureDate) params.set('date', departureDate)
        if (travelers) params.set('travelers', travelers)
        if (previewHost) params.set('host', previewHost)
        router.push(`/search?${params.toString()}`)
    }

    if (variant === 'classic') {
        return (
            <section className="relative overflow-hidden bg-[#FCF8F3] pb-8 pt-8 md:pb-10 md:pt-14">
                <div className="site-container grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                        <h1 className="max-w-xl text-[2.35rem] font-bold leading-[1.08] tracking-tight text-[#111] md:text-5xl lg:text-[3.4rem]">
                            {data.title}
                        </h1>
                        <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-[#333]/70 md:text-base">
                            {data.paragraph}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <AgencyLink
                                href={withHost('/search', previewHost)}
                                className="rounded-full bg-[#111] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#333]"
                            >
                                Start exploring
                            </AgencyLink>
                            <AgencyLink
                                href="/about-us"
                                className="rounded-full border border-[#111]/15 bg-white/60 px-6 py-3 text-sm font-medium text-[#111]"
                            >
                                How it works
                            </AgencyLink>
                        </div>
                    </div>

                    <HeroImageStack images={cardImages} />
                </div>

                <div className="relative z-10 mx-auto mt-10 max-w-5xl rounded-2xl border border-black/5 bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.08)] md:mt-14 md:p-4">
                    {capabilities.showTabs ? (
                        <div className="mb-3 flex flex-wrap gap-2">
                            {capabilities.tabs.map((tab) => (
                                <button
                                    key={tab.kind}
                                    type="button"
                                    onClick={() => {
                                        setActiveKind(tab.kind)
                                        setDestination('')
                                    }}
                                    className={cn(
                                        'rounded-full px-4 py-1.5 text-xs font-medium',
                                        activeKind === tab.kind
                                            ? 'bg-[#111] text-white'
                                            : 'bg-[#F2EEE8] text-[#333]'
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    ) : null}
                    <form
                        className="grid gap-3 md:grid-cols-[1.2fr_1.2fr_0.9fr_auto]"
                        onSubmit={onSearch}
                    >
                        <label className="block">
                            <span className="mb-1.5 block px-1 text-[11px] font-medium uppercase tracking-wide text-[#666]">
                                {destinationLabel}
                            </span>
                            <Select
                                value={destination}
                                onChange={setDestination}
                                options={destinationOptions}
                                placeholder={
                                    activeKind === 'international'
                                        ? 'Select country'
                                        : filters.toPlaceholder || 'Where to?'
                                }
                            />
                        </label>
                        <label className="block">
                            <span className="mb-1.5 block px-1 text-[11px] font-medium uppercase tracking-wide text-[#666]">
                                {filters.startDateLabel || 'Departure'}
                            </span>
                            <DateField
                                value={departureDate}
                                onChange={setDepartureDate}
                                placeholder={filters.datePlaceholder || 'Departure date'}
                            />
                        </label>
                        <label className="block">
                            <span className="mb-1.5 block px-1 text-[11px] font-medium uppercase tracking-wide text-[#666]">
                                Travelers
                            </span>
                            <input
                                type="number"
                                min={1}
                                max={50}
                                inputMode="numeric"
                                value={travelers}
                                onChange={(e) => setTravelers(e.target.value)}
                                className="w-full rounded-xl bg-[#F7F3EE] px-4 py-3 text-sm outline-none"
                                placeholder="2"
                            />
                        </label>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111] px-5 py-3 text-sm font-medium text-white md:min-w-[120px]"
                            >
                                <Search className="h-4 w-4" />
                                {filters.searchButtonLabel}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        )
    }

    return null
}

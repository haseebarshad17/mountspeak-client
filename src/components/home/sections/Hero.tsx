'use client'

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from 'react'
import { useRouter } from 'next/navigation'
import FacebookIcon from '@/assets/svg/social/facebook'
import InstagramIcon from '@/assets/svg/social/instagram'
import TwitterIcon from '@/assets/svg/social/twitter'
import LinkedinIcon from '@/assets/svg/social/linkedin'
import { AgencyLink } from '@/components/links/AgencyLink'
import {
    HeroSearchFilters,
    type HeroFilterValues,
} from '@/components/home/sections/HeroSearchFilters'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { resolveThemeAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { HeroSection } from '@/services/agency/agency.types'
import type {
    AgencySpecializationCapabilities,
    SpecializationKind,
} from '@/services/specialization/specialization.types'
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

const HERO_TAB_LABEL: Record<SpecializationKind, string> = {
    tours: 'Tour',
    international: 'International',
    packages: 'Umrah',
}

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

function placeOptions(values: string[]) {
    return values.map((value) => ({ value, label: value }))
}

function uniquePlaces(
    destinationsByKind: Record<SpecializationKind, string[]>
) {
    const set = new Set<string>()
    for (const list of Object.values(destinationsByKind)) {
        for (const item of list) {
            if (item?.trim()) set.add(item.trim())
        }
    }
    return [...set]
}

export function Hero({
    data,
    capabilities,
    cardImages = [],
    destinationsByKind,
    previewHost = null,
    socialLinks,
}: {
    data: HeroSection
    capabilities: AgencySpecializationCapabilities
    cardImages?: string[]
    destinationsByKind: Record<SpecializationKind, string[]>
    previewHost?: string | null
    socialLinks?: {
        facebook?: string | null
        twitter?: string | null
        instagram?: string | null
        linkedin?: string | null
    }
}) {
    const variant = useTemplateVariant()
    const router = useRouter()
    const filters = data.searchFilters

    const [activeKind, setActiveKind] = useState<SpecializationKind>(
        capabilities.defaultKind
    )
    const [values, setValues] = useState<HeroFilterValues>({
        category: '',
        from: '',
        to: '',
        startDate: '',
        endDate: '',
    })

    const slides = useMemo(() => {
        const raw = [
            ...(data.backgroundImages ?? []),
            data.backgroundImage,
            ...cardImages,
        ]
            .map((src) => resolveThemeAssetUrl(src) || src)
            .filter(Boolean) as string[]
        return [...new Set(raw)]
    }, [cardImages, data.backgroundImage, data.backgroundImages])

    const viewportRef = useRef<HTMLDivElement>(null)
    const [viewportWidth, setViewportWidth] = useState(0)
    const [slideIndex, setSlideIndex] = useState(0)
    const [dragOffset, setDragOffset] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const dragStartX = useRef(0)
    const autoplayPaused = useRef(false)

    const goTo = useCallback(
        (next: number) => {
            if (slides.length === 0) return
            const len = slides.length
            setSlideIndex(((next % len) + len) % len)
        },
        [slides.length]
    )

    useEffect(() => {
        const el = viewportRef.current
        if (!el) return
        const update = () => setViewportWidth(el.clientWidth)
        update()
        const ro = new ResizeObserver(update)
        ro.observe(el)
        return () => ro.disconnect()
    }, [variant])

    useEffect(() => {
        if (slides.length < 2) return
        const id = window.setInterval(() => {
            if (autoplayPaused.current) return
            setSlideIndex((i) => (i + 1) % slides.length)
        }, 7000)
        return () => window.clearInterval(id)
    }, [slides.length])

    useEffect(() => {
        setActiveKind(capabilities.defaultKind)
    }, [capabilities.defaultKind])

    const kindPlaces = useMemo(
        () => placeOptions(destinationsByKind[activeKind] ?? []),
        [activeKind, destinationsByKind]
    )

    const allPlaces = useMemo(
        () => placeOptions(uniquePlaces(destinationsByKind)),
        [destinationsByKind]
    )

    const socialItems = useMemo(() => {
        const items = [
            socialLinks?.facebook
                ? { label: 'Facebook', href: socialLinks.facebook, Icon: FacebookIcon }
                : null,
            socialLinks?.twitter
                ? { label: 'Twitter', href: socialLinks.twitter, Icon: TwitterIcon }
                : null,
            socialLinks?.instagram
                ? { label: 'Instagram', href: socialLinks.instagram, Icon: InstagramIcon }
                : null,
            socialLinks?.linkedin
                ? { label: 'LinkedIn', href: socialLinks.linkedin, Icon: LinkedinIcon }
                : null,
        ].filter(Boolean) as Array<{
            label: string
            href: string
            Icon: typeof FacebookIcon
        }>
        return items
    }, [socialLinks])

    const heroTabs = useMemo(
        () =>
            capabilities.tabs.map((tab) => ({
                kind: tab.kind,
                label: HERO_TAB_LABEL[tab.kind] || tab.label,
            })),
        [capabilities.tabs]
    )

    function patch(partial: Partial<HeroFilterValues>) {
        setValues((prev) => ({ ...prev, ...partial }))
    }

    function onSearch(e: React.FormEvent) {
        e.preventDefault()
        const params = new URLSearchParams()
        params.set('kind', activeKind)
        if (values.category) params.set('category', values.category)
        if (values.from) params.set('from', values.from)
        if (values.to) params.set('destination', values.to)
        if (values.startDate) params.set('date', values.startDate)
        if (values.endDate) params.set('endDate', values.endDate)
        if (previewHost) params.set('host', previewHost)
        router.push(`/search?${params.toString()}`)
    }

    const filterHandlers = {
        onCategoryChange: (category: string) => patch({ category }),
        onFromChange: (from: string) => patch({ from }),
        onToChange: (to: string) => patch({ to }),
        onStartDateChange: (startDate: string) => patch({ startDate }),
        onEndDateChange: (endDate: string) => patch({ endDate }),
        onSubmit: onSearch,
    }

    const filterLabels = {
        fromPlaceholder: filters.fromPlaceholder || 'From',
        toPlaceholder: filters.toPlaceholder || 'To',
        startDate: filters.startDateLabel || 'Start date',
        endDate: filters.endDateLabel || 'End date',
        startPlaceholder: filters.datePlaceholder || 'Start date',
        endPlaceholder: 'End date',
        search: 'Search',
    }

    function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
        if (slides.length < 2) return
        if (
            (event.target as HTMLElement).closest(
                'a,button,input,label,[role="combobox"],[data-radix-popper-content-wrapper]'
            )
        ) {
            return
        }
        event.preventDefault()
        autoplayPaused.current = true
        setIsDragging(true)
        dragStartX.current = event.clientX
        setDragOffset(0)
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
        if (!isDragging) return
        setDragOffset(event.clientX - dragStartX.current)
    }

    function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
        if (!isDragging) return
        const width = viewportWidth || event.currentTarget.clientWidth || 1
        const threshold = Math.max(width * 0.12, 48)
        const delta = event.clientX - dragStartX.current
        setIsDragging(false)
        setDragOffset(0)
        if (delta <= -threshold) goTo(slideIndex + 1)
        else if (delta >= threshold) goTo(slideIndex - 1)
        window.setTimeout(() => {
            autoplayPaused.current = false
        }, 500)
        try {
            event.currentTarget.releasePointerCapture(event.pointerId)
        } catch {
            /* already released */
        }
    }

    /* ── Template 1 (Classic / default): full-bleed slider hero ── */
    if (variant === 'temp1') {
        const trackX = -slideIndex * viewportWidth + dragOffset

        return (
            <div className='p-3 sm:p-5 pb-0 sm:pb-0'>
                <section
                    className={cn(
                        'relative overflow-hidden bg-[#0B2E2C] text-white rounded-2xl',
                        isDragging && 'select-none'
                    )}
                >
                    <div
                        ref={viewportRef}
                        className={cn(
                            'absolute inset-0 z-0 overflow-hidden',
                            slides.length > 1 && 'cursor-grab active:cursor-grabbing'
                        )}
                        style={{ touchAction: 'pan-y' }}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={endDrag}
                        onPointerCancel={endDrag}
                    >
                        {slides.length > 0 ? (
                            <div
                                className="flex h-full select-none"
                                style={{
                                    width: viewportWidth
                                        ? viewportWidth * slides.length
                                        : '100%',
                                    transform: `translate3d(${trackX}px, 0, 0)`,
                                    transition: isDragging
                                        ? 'none'
                                        : 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)',
                                }}
                            >
                                {slides.map((src) => (
                                    <div
                                        key={src}
                                        className="relative h-full shrink-0 select-none"
                                        style={{
                                            width: viewportWidth || '100%',
                                        }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={src}
                                            alt=""
                                            className="pointer-events-none h-full w-full object-cover select-none"
                                            draggable={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full w-full bg-gradient-to-br from-[#0B6E6A] via-[#0B3D3A] to-[#071E1C]" />
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
                    </div>

                    {socialItems.length > 0 ? (
                        <div className="pointer-events-auto absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
                            {socialItems.map(({ label, href, Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    ) : null}

                    {/* Overlay is pointer-events-none so drag hits the slider; chrome re-enables clicks */}
                    <div className="pointer-events-none relative z-10 flex flex-col justify-end py-8">
                        <div className="site-container w-full min-w-0">
                            <div className="select-none text-center pb-8 sm:pb-12 pt-36 md:pb-20 md:pt-48">
                                <h1 className="mx-auto max-w-[320px] md:max-w-3xl text-[2.2rem] font-bold leading-[1.12] tracking-tight md:text-5xl lg:text-[3.35rem]">
                                    {data.title}
                                </h1>
                                <p className="mx-auto mt-3 max-w-md sm:max-w-lg md:max-w-xl text-base sm:text-lg leading-relaxed text-white/80 md:mt-4">
                                    {data.paragraph}
                                </p>
                            </div>

                            <div className="pointer-events-auto mt-6 w-full min-w-0 md:mt-8">
                                {heroTabs.length > 0 ? (
                                    <div className="mb-3 flex flex-wrap justify-center gap-2">
                                        {heroTabs.map((tab) => (
                                            <button
                                                key={tab.kind}
                                                type="button"
                                                onClick={() => {
                                                    setActiveKind(tab.kind)
                                                    setValues((prev) => ({
                                                        ...prev,
                                                        from: '',
                                                        to: '',
                                                    }))
                                                }}
                                                className={cn(
                                                    'rounded-full px-4 py-1.5 text-sm font-medium transition',
                                                    activeKind === tab.kind
                                                        ? 'bg-white text-[#0B3D3A]'
                                                        : 'bg-white/15 text-white hover:bg-white/25'
                                                )}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                ) : null}

                                <HeroSearchFilters
                                    values={values}
                                    handlers={filterHandlers}
                                    fromOptions={
                                        kindPlaces.length ? kindPlaces : allPlaces
                                    }
                                    toOptions={
                                        kindPlaces.length ? kindPlaces : allPlaces
                                    }
                                    labels={filterLabels}
                                    appearance="temp1"
                                />

                                {slides.length > 1 ? (
                                    <div className="mt-5 flex items-center justify-center gap-2">
                                        {slides.map((src, i) => (
                                            <button
                                                key={src}
                                                type="button"
                                                aria-label={`Go to slide ${i + 1}`}
                                                aria-current={i === slideIndex}
                                                onClick={() => {
                                                    autoplayPaused.current = true
                                                    goTo(i)
                                                    window.setTimeout(() => {
                                                        autoplayPaused.current = false
                                                    }, 800)
                                                }}
                                                className={cn(
                                                    'h-2.5 rounded-full transition-all',
                                                    i === slideIndex
                                                        ? 'w-7 bg-white'
                                                        : 'w-2.5 bg-white/45 hover:bg-white/75'
                                                )}
                                            />
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    /* ── Template 2 (Studio): cream split layout ── */
    if (variant === 'temp2') {
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
                                href={
                                    previewHost
                                        ? `/search?host=${encodeURIComponent(previewHost)}`
                                        : '/search'
                                }
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
                    {heroTabs.length > 1 ? (
                        <div className="mb-3 flex flex-wrap gap-2">
                            {heroTabs.map((tab) => (
                                <button
                                    key={tab.kind}
                                    type="button"
                                    onClick={() => {
                                        setActiveKind(tab.kind)
                                        setValues((prev) => ({
                                            ...prev,
                                            from: '',
                                            to: '',
                                        }))
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
                    <HeroSearchFilters
                        values={values}
                        handlers={filterHandlers}
                        fromOptions={kindPlaces.length ? kindPlaces : allPlaces}
                        toOptions={kindPlaces.length ? kindPlaces : allPlaces}
                        labels={filterLabels}
                        appearance="temp2"
                    />
                </div>
            </section>
        )
    }

    return null
}

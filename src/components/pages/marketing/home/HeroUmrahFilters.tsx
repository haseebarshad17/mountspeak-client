'use client'

import FilterDropdown from '@/components/generic/FilterDropdown'
import { Button } from '@/components/ui/button'
import { useTemplateStyles } from '@/components/providers/TemplateStylesProvider'
import { cn } from '@/lib/utils/clsxUtils'
import { usePreviewRouter } from '@/hooks/useAgencyPreviewBase'
import { buildUmrahSearchPath, type UmrahSearchFilters } from '@/services/tours/tours.umrah-search.utils'
import type { ListingKind } from '@/lib/homepage/specialization'
import { Clock, Loader2, Package, Search, Users } from 'lucide-react'
import { useEffect, useMemo, useState, useTransition } from 'react'

import {
    DEFAULT_UMRAH_HERO_SEARCH,
    UMRAH_PACKAGE_DURATIONS,
    UMRAH_PACKAGE_TYPES,
    UMRAH_PASSENGER_OPTIONS,
} from '@/components/pages/marketing/home/hero-umrah-search.defaults'
import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE } from '@/data/homepage'

type HeroUmrahFiltersProps = {
    initialValues?: UmrahSearchFilters
    listingType?: Exclude<ListingKind, 'tour'>
}

function buildHeroTriggerButtonClass(fieldRadius: string) {
    return cn(
        '!justify-start flex !h-12 !w-full min-w-0 items-center gap-2 overflow-hidden px-3 !text-xs !font-medium !normal-case !tracking-normal',
        'xs:gap-2.5 xs:px-4 xs:!text-sm',
        'bg-neutral-50 text-neutral-700 transition hover:bg-neutral-100 text-left border border-layout-separator',
        'xl:border-0 xl:bg-transparent xl:px-4 xl:hover:bg-[#F8FAFB] xl:!h-full',
        fieldRadius,
    )
}

export default function HeroUmrahFilters({
    initialValues,
    listingType = 'umrah',
}: HeroUmrahFiltersProps) {
    const router = usePreviewRouter()
    const templateStyles = useTemplateStyles()
    const heroFilters = templateStyles.pages.home.heroFilters
    const heroTriggerButtonClass = buildHeroTriggerButtonClass(heroFilters.field)
    const [isSearching, startSearchTransition] = useTransition()
    const [duration, setDuration] = useState(initialValues?.duration ?? '')
    const [passengers, setPassengers] = useState(initialValues?.passengers ?? '')
    const [packageType, setPackageType] = useState(initialValues?.packageType ?? '')
    const [open, setOpen] = useState<string | null>(null)

    useEffect(() => {
        setDuration(initialValues?.duration ?? '')
        setPassengers(initialValues?.passengers ?? '')
        setPackageType(initialValues?.packageType ?? '')
    }, [initialValues?.duration, initialValues?.passengers, initialValues?.packageType])

    const labels = DEFAULT_UMRAH_HERO_SEARCH

    const durationOptions = useMemo(
        () => UMRAH_PACKAGE_DURATIONS.map((option) => ({ value: option, label: option })),
        [],
    )
    const passengerOptions = useMemo(
        () => UMRAH_PASSENGER_OPTIONS.map((option) => ({ value: option, label: option })),
        [],
    )
    const packageTypeOptions = useMemo(
        () => UMRAH_PACKAGE_TYPES.map((option) => ({ value: option, label: option })),
        [],
    )

    const handleSearch = () => {
        startSearchTransition(() => {
            router.push(buildUmrahSearchPath({ duration, passengers, packageType }, listingType))
        })
    }

    return (
        <form
            className={cn(
                'w-full max-w-full min-w-0 overflow-hidden border border-neutral-200 bg-white p-2 shadow-md xs:p-2.5 sm:p-3 xl:max-w-[867px] xl:border-[#D6D9DC] xl:p-0',
                heroFilters.form,
            )}
            onSubmit={(event) => {
                event.preventDefault()
                handleSearch()
            }}
        >
            <div
                className={cn(
                    'grid min-w-0 grid-cols-1 gap-2',
                    'xs:grid-cols-2',
                    'xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(140px,170px)] xl:h-12 xl:items-stretch xl:gap-0',
                )}
            >
                <div className='min-w-0 w-full'>
                    <FilterDropdown
                        options={durationOptions}
                        value={duration}
                        onChange={(value) => setDuration(String(value))}
                        placeholder={labels.durationPlaceholder}
                        triggerIcon={Clock}
                        theme='slate'
                        open={open === 'duration'}
                        onOpenChange={(isOpen) => setOpen(isOpen ? 'duration' : null)}
                        classNames={{
                            triggerButton: cn(heroTriggerButtonClass, 'xl:border-r xl:border-[#D6D9DC]'),
                        }}
                    />
                </div>

                <div className='min-w-0 w-full'>
                    <FilterDropdown
                        options={passengerOptions}
                        value={passengers}
                        onChange={(value) => setPassengers(String(value))}
                        placeholder={labels.passengersPlaceholder}
                        triggerIcon={Users}
                        theme='slate'
                        open={open === 'passengers'}
                        onOpenChange={(isOpen) => setOpen(isOpen ? 'passengers' : null)}
                        classNames={{
                            triggerButton: cn(heroTriggerButtonClass, 'xl:border-r xl:border-[#D6D9DC]'),
                        }}
                    />
                </div>

                <div className='min-w-0 w-full xs:col-span-2 xl:col-span-1'>
                    <FilterDropdown
                        options={packageTypeOptions}
                        value={packageType}
                        onChange={(value) => setPackageType(String(value))}
                        placeholder={labels.packageTypePlaceholder}
                        triggerIcon={Package}
                        theme='slate'
                        open={open === 'packageType'}
                        onOpenChange={(isOpen) => setOpen(isOpen ? 'packageType' : null)}
                        classNames={{
                            triggerButton: cn(heroTriggerButtonClass, 'xl:border-r xl:border-[#D6D9DC]'),
                        }}
                    />
                </div>

                <div className='min-w-0 w-full xs:col-span-2 xl:col-span-1'>
                    <Button
                        type='submit'
                        size='max'
                        disabled={isSearching}
                        aria-busy={isSearching}
                        style={HP_THEME_BTN_STYLE}
                        className={cn(
                            HP_THEME_BTN_CLASS,
                            '!h-12 w-full min-w-0 !font-medium !normal-case !tracking-normal !text-sm xl:!h-full xl:!px-4',
                            heroFilters.searchButton,
                        )}
                    >
                        {isSearching ? (
                            <Loader2 className='h-4 w-4 shrink-0 animate-spin' aria-hidden />
                        ) : (
                            <>
                                <span className='truncate'>{labels.searchButtonLabel}</span>
                                <Search className='ml-2 h-4 w-4 shrink-0' aria-hidden />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}

'use client'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils/clsxUtils'
import { usePreviewRouter } from '@/hooks/useAgencyPreviewBase'
import { buildUmrahSearchPath, type UmrahSearchFilters } from '@/services/tours/tours.umrah-search.utils'
import { Clock, Package, Search, Users } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'

import {
    DEFAULT_UMRAH_HERO_SEARCH,
    UMRAH_PACKAGE_DURATIONS,
    UMRAH_PACKAGE_TYPES,
    UMRAH_PASSENGER_OPTIONS,
} from '@/components/pages/marketing/home/hero-umrah-search.defaults'
import { HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE } from '@/data/homepage'

type HeroUmrahFiltersProps = {
    initialValues?: UmrahSearchFilters
}

function OptionList({
    options,
    selected,
    onSelect,
    itemClassName,
}: {
    options: readonly string[]
    selected: string
    onSelect: (value: string) => void
    itemClassName: string
}) {
    return (
        <div className='flex max-h-60 flex-col gap-0.5 overflow-y-auto'>
            {options.map((option) => (
                <Button
                    key={option}
                    type='button'
                    variant='ghost'
                    size='max'
                    className={cn(itemClassName, selected === option && 'bg-neutral-100')}
                    onClick={() => onSelect(option)}
                >
                    {option}
                </Button>
            ))}
        </div>
    )
}

export default function HeroUmrahFilters({ initialValues }: HeroUmrahFiltersProps) {
    const router = usePreviewRouter()
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

    const triggerCls = cn(
        '!justify-start flex !h-12 !w-full min-w-0 flex-col items-start gap-0 overflow-hidden px-4 py-2 !text-sm !font-medium !normal-case !tracking-normal xl:!h-full',
        'bg-neutral-50 text-neutral-700 transition hover:bg-neutral-100 text-left rounded-md border border-layout-separator',
        'xl:rounded-none xl:border-0 xl:bg-transparent xl:px-5 xl:py-2 xl:hover:bg-[#F8FAFB]',
    )

    const popCls = cn(
        'w-[min(92vw,22rem)] rounded-xl border bg-white p-2 shadow-xl',
        'border-neutral-200 flex flex-col',
    )

    const dropdownItemCls =
        '!flex !h-auto !w-full min-w-0 justify-start rounded-md !px-3 py-2.5 text-left sm:!flex sm:!w-full'

    const handleSearch = () => {
        startSearchTransition(() => {
            router.push(buildUmrahSearchPath({ duration, passengers, packageType }))
        })
    }

    return (
        <form
            className='overflow-hidden rounded-lg border border-neutral-200 bg-white p-2 shadow-md sm:p-3 xl:mx-auto xl:max-w-[867px] xl:rounded-[6px] xl:border-[#D6D9DC] xl:p-0'
            onSubmit={(event) => {
                event.preventDefault()
                handleSearch()
            }}
        >
            <div className='grid grid-cols-1 gap-1 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_170px] xl:h-12 xl:items-stretch xl:gap-0'>
                <Popover open={open === 'duration'} onOpenChange={(v) => setOpen(v ? 'duration' : null)}>
                    <PopoverTrigger asChild>
                        <Button
                            type='button'
                            variant='ghost'
                            size='max'
                            className={cn(triggerCls, 'xl:border-r xl:border-[#D6D9DC]')}
                        >
                            <span className='flex w-full min-w-0 items-center gap-2'>
                                <Clock className='h-4 w-4 shrink-0 text-neutral-500' />
                                <span className='min-w-0 flex-1 text-left'>
                                    <span className='block truncate text-[11px] font-normal text-neutral-500'>
                                        {labels.durationLabel}
                                    </span>
                                    <span className='block truncate text-sm font-medium text-[#0B1F3A]'>
                                        {duration || labels.durationPlaceholder}
                                    </span>
                                </span>
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={popCls} align='start'>
                        <OptionList
                            options={UMRAH_PACKAGE_DURATIONS}
                            selected={duration}
                            itemClassName={dropdownItemCls}
                            onSelect={(value) => {
                                setDuration(value)
                                setOpen(null)
                            }}
                        />
                    </PopoverContent>
                </Popover>

                <Popover open={open === 'passengers'} onOpenChange={(v) => setOpen(v ? 'passengers' : null)}>
                    <PopoverTrigger asChild>
                        <Button
                            type='button'
                            variant='ghost'
                            size='max'
                            className={cn(triggerCls, 'xl:border-r xl:border-[#D6D9DC]')}
                        >
                            <span className='flex w-full min-w-0 items-center gap-2'>
                                <Users className='h-4 w-4 shrink-0 text-neutral-500' />
                                <span className='min-w-0 flex-1 text-left'>
                                    <span className='block truncate text-[11px] font-normal text-neutral-500'>
                                        {labels.passengersLabel}
                                    </span>
                                    <span className='block truncate text-sm font-medium text-[#0B1F3A]'>
                                        {passengers || labels.passengersPlaceholder}
                                    </span>
                                </span>
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={popCls} align='start'>
                        <OptionList
                            options={UMRAH_PASSENGER_OPTIONS}
                            selected={passengers}
                            itemClassName={dropdownItemCls}
                            onSelect={(value) => {
                                setPassengers(value)
                                setOpen(null)
                            }}
                        />
                    </PopoverContent>
                </Popover>

                <Popover open={open === 'packageType'} onOpenChange={(v) => setOpen(v ? 'packageType' : null)}>
                    <PopoverTrigger asChild>
                        <Button
                            type='button'
                            variant='ghost'
                            size='max'
                            className={cn(triggerCls, 'xl:border-r xl:border-[#D6D9DC]')}
                        >
                            <span className='flex w-full min-w-0 items-center gap-2'>
                                <Package className='h-4 w-4 shrink-0 text-neutral-500' />
                                <span className='min-w-0 flex-1 text-left'>
                                    <span className='block truncate text-[11px] font-normal text-neutral-500'>
                                        {labels.packageTypeLabel}
                                    </span>
                                    <span className='block truncate text-sm font-medium text-[#0B1F3A]'>
                                        {packageType || labels.packageTypePlaceholder}
                                    </span>
                                </span>
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={popCls} align='start'>
                        <OptionList
                            options={UMRAH_PACKAGE_TYPES}
                            selected={packageType}
                            itemClassName={dropdownItemCls}
                            onSelect={(value) => {
                                setPackageType(value)
                                setOpen(null)
                            }}
                        />
                    </PopoverContent>
                </Popover>

                <div className='xl:col-span-1 xl:flex xl:h-full xl:px-[6px]'>
                    <Button
                        type='submit'
                        size='max'
                        loading={isSearching}
                        loadingText={labels.searchingButtonLabel}
                        style={HP_THEME_BTN_STYLE}
                        className={cn(
                            HP_THEME_BTN_CLASS,
                            '!h-12 w-full !rounded-xl !font-medium !normal-case !tracking-normal xl:!h-full xl:!w-full xl:!rounded-[3px] xl:!px-4 xl:!text-sm',
                        )}
                    >
                        {labels.searchButtonLabel}
                        {!isSearching ? <Search className='ml-2 h-4 w-4 shrink-0' /> : null}
                    </Button>
                </div>
            </div>
        </form>
    )
}

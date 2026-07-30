'use client'

import { MapPin, Navigation, Search, Users } from 'lucide-react'
import { DateField } from '@/components/ui/DateField'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/utils/cn'

export const HERO_CATEGORY_OPTIONS = [
    { value: 'honeymoon', label: 'Honeymoon' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'family', label: 'Family' },
    { value: 'religious', label: 'Religious' },
    { value: 'beach', label: 'Beach' },
    { value: 'business', label: 'Business' },
    { value: 'cultural', label: 'Cultural' },
] as const

export type HeroFilterValues = {
    category: string
    from: string
    to: string
    startDate: string
    endDate: string
}

export type HeroFilterHandlers = {
    onCategoryChange: (value: string) => void
    onFromChange: (value: string) => void
    onToChange: (value: string) => void
    onStartDateChange: (value: string) => void
    onEndDateChange: (value: string) => void
    onSubmit: (event: React.FormEvent) => void
}

type HeroSearchFiltersProps = {
    values: HeroFilterValues
    handlers: HeroFilterHandlers
    fromOptions: Array<{ value: string; label: string }>
    toOptions: Array<{ value: string; label: string }>
    labels?: {
        category?: string
        from?: string
        to?: string
        startDate?: string
        endDate?: string
        search?: string
        fromPlaceholder?: string
        toPlaceholder?: string
        startPlaceholder?: string
        endPlaceholder?: string
    }
    appearance?: 'temp1' | 'temp2'
    className?: string
}

export function HeroSearchFilters({
    values,
    handlers,
    fromOptions,
    toOptions,
    labels = {},
    appearance = 'temp1',
    className,
}: HeroSearchFiltersProps) {
    if (appearance === 'temp1') {
        return (
            <form
                className={cn(
                    'flex w-full min-w-0 flex-col overflow-hidden rounded-xl bg-white text-[#111] shadow-[0_18px_50px_rgba(0,0,0,0.22)] lg:flex-row lg:items-stretch',
                    className
                )}
                onSubmit={handlers.onSubmit}
            >
                <div className="grid min-w-0 flex-1 grid-cols-1 divide-y divide-[#E6E8EB] sm:grid-cols-2 sm:divide-y-0 md:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-[#E6E8EB]">
                    <div className="min-w-0 sm:border-b sm:border-[#E6E8EB] md:border-b lg:border-b-0">
                        <Select
                            variant="bare"
                            value={values.category}
                            onChange={handlers.onCategoryChange}
                            options={[...HERO_CATEGORY_OPTIONS]}
                            placeholder="All categories"
                            leadingIcon={<Users className="h-4 w-4" strokeWidth={1.75} />}
                        />
                    </div>
                    <div className="min-w-0 sm:border-b sm:border-l sm:border-[#E6E8EB] md:border-b lg:border-b-0 lg:border-l-0">
                        <Select
                            variant="bare"
                            value={values.from}
                            onChange={handlers.onFromChange}
                            options={fromOptions}
                            placeholder={labels.fromPlaceholder || 'From'}
                            leadingIcon={<MapPin className="h-4 w-4" strokeWidth={1.75} />}
                        />
                    </div>
                    <div className="min-w-0 sm:border-b sm:border-[#E6E8EB] md:border-b-0 md:border-l lg:border-l-0">
                        <Select
                            variant="bare"
                            value={values.to}
                            onChange={handlers.onToChange}
                            options={toOptions}
                            placeholder={labels.toPlaceholder || 'To'}
                            leadingIcon={
                                <Navigation className="h-4 w-4" strokeWidth={1.75} />
                            }
                        />
                    </div>
                    <div className="min-w-0 sm:border-l sm:border-[#E6E8EB] md:border-l-0 lg:border-l-0">
                        <DateField
                            variant="bare"
                            value={values.startDate}
                            onChange={handlers.onStartDateChange}
                            placeholder={labels.startPlaceholder || 'Start date'}
                        />
                    </div>
                    <div className="min-w-0 sm:col-span-2 md:col-span-1 md:border-l md:border-[#E6E8EB] lg:border-l-0">
                        <DateField
                            variant="bare"
                            value={values.endDate}
                            onChange={handlers.onEndDateChange}
                            placeholder={labels.endPlaceholder || 'End date'}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-brand flex w-full shrink-0 items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold sm:py-4 lg:w-auto lg:min-w-[132px]"
                >
                    <span>Search</span>
                    <Search className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                </button>
            </form>
        )
    }

    return (
        <form
            className={cn(
                'grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]',
                className
            )}
            onSubmit={handlers.onSubmit}
        >
            <label className="block min-w-0">
                <span className="mb-1.5 block px-1 text-[11px] font-medium uppercase tracking-wide text-[#666]">
                    {labels.category || 'Category'}
                </span>
                <Select
                    value={values.category}
                    onChange={handlers.onCategoryChange}
                    options={[...HERO_CATEGORY_OPTIONS]}
                    placeholder="Select category"
                />
            </label>
            <label className="block min-w-0">
                <span className="mb-1.5 block px-1 text-[11px] font-medium uppercase tracking-wide text-[#666]">
                    {labels.from || 'From'}
                </span>
                <Select
                    value={values.from}
                    onChange={handlers.onFromChange}
                    options={fromOptions}
                    placeholder={labels.fromPlaceholder || 'From'}
                />
            </label>
            <label className="block min-w-0">
                <span className="mb-1.5 block px-1 text-[11px] font-medium uppercase tracking-wide text-[#666]">
                    {labels.to || 'To'}
                </span>
                <Select
                    value={values.to}
                    onChange={handlers.onToChange}
                    options={toOptions}
                    placeholder={labels.toPlaceholder || 'To'}
                />
            </label>
            <label className="block min-w-0">
                <span className="mb-1.5 block px-1 text-[11px] font-medium uppercase tracking-wide text-[#666]">
                    {labels.startDate || 'Start date'}
                </span>
                <DateField
                    value={values.startDate}
                    onChange={handlers.onStartDateChange}
                    placeholder={labels.startPlaceholder || 'Start date'}
                />
            </label>
            <label className="block min-w-0">
                <span className="mb-1.5 block px-1 text-[11px] font-medium uppercase tracking-wide text-[#666]">
                    {labels.endDate || 'End date'}
                </span>
                <DateField
                    value={values.endDate}
                    onChange={handlers.onEndDateChange}
                    placeholder={labels.endPlaceholder || 'End date'}
                />
            </label>
            <div className="flex items-end">
                <button
                    type="submit"
                    className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#111] px-5 text-sm font-semibold text-white transition hover:bg-[#333] md:min-w-[48px]"
                >
                    <Search className="h-4 w-4 shrink-0" />
                    <span className="lg:hidden">Search</span>
                </button>
            </div>
        </form>
    )
}

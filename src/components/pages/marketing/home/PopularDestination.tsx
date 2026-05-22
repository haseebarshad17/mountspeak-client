import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { cn } from '@/lib/utils/clsxUtils'
import React from 'react'

const popularDestinations = [
    'All',
    'Skardu',
    'Hunza',
    'Khaplu',
    'Kashmir',
    'Swat Kalam',
    'Naran Kaghan',
    'Murree',
    'Nathia Gali',
    'Patriata',
    'Babusar Top',
    'Umbrella Waterfall',
    'Khanpur Dam',
] as const

export type FilterPillsProps = {
    labels: readonly string[] | string[]
    activeLabel?: string
    className?: string
}

export function FilterPill({
    label,
    isActive,
}: {
    label: string
    isActive: boolean
}) {
    return (
        <span
            className={cn(
                'inline-flex min-h-[42px] min-w-[152px] items-center justify-center rounded-full border px-4 font-roboto text-base font-normal leading-6 tracking-normal',
                isActive
                    ? 'border-[#276968] bg-[#276968] text-white'
                    : 'border-neutral-200 bg-[#F2F2F2] text-[#14141F]',
            )}
        >
            {label}
        </span>
    )
}

export function FilterPills({
    labels,
    activeLabel = 'All',
    className,
}: FilterPillsProps) {
    return (
        <div className={cn('flex flex-wrap items-center justify-center gap-x-8 gap-y-5', className)}>
            {labels.map((label) => (
                <FilterPill key={label} label={label} isActive={label === activeLabel} />
            ))}
        </div>
    )
}

const PopularDestination = () => {
    return (
        <section
            className='bg-white pb-16 sm:pb-20 lg:pb-[86px]'
            aria-labelledby='popular-destination-heading'
        >
            <div className='agency-container'>
                <header className='mx-auto max-w-3xl text-center'>
                    <SectionEyebrow name='Destination' />
                    <h2
                        id='popular-destination-heading'
                        className='agency-section-heading pt-3 text-[40px] font-medium leading-[48px] text-[#14141F] sm:pt-4'
                    >
                        Popular Destination
                    </h2>
                </header>

                <FilterPills
                    labels={popularDestinations}
                    activeLabel='All'
                    className='mx-auto max-w-[1100px] pt-8 sm:pt-10 lg:pt-12'
                />
            </div>
        </section>
    )
}

export default PopularDestination

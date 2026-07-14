'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils/clsxUtils'
import { usesHajjUmrahBanner } from '@/lib/homepage/specialization'
import {
    selectHomepageSpecializationId,
    selectHomepageSpecializations,
} from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

const heroFilterFieldSkeletonClass =
    'h-12 w-full rounded-md xl:h-full xl:rounded-none xl:border-r xl:border-neutral-200'

function HeroFilterBarSkeleton() {
    const specializationId = useAppSelector(selectHomepageSpecializationId)
    const specializations = useAppSelector(selectHomepageSpecializations)
    const isUmrahSite = usesHajjUmrahBanner(specializationId, specializations)
    const filterCount = isUmrahSite ? 3 : 4

    return (
        <div className='w-full max-w-full min-w-0 overflow-hidden rounded-lg border border-neutral-200 bg-white p-2 shadow-md xs:p-2.5 sm:p-3 xl:rounded-[6px] xl:border-[#D6D9DC] xl:p-0'>
            <div
                className={cn(
                    'grid min-w-0 grid-cols-1 gap-2',
                    'xs:grid-cols-2',
                    isUmrahSite
                        ? 'xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(140px,170px)]'
                        : 'xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(140px,170px)]',
                    'xl:h-12 xl:items-stretch xl:gap-0',
                )}
            >
                {Array.from({ length: filterCount }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className={cn(
                            heroFilterFieldSkeletonClass,
                            isUmrahSite && index === filterCount - 1 && 'xs:col-span-2 xl:col-span-1',
                        )}
                    />
                ))}
                <Skeleton
                    className={cn(
                        'h-12 w-full rounded-md xs:col-span-2 xl:col-span-1 xl:h-full xl:rounded-[3px] xl:border-r-0',
                    )}
                />
            </div>
        </div>
    )
}

function SectionHeadingSkeleton() {
    return (
        <div className='mx-auto flex max-w-2xl flex-col items-center gap-3'>
            <Skeleton className='h-4 w-28 rounded-full' />
            <Skeleton className='h-10 w-full max-w-md' />
        </div>
    )
}

function HeroSkeleton() {
    return (
        <section className='p-2 sm:p-3 md:p-4 lg:p-5'>
            <div className='overflow-hidden rounded-[16px] bg-neutral-200'>
                <div className='pb-8 pt-[150px] sm:pb-10 sm:pt-40 md:pb-12 md:pt-48 lg:pb-16 lg:pt-56 xl:pb-[100px] xl:pt-[257px]'>
                    <div className='agency-container'>
                        <div className='mx-auto flex w-full max-w-[828px] flex-col items-center gap-3 text-center'>
                            <Skeleton className='h-10 w-full max-w-[520px] sm:h-12' />
                            <Skeleton className='h-5 w-full max-w-[640px]' />
                        </div>

                        <div className='mx-auto w-full max-w-[867px] pt-6 sm:pt-8 md:pt-10 lg:pt-12 xl:pt-14'>
                            <HeroFilterBarSkeleton />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function TrustSectionSkeleton() {
    return (
        <section className='-mt-4 overflow-hidden bg-white sm:-mt-6' aria-hidden>
            <div className='agency-container'>
                <div className='mx-auto flex max-w-2xl flex-col items-center gap-3'>
                    <Skeleton className='h-4 w-32 rounded-full' />
                    <Skeleton className='h-8 w-full max-w-sm' />
                </div>
            </div>
            <div className='mt-6 flex justify-center gap-6 overflow-hidden px-4 sm:mt-8'>
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className='h-10 w-28 shrink-0 rounded-md' />
                ))}
            </div>
        </section>
    )
}

function PlanPerfectTripSkeleton() {
    return (
        <section className='pb-10 sm:pb-20 lg:pb-[112px]'>
            <div className='agency-container'>
                <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-12 xl:gap-14'>
                    <Skeleton className='aspect-[580/448] w-full max-w-[580px] justify-self-center rounded-2xl md:justify-self-start' />
                    <div className='flex w-full max-w-[612px] flex-col gap-4'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-10 w-full max-w-md' />
                        <Skeleton className='h-5 w-full' />
                        <Skeleton className='h-5 w-full' />
                        <Skeleton className='h-5 w-4/5' />
                        <div className='grid grid-cols-2 gap-4 pt-2'>
                            <Skeleton className='h-16 w-full rounded-xl' />
                            <Skeleton className='h-16 w-full rounded-xl' />
                            <Skeleton className='h-16 w-full rounded-xl' />
                            <Skeleton className='h-16 w-full rounded-xl' />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function OurServicesSkeleton() {
    return (
        <section className='bg-[#F7F8FA] py-10 sm:py-20 lg:py-[96px]'>
            <div className='agency-container'>
                <SectionHeadingSkeleton />
                <div className='mx-auto grid w-full max-w-[1312px] grid-cols-1 gap-4 pt-8 sm:gap-5 sm:pt-8 md:grid-cols-2 md:pt-10 lg:gap-6 lg:pt-12'>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className='rounded-2xl border border-neutral-200/80 bg-white p-6'
                        >
                            <Skeleton className='h-12 w-12 rounded-xl' />
                            <Skeleton className='mt-5 h-7 w-2/3' />
                            <Skeleton className='mt-3 h-4 w-full' />
                            <Skeleton className='mt-2 h-4 w-5/6' />
                        </div>
                    ))}
                </div>
                <div className='flex justify-center pt-10 sm:pt-12 lg:pt-8'>
                    <Skeleton className='h-11 w-[219px] rounded-full' />
                </div>
            </div>
        </section>
    )
}

function PopularDestinationSkeleton() {
    return (
        <section className='overflow-hidden bg-white pb-6 sm:pb-10 lg:pb-12'>
            <div className='agency-container'>
                <SectionHeadingSkeleton />
                <div className='mx-auto flex max-w-[1300px] flex-wrap items-center justify-center gap-3 pt-8 sm:gap-4 sm:pt-10 lg:pt-12'>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton key={index} className='h-[42px] w-[132px] rounded-full' />
                    ))}
                </div>
            </div>
        </section>
    )
}

function TopDestinationsSkeleton() {
    return (
        <section className='bg-white pb-12 sm:pb-20 lg:pb-[100px]'>
            <div className='agency-container'>
                <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end'>
                    <div className='flex w-full max-w-md flex-col gap-2'>
                        <Skeleton className='h-5 w-32' />
                        <Skeleton className='h-10 w-full max-w-sm' />
                    </div>
                    <Skeleton className='h-10 w-28 rounded-md' />
                </div>
                <div className='flex gap-6 overflow-hidden pt-8 sm:pt-10 lg:pt-12'>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className='w-[min(520px,85vw)] shrink-0 rounded-[20px] border border-neutral-200/80 bg-white p-3.5 pb-4 shadow-[0_4px_30px_rgba(0,0,0,0.08)]'
                        >
                            <Skeleton className='h-[332px] w-full rounded-[16px]' />
                            <Skeleton className='h-8 w-40' />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function ExploreTheWorldSkeleton() {
    return (
        <section className='overflow-hidden bg-white pb-12 sm:pb-16 md:pb-20 lg:pb-[112px]'>
            <div className='agency-container'>
                <div className='mx-auto max-w-[900px]'>
                    <SectionHeadingSkeleton />
                    <Skeleton className='mx-auto mt-4 h-5 w-full max-w-[640px]' />
                    <Skeleton className='mx-auto mt-2 h-5 w-full max-w-[560px]' />
                </div>
                <div className='grid grid-cols-1 justify-items-center gap-4 pt-8 xs:gap-5 sm:grid-cols-2 sm:gap-6 sm:pt-10 md:pt-12 lg:grid-cols-3 lg:justify-items-stretch lg:gap-6 lg:pt-14'>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className='aspect-[416/300] w-full max-w-[416px] rounded-[10px] lg:max-w-none'
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default function HomepageSkeleton() {
    return (
        <div
            className='homepage flex flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-24 xl:gap-[100px]'
            aria-busy='true'
            aria-label='Loading homepage'
        >
            <HeroSkeleton />
            <TrustSectionSkeleton />
            <PlanPerfectTripSkeleton />
            <OurServicesSkeleton />
            <PopularDestinationSkeleton />
            <TopDestinationsSkeleton />
            <ExploreTheWorldSkeleton />
        </div>
    )
}

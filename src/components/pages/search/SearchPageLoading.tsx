import { SearchResultsHeadingSkeleton, SearchResultsSkeleton } from '@/components/pages/search/SearchResultsSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

function SearchHeroSkeleton() {
    return (
        <section className='px-2 pt-2 pb-0 sm:px-3 sm:pt-3 md:px-4 md:pt-4 lg:px-5 lg:pt-5'>
            <div className='overflow-hidden rounded-[16px] bg-neutral-200'>
                <div className='px-4 pb-8 pt-[140px] sm:px-6 sm:pb-10 sm:pt-36 md:pt-40 lg:pt-44 xl:pt-48'>
                    <div className='mx-auto flex w-full max-w-[828px] flex-col items-center gap-3 text-center'>
                        <Skeleton className='h-10 w-full max-w-[420px] bg-white/40 sm:h-12' />
                        <Skeleton className='h-5 w-full max-w-[560px] bg-white/25' />
                    </div>

                    <div className='mx-auto w-full max-w-[867px] pt-8 sm:pt-10'>
                        <div className='rounded-lg border border-neutral-200/80 bg-white p-2 shadow-md sm:p-3'>
                            <div className='grid grid-cols-1 gap-2 xs:grid-cols-2'>
                                <Skeleton className='h-12 w-full rounded-md' />
                                <Skeleton className='h-12 w-full rounded-md' />
                                <Skeleton className='h-12 w-full rounded-md' />
                                <Skeleton className='h-12 w-full rounded-md' />
                            </div>
                            <Skeleton
                                className='mt-2 h-12 w-full rounded-xl'
                                style={{ backgroundColor: 'color-mix(in srgb, var(--hp-color-primary) 22%, #e5e7eb)' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default function SearchPageLoading() {
    return (
        <div aria-busy='true' aria-label='Loading search page'>
            <SearchHeroSkeleton />
            <main className='pb-12 pt-8 sm:pb-20 sm:pt-12 lg:pt-16'>
                <div className='agency-container'>
                    <SearchResultsHeadingSkeleton />
                    <SearchResultsSkeleton showStatus={false} />
                </div>
            </main>
        </div>
    )
}

import { Loader2 } from 'lucide-react'

import { TourExploreCardSkeleton } from '@/components/tours/TourExploreCardSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { STATIC_UI_COLORS } from '@/data/homepage'

type SearchResultsSkeletonProps = {
    cardCount?: number
    showStatus?: boolean
}

export function SearchResultsSkeleton({
    cardCount = 6,
    showStatus = true,
}: SearchResultsSkeletonProps) {
    return (
        <div aria-busy='true' aria-live='polite' aria-label='Loading search results'>
            {showStatus ? (
                <div className='mt-4 flex items-center justify-center gap-2 sm:mt-5'>
                    <Loader2
                        className='h-4 w-4 shrink-0 animate-spin'
                        style={{ color: 'var(--hp-color-primary)' }}
                        aria-hidden
                    />
                    <p
                        className='text-sm font-medium'
                        style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
                    >
                        Searching trips...
                    </p>
                </div>
            ) : null}

            <div className='mt-6 grid grid-cols-1 justify-items-center gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:mt-10 lg:grid-cols-3 lg:justify-items-stretch lg:gap-6'>
                {Array.from({ length: cardCount }).map((_, index) => (
                    <TourExploreCardSkeleton key={index} />
                ))}
            </div>
        </div>
    )
}

export function SearchResultsHeadingSkeleton() {
    return (
        <header className='mx-auto max-w-[900px] text-center' aria-hidden>
            <Skeleton className='mx-auto h-9 w-48 max-w-full sm:h-10' />
            <Skeleton className='mx-auto mt-3 h-5 w-full max-w-md sm:mt-4' />
            <Skeleton className='mx-auto mt-2 h-4 w-28' />
        </header>
    )
}

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils/clsxUtils'

type TourExploreCardSkeletonProps = {
    className?: string
}

export function TourExploreCardSkeleton({ className }: TourExploreCardSkeletonProps) {
    return (
        <div
            className={cn(
                'mx-auto flex h-full w-full max-w-[416px] flex-col overflow-hidden rounded-xl border border-[#E3E8EA] bg-white shadow-[0_1px_8px_rgba(0,41,44,0.05)] lg:mx-0',
                className,
            )}
            aria-hidden
        >
            <Skeleton className='aspect-[16/10] w-full rounded-none' />
            <div className='flex flex-1 flex-col px-3.5 py-3 sm:px-4 sm:py-3.5'>
                <Skeleton className='h-5 w-4/5' />
                <Skeleton className='mt-2 h-3 w-28' />
                <div className='mt-3 flex flex-1 flex-col border-t border-[#e0e1e2] pt-3'>
                    <Skeleton className='h-6 w-24' />
                    <Skeleton
                        className='mt-3 h-10 w-full rounded-md'
                        style={{ backgroundColor: 'color-mix(in srgb, var(--hp-color-primary) 18%, #e5e7eb)' }}
                    />
                </div>
            </div>
        </div>
    )
}

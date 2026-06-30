import { Skeleton } from '@/components/ui/skeleton'
import { STATIC_UI_COLORS } from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'

type FaqAccordionSkeletonProps = {
    items?: number
    className?: string
}

function FaqAccordionSkeletonItem({ showAnswer = false }: { showAnswer?: boolean }) {
    return (
        <div
            className="border-b py-5 last:border-b-0 sm:py-6"
            style={{ borderColor: STATIC_UI_COLORS.borderLight }}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-5 w-full max-w-[92%] sm:h-6" />
                    <Skeleton className="h-5 w-3/5 sm:h-6" />
                </div>
                <Skeleton className="mt-1 h-5 w-5 shrink-0 rounded-full" />
            </div>
            {showAnswer ? (
                <div className="mt-4 space-y-2 pb-1 sm:mt-5">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            ) : null}
        </div>
    )
}

export function FaqAccordionSkeleton({ items = 5, className }: FaqAccordionSkeletonProps) {
    return (
        <div
            className={cn('rounded-2xl bg-white px-5 shadow-sm sm:px-8', className)}
            aria-busy="true"
            aria-label="Loading FAQs"
        >
            {Array.from({ length: items }).map((_, index) => (
                <FaqAccordionSkeletonItem key={index} showAnswer={index === 0} />
            ))}
        </div>
    )
}

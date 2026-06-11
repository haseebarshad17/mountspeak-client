import { cn } from '@/lib/utils/clsxUtils'
import { formatTourDiscountDisplayValue } from '@/services/tours/tours.utils'

type TourDiscountBadgeProps = {
    discountPercent: number | null | undefined
    className?: string
    pillClassName?: string
}

export function TourDiscountBadge({
    discountPercent,
    className,
    pillClassName,
}: TourDiscountBadgeProps) {
    const value = formatTourDiscountDisplayValue(discountPercent)
    if (value == null) return null

    return (
        <div
            className={cn(
                'absolute right-3 top-3 z-10 sm:right-4 sm:top-4',
                className,
            )}
        >
            <span
                className={cn(
                    'inline-flex min-h-[36px] items-center justify-center rounded-full bg-[#276968] px-3.5 py-1.5 font-roboto text-xs font-medium leading-none text-white shadow-sm sm:min-h-[40px] sm:px-4 sm:py-2 sm:text-sm',
                    pillClassName,
                )}
            >
                <span className='inline-flex items-baseline gap-0.5 whitespace-nowrap'>
                    <span className='text-sm font-semibold tabular-nums sm:text-base'>
                        {value}
                    </span>
                    <span className='text-xs font-bold leading-none sm:text-sm'>%</span>
                    <span className='ml-1 text-[0.82em] font-medium uppercase tracking-[0.06em] opacity-95'>
                        Off
                    </span>
                </span>
            </span>
        </div>
    )
}

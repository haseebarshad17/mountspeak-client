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
                    'relative inline-flex min-h-[30px] items-center justify-center',
                    'bg-[#276968] py-1 pl-4 pr-2.5 font-roboto text-xs font-normal leading-none text-white shadow-sm',
                    'sm:min-h-[32px] sm:pl-[18px] sm:pr-3 sm:text-sm',
                    '[clip-path:polygon(10px_0,100%_0,100%_100%,10px_100%,0_50%)]',
                    pillClassName,
                )}
            >
                <span className='whitespace-nowrap tabular-nums'>
                    {value}%{' '}
                    <span className='uppercase tracking-[0.04em]'>Off</span>
                </span>
            </span>
        </div>
    )
}

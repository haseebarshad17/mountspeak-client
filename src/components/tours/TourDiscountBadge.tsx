import { HP_CSS_VARS } from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'
import { formatTourDiscount, formatTourDiscountDisplayValue } from '@/services/tours/tours.utils'

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

    const label = formatTourDiscount(discountPercent)

    return (
        <div
            className={cn(
                'absolute right-3 top-3 z-10 sm:right-3.5 sm:top-3.5',
                className,
            )}
        >
            <span
                className={cn(
                    'inline-flex min-w-[72px] items-center justify-center rounded-full px-3 py-1.5',
                    'font-roboto text-[11px] font-semibold leading-none tracking-wide text-white',
                    'shadow-[0_4px_12px_rgba(0,41,44,0.22)] ring-1 ring-white/25 sm:min-w-[80px] sm:px-3.5 sm:py-2 sm:text-xs',
                    pillClassName,
                )}
                style={{ backgroundColor: HP_CSS_VARS.primary }}
            >
                {label}
            </span>
        </div>
    )
}

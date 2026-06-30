import { HP_CSS_VARS } from '@/data/homepage'
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
                'absolute left-3 top-5 z-10',
                className,
            )}
        >
            <span
                className={cn(
                    'inline-flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11',
                    'font-roboto text-[10px] font-bold leading-none tabular-nums text-white',
                    'shadow-[0_4px_12px_rgba(0,41,44,0.22)] ring-1 ring-white/25 sm:text-[11px]',
                    pillClassName,
                )}
                style={{ backgroundColor: HP_CSS_VARS.primary }}
            >
                -{value}%
            </span>
        </div>
    )
}

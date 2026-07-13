import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/clsxUtils'

import type { TourPage } from './tour-page.types'

type ExpeditionCtaButton = TourPage['finalCtaSection']['buttons'][number]

type ExpeditionCtaButtonsProps = {
    buttons: ExpeditionCtaButton[]
    theme: TourPage['theme']
    className?: string
    buttonClassName?: string
    /** Disables primary booking CTAs (past start date). */
    bookingClosed?: boolean
}

export function ExpeditionCtaButtons({
    buttons,
    theme,
    className,
    buttonClassName,
    bookingClosed = false,
}: ExpeditionCtaButtonsProps) {
    if (buttons.length === 0) return null

    return (
        <div className={cn('flex flex-wrap gap-4', className)}>
            {buttons.map((btn) => {
                const isPrimary = btn.style === 'primary'
                const isDisabledBooking = isPrimary && bookingClosed

                return (
                    <Button
                        key={btn.label}
                        href={isDisabledBooking ? undefined : btn.url}
                        disabled={isDisabledBooking}
                        variant={isPrimary ? 'default' : 'outline'}
                        className={cn(
                            'w-full sm:max-w-[257px]',
                            !isPrimary && 'border-[#737879] text-neutral-900 hover:bg-neutral-50',
                            isDisabledBooking && 'opacity-60',
                            buttonClassName,
                        )}
                        style={
                            isPrimary
                                ? {
                                      backgroundColor: theme.secondaryColor,
                                      borderColor: theme.secondaryColor,
                                  }
                                : undefined
                        }
                    >
                        {isDisabledBooking ? 'Booking Closed' : btn.label}
                    </Button>
                )
            })}
        </div>
    )
}

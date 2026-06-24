import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/clsxUtils'

import type { TourPage } from './tour-page.types'

type ExpeditionCtaButton = TourPage['finalCtaSection']['buttons'][number]

type ExpeditionCtaButtonsProps = {
    buttons: ExpeditionCtaButton[]
    theme: TourPage['theme']
    className?: string
    buttonClassName?: string
}

export function ExpeditionCtaButtons({
    buttons,
    theme,
    className,
    buttonClassName,
}: ExpeditionCtaButtonsProps) {
    if (buttons.length === 0) return null

    return (
        <div className={cn('flex flex-wrap gap-4', className)}>
            {buttons.map((btn) => {
                const isPrimary = btn.style === 'primary'

                return (
                    <Button
                        key={btn.label}
                        href={btn.url}
                        variant={isPrimary ? 'default' : 'outline'}
                        className={cn(
                            'w-full sm:max-w-[257px]',
                            !isPrimary && 'border-[#737879] text-neutral-900 hover:bg-neutral-50',
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
                        {btn.label}
                    </Button>
                )
            })}
        </div>
    )
}

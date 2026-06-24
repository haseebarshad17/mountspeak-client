import { HP_CSS_VARS, HP_THEME_TEXT_CLASS, STATIC_UI_COLORS } from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'
import type { LucideIcon } from 'lucide-react'

type SectionEmptyStateVariant = 'default' | 'on-dark'

type SectionEmptyStateProps = {
    icon?: LucideIcon
    title?: string
    description: string
    className?: string
    variant?: SectionEmptyStateVariant
}

export function SectionEmptyState({
    icon: Icon,
    title,
    description,
    className,
    variant = 'default',
}: SectionEmptyStateProps) {
    if (variant === 'on-dark') {
        return (
            <div
                role='status'
                className={cn(
                    'mx-auto flex w-full max-w-[560px] flex-col items-center px-6 py-6 text-center sm:px-10 sm:py-8',
                    className,
                )}
            >
                {title ? (
                    <h3
                        className='text-lg font-medium text-white sm:text-xl'
                        style={{ fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {title}
                    </h3>
                ) : null}

                <p
                    className={cn(
                        'max-w-[420px] text-sm leading-6 text-white/75 sm:text-base sm:leading-7',
                        title ? 'mt-2' : undefined,
                    )}
                    style={{ fontFamily: 'var(--hp-font-body)' }}
                >
                    {description}
                </p>
            </div>
        )
    }

    return (
        <div
            role='status'
            className={cn(
                'mx-auto flex w-full max-w-[560px] flex-col items-center rounded-2xl border border-dashed px-6 py-10 text-center sm:px-10 sm:py-12',
                className,
            )}
            style={{
                borderColor: HP_CSS_VARS.primaryBorder,
                backgroundColor: STATIC_UI_COLORS.backgroundMuted,
            }}
        >
            {Icon ? (
                <div
                    className='flex h-16 w-16 items-center justify-center rounded-full sm:h-[72px] sm:w-[72px]'
                    style={{
                        backgroundColor: 'color-mix(in srgb, var(--hp-color-primary) 14%, white)',
                    }}
                >
                    <Icon className={cn('h-7 w-7 sm:h-8 sm:w-8', HP_THEME_TEXT_CLASS)} aria-hidden />
                </div>
            ) : null}

            {title ? (
                <h3
                    className='mt-5 text-lg font-medium sm:mt-6 sm:text-xl'
                    style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                >
                    {title}
                </h3>
            ) : null}

            <p
                className={cn(
                    'max-w-[420px] text-sm leading-6 sm:text-base sm:leading-7',
                    title ? 'mt-2' : 'mt-5 sm:mt-6',
                )}
                style={{ color: STATIC_UI_COLORS.textMuted, fontFamily: 'var(--hp-font-body)' }}
            >
                {description}
            </p>
        </div>
    )
}

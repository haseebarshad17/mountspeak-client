'use client'

import { HP_CSS_VARS, HP_THEME_BTN_CLASS, HP_THEME_BTN_STYLE, STATIC_UI_COLORS } from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'

export type FilterPillsProps = {
    labels: readonly string[] | string[]
    activeLabel: string
    onLabelChange: (label: string) => void
    className?: string
}

export function FilterPill({
    label,
    isActive,
    onClick,
}: {
    label: string
    isActive: boolean
    onClick: () => void
}) {
    return (
        <button
            type='button'
            onClick={onClick}
            aria-pressed={isActive}
            className={cn(
                'inline-flex shrink-0 min-h-[34px] cursor-pointer items-center justify-center whitespace-nowrap rounded-full border px-3 py-1.5 font-roboto text-sm font-normal leading-5 tracking-normal transition-colors',
                'sm:min-h-[42px] sm:min-w-[152px] sm:px-4 sm:text-base sm:leading-6',
                isActive ? HP_THEME_BTN_CLASS : 'hover:bg-neutral-50',
            )}
            style={
                isActive
                    ? HP_THEME_BTN_STYLE
                    : {
                          backgroundColor: '#FFFFFF',
                          borderColor: HP_CSS_VARS.primaryBorder,
                          color: STATIC_UI_COLORS.title,
                      }
            }
        >
            {label}
        </button>
    )
}

export function FilterPills({
    labels,
    activeLabel,
    onLabelChange,
    className,
}: FilterPillsProps) {
    return (
        <div
            className={cn(
                'mb-6 -mx-3 flex flex-nowrap items-center gap-2 overflow-x-auto px-3 pb-1 scrollbar-hide sm:mx-0 sm:mb-10 sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-5 sm:overflow-visible sm:px-0 md:mb-[60px]',
                className,
            )}
        >
            {labels.map((label) => (
                <FilterPill
                    key={label}
                    label={label}
                    isActive={label === activeLabel}
                    onClick={() => onLabelChange(label)}
                />
            ))}
        </div>
    )
}

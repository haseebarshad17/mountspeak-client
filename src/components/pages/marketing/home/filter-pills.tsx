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
                'inline-flex min-h-[42px] min-w-[152px] cursor-pointer items-center justify-center rounded-full border px-4 font-roboto text-base font-normal leading-6 tracking-normal transition-colors',
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
        <div className={cn('flex flex-wrap items-center justify-center gap-x-8 gap-y-5 mb-[60px]', className)}>
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

'use client'

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
                isActive
                    ? 'border-[#276968] bg-[#276968] text-white'
                    : 'border-[#276968] bg-[#F2F2F2] text-[#14141F] hover:border-neutral-300 hover:bg-neutral-100',
            )}
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
        <div className={cn('flex flex-wrap items-center justify-center gap-x-8 gap-y-5', className)}>
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

'use client'

import * as Popover from '@radix-ui/react-popover'
import { Check, ChevronDown } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { isClassicTemplate, softFieldClass } from '@/lib/templates/chrome'
import { cn } from '@/lib/utils/cn'

export type SelectOption = {
    value: string
    label: string
}

export function Select({
    value,
    onChange,
    options,
    placeholder = 'Select',
    className,
    disabled,
    leadingIcon,
    variant = 'default',
}: {
    value: string
    onChange: (value: string) => void
    options: SelectOption[]
    placeholder?: string
    className?: string
    disabled?: boolean
    leadingIcon?: ReactNode
    variant?: 'default' | 'bare'
}) {
    const template = useTemplateVariant()
    const classic = isClassicTemplate(template)
    const [open, setOpen] = useState(false)
    const selected = useMemo(
        () => options.find((option) => option.value === value) ?? null,
        [options, value]
    )
    const isBare = variant === 'bare'

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild disabled={disabled}>
                <button
                    type="button"
                    className={cn(
                        'flex w-full min-w-0 items-center gap-2 text-left text-sm outline-none transition',
                        isBare
                            ? 'h-full rounded-none bg-transparent px-3.5 py-3.5 hover:bg-black/[0.02]'
                            : softFieldClass(template, 'justify-between'),
                        'disabled:cursor-not-allowed disabled:opacity-60',
                        className
                    )}
                >
                    {leadingIcon ? (
                        <span className="shrink-0 text-[#8A9199]">{leadingIcon}</span>
                    ) : null}
                    <span
                        className={cn(
                            'min-w-0 flex-1 truncate',
                            !selected && 'text-[#9AA0A6]'
                        )}
                    >
                        {selected?.label ?? placeholder}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#9AA0A6]" />
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    align="start"
                    sideOffset={8}
                    className="z-50 max-h-64 w-[var(--radix-popover-trigger-width)] min-w-[180px] scrollbar-thin
                    overflow-auto rounded-xl border border-black/5 bg-white p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
                >
                    {options.length === 0 ? (
                        <p className="px-3 py-2 text-sm text-[#666]">No options</p>
                    ) : (
                        options.map((option) => {
                            const active = option.value === value
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value)
                                        setOpen(false)
                                    }}
                                    className={cn(
                                        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition',
                                        active
                                            ? classic
                                                ? 'bg-brand'
                                                : 'bg-[#111] text-white'
                                            : classic
                                              ? 'text-[#222] hover:bg-black/[0.04]'
                                              : 'text-[#222] hover:bg-[#F7F3EE]'
                                    )}
                                >
                                    {option.label}
                                    {active ? <Check className="h-3.5 w-3.5" /> : null}
                                </button>
                            )
                        })
                    )}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}

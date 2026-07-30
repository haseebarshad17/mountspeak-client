'use client'

import * as Popover from '@radix-ui/react-popover'
import { Check, ChevronDown } from 'lucide-react'
import { useMemo, useState } from 'react'
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
}: {
    value: string
    onChange: (value: string) => void
    options: SelectOption[]
    placeholder?: string
    className?: string
    disabled?: boolean
}) {
    const [open, setOpen] = useState(false)
    const selected = useMemo(
        () => options.find((option) => option.value === value) ?? null,
        [options, value]
    )

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild disabled={disabled}>
                <button
                    type="button"
                    className={cn(
                        'flex w-full min-w-0 items-center justify-between gap-2 rounded-xl bg-[#F7F3EE] px-4 py-3 text-left text-sm outline-none transition',
                        'hover:bg-[#F1EBE3] disabled:cursor-not-allowed disabled:opacity-60',
                        className
                    )}
                >
                    <span className={cn('min-w-0 truncate', !selected && 'text-[#888]')}>
                        {selected?.label ?? placeholder}
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#666]" />
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    align="start"
                    sideOffset={8}
                    className="z-50 max-h-64 w-[var(--radix-popover-trigger-width)] overflow-auto rounded-xl border border-black/5 bg-white p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
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
                                            ? 'bg-[#111] text-white'
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

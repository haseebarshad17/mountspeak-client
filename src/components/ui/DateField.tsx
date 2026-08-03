'use client'

import * as Popover from '@radix-ui/react-popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { useMemo, useState } from 'react'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { softFieldClass } from '@/lib/templates/chrome'
import { cn } from '@/lib/utils/cn'
import 'react-day-picker/style.css'

export function DateField({
    value,
    onChange,
    placeholder = 'Select date',
    className,
    variant = 'default',
}: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    variant?: 'default' | 'bare'
}) {
    const template = useTemplateVariant()
    const [open, setOpen] = useState(false)
    const selected = useMemo(() => {
        if (!value) return undefined
        const date = new Date(`${value}T00:00:00`)
        return Number.isNaN(date.getTime()) ? undefined : date
    }, [value])
    const isBare = variant === 'bare'

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className={cn(
                        'flex w-full min-w-0 items-center gap-2 text-left text-sm outline-none transition',
                        isBare
                            ? 'h-full rounded-none bg-transparent px-3.5 py-3.5 hover:bg-black/[0.02]'
                            : softFieldClass(template, 'justify-between'),
                        className
                    )}
                >
                    {isBare ? (
                        <CalendarIcon className="h-4 w-4 shrink-0 text-[#8A9199]" />
                    ) : null}
                    <span
                        className={cn(
                            'min-w-0 flex-1 truncate',
                            !selected && 'text-[#9AA0A6]'
                        )}
                    >
                        {selected ? format(selected, 'MMM d, yyyy') : placeholder}
                    </span>
                    {!isBare ? (
                        <CalendarIcon className="h-4 w-4 shrink-0 text-[#666]" />
                    ) : null}
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    align="start"
                    sideOffset={8}
                    className="z-50 rounded-2xl border border-black/5 bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
                >
                    <DayPicker
                        mode="single"
                        selected={selected}
                        onSelect={(date) => {
                            if (!date) {
                                onChange('')
                                return
                            }
                            onChange(format(date, 'yyyy-MM-dd'))
                            setOpen(false)
                        }}
                        disabled={{ before: new Date() }}
                        className="rdp-root text-sm"
                    />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}

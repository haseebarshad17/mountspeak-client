'use client'

import * as Popover from '@radix-ui/react-popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import 'react-day-picker/style.css'

export function DateField({
    value,
    onChange,
    placeholder = 'Select date',
    className,
}: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}) {
    const [open, setOpen] = useState(false)
    const selected = useMemo(() => {
        if (!value) return undefined
        const date = new Date(`${value}T00:00:00`)
        return Number.isNaN(date.getTime()) ? undefined : date
    }, [value])

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className={cn(
                        'flex w-full min-w-0 items-center justify-between gap-2 rounded-xl bg-[#F7F3EE] px-4 py-3 text-left text-sm outline-none transition hover:bg-[#F1EBE3]',
                        className
                    )}
                >
                    <span className={cn('min-w-0 truncate', !selected && 'text-[#888]')}>
                        {selected ? format(selected, 'MMM d, yyyy') : placeholder}
                    </span>
                    <CalendarIcon className="h-4 w-4 shrink-0 text-[#666]" />
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

import { cn } from '@/lib/utils/clsxUtils'
import React from 'react'

type SectionEyebrowProps = {
    name: string
    className?: string
    color?: string
}

export function SectionEyebrow({ name, className, color = '#276968' }: SectionEyebrowProps) {
    return (
        <div className={cn('flex items-center justify-center gap-3 sm:gap-4', className)}>
            <span className='hidden h-[2px] flex-1 max-w-[50px] sm:block' style={{ backgroundColor: color }} aria-hidden />
            <span
                className='text-readable-uppercase text-[20px] font-semibold uppercase leading-6 tracking-[0.1em]'
                style={{ color, fontFamily: 'var(--hp-font-body, var(--font-roboto))' }}
            >
                {name}
            </span>
            <span className='hidden h-[2px] flex-1 max-w-[50px] sm:block' style={{ backgroundColor: color }} aria-hidden />
        </div>
    )
}

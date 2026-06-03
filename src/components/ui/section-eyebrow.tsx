import { cn } from '@/lib/utils/clsxUtils'
import { homepage } from '@/data/homepage'
import React from 'react'

const { colors } = homepage.theme

type SectionEyebrowProps = {
    name: string
    className?: string
}

export function SectionEyebrow({ name, className }: SectionEyebrowProps) {
    return (
        <div className={cn('flex items-center justify-center gap-3 sm:gap-4', className)}>
            <span className='hidden h-[2px] flex-1 max-w-[50px] sm:block' style={{ backgroundColor: colors.eyebrow }} aria-hidden />
            <span
                className='text-[20px] font-semibold uppercase leading-6'
                style={{ color: colors.eyebrow, fontFamily: 'var(--hp-font-body, var(--font-roboto))' }}
            >
                {name}
            </span>
            <span className='hidden h-[2px] flex-1 max-w-[50px] sm:block' style={{ backgroundColor: colors.eyebrow }} aria-hidden />
        </div>
    )
}

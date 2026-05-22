import { cn } from '@/lib/utils/clsxUtils'
import React from 'react'

type SectionEyebrowProps = {
    name: string
    className?: string
}

export function SectionEyebrow({ name, className }: SectionEyebrowProps) {
    return (
        <div className={cn('flex items-center justify-center gap-3 sm:gap-4', className)}>
            <span className='hidden h-[2px] flex-1 max-w-[50px] bg-[#276968] sm:block' aria-hidden />
            <span className='text-[20px] font-semibold uppercase leading-6  text-[#276968]'>
                {name}
            </span>
            <span className='hidden h-[2px] flex-1 max-w-[50px] bg-[#276968] sm:block' aria-hidden />
        </div>
    )
}

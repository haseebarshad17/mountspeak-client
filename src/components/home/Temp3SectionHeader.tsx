'use client'

import { cn } from '@/lib/utils/cn'

export function Temp3SectionHeader({
    eyebrow,
    title,
    subtitle,
    tone = 'cream',
    className,
}: {
    eyebrow?: string | null
    title: string
    subtitle?: string | null
    tone?: 'cream' | 'navy'
    className?: string
}) {
    const onNavy = tone === 'navy'

    return (
        <div className={cn('t3-head', className)}>
            {eyebrow ? (
                <p className={cn('t3-eyebrow', onNavy && 't3-eyebrow-on-navy')}>
                    {eyebrow}
                </p>
            ) : null}
            <h2 className={cn('t3-title', onNavy ? 't3-title-on-navy' : 't3-title-on-cream')}>
                {title}
            </h2>
            {subtitle ? (
                <p className={cn('t3-sub', onNavy ? 't3-sub-on-navy' : 't3-sub-on-cream')}>
                    {subtitle}
                </p>
            ) : null}
        </div>
    )
}

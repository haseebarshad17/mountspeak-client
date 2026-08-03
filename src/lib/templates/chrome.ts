import type { TemplateVariant } from '@/lib/templates/resolve-variant'
import { cn } from '@/lib/utils/cn'

/** Classic / default template (temp1) only. */
export function isClassicTemplate(variant: TemplateVariant) {
    return variant === 'temp1'
}

/** Modern template (temp3 / mount-temp-3). */
export function isModernTemplate(variant: TemplateVariant) {
    return variant === 'temp3'
}

export function pillTabClass(
    active: boolean,
    variant: TemplateVariant,
    className?: string
) {
    if (variant === 'temp3') {
        return cn(
            'rounded-sm px-4 py-2 text-sm font-ui transition',
            active
                ? 'bg-t3-navy text-t3-cream'
                : 'border border-t3-navy/10 bg-white text-t3-navy hover:bg-t3-navy/5',
            className
        )
    }

    const classic = isClassicTemplate(variant)
    return cn(
        'rounded-full px-4 py-2 text-sm transition',
        classic
            ? active
                ? 'bg-brand'
                : 'border border-black/10 bg-white text-[#333] hover:bg-black/5'
            : active
              ? 'bg-[#111] text-white'
              : 'bg-[#F2EEE8] text-[#333]',
        className
    )
}

export function primaryButtonClass(
    variant: TemplateVariant,
    className?: string
) {
    if (variant === 'temp3') {
        return cn('t3-btn t3-btn-solid', className)
    }

    return cn(
        isClassicTemplate(variant)
            ? 'btn-brand'
            : 'bg-[#111] text-white transition hover:bg-[#333]',
        className
    )
}

export function softFieldClass(variant: TemplateVariant, className?: string) {
    if (variant === 'temp3') {
        return cn(
            'rounded-[10px] border border-t3-navy/10 bg-white px-4 py-3 text-sm font-ui text-t3-navy outline-none transition hover:bg-t3-cream/60 focus:border-t3-gold/50',
            className
        )
    }

    return cn(
        'rounded-xl px-4 py-3 text-sm outline-none transition',
        isClassicTemplate(variant)
            ? 'border border-black/10 bg-white hover:bg-black/[0.02]'
            : 'bg-[#F7F3EE] hover:bg-[#F1EBE3]',
        className
    )
}

export function accentSolidClass(variant: TemplateVariant, className?: string) {
    if (variant === 'temp3') {
        return cn('bg-t3-navy text-t3-cream', className)
    }

    return cn(
        isClassicTemplate(variant) ? 'bg-brand' : 'bg-[#06403D] text-white',
        className
    )
}

export function accentSoftClass(variant: TemplateVariant, className?: string) {
    if (variant === 'temp3') {
        return cn('bg-t3-navy/5 text-t3-navy', className)
    }

    return cn(
        isClassicTemplate(variant)
            ? 'bg-brand-soft'
            : 'bg-[#06403D]/10 text-[#06403D]',
        className
    )
}

export function activeNavClass(active: boolean, variant: TemplateVariant) {
    if (variant === 'temp3') {
        return cn(
            'rounded-[10px] px-3.5 py-2.5 text-sm font-ui transition',
            active
                ? 'bg-t3-navy font-medium text-t3-cream'
                : 'bg-white text-t3-navy hover:bg-t3-navy/5 md:bg-transparent'
        )
    }

    const classic = isClassicTemplate(variant)
    return cn(
        'rounded-xl px-3.5 py-2.5 text-sm transition',
        active
            ? classic
                ? 'bg-brand font-medium'
                : 'bg-[#111] font-medium text-white'
            : classic
              ? 'bg-white text-[#333] hover:bg-black/[0.04] md:bg-transparent'
              : 'bg-white text-[#333] hover:bg-[#F4F0EA] md:bg-transparent'
    )
}

import type { TemplateVariant } from '@/lib/templates/resolve-variant'
import { cn } from '@/lib/utils/cn'

/** Classic / default template (temp1) and unimplemented fallbacks. */
export function isClassicTemplate(variant: TemplateVariant) {
    return variant !== 'temp2'
}

export function pillTabClass(
    active: boolean,
    variant: TemplateVariant,
    className?: string
) {
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
    return cn(
        isClassicTemplate(variant)
            ? 'btn-brand'
            : 'bg-[#111] text-white transition hover:bg-[#333]',
        className
    )
}

export function softFieldClass(variant: TemplateVariant, className?: string) {
    return cn(
        'rounded-xl px-4 py-3 text-sm outline-none transition',
        isClassicTemplate(variant)
            ? 'border border-black/10 bg-white hover:bg-black/[0.02]'
            : 'bg-[#F7F3EE] hover:bg-[#F1EBE3]',
        className
    )
}

export function accentSolidClass(variant: TemplateVariant, className?: string) {
    return cn(
        isClassicTemplate(variant) ? 'bg-brand' : 'bg-[#06403D] text-white',
        className
    )
}

export function accentSoftClass(variant: TemplateVariant, className?: string) {
    return cn(
        isClassicTemplate(variant)
            ? 'bg-brand-soft'
            : 'bg-[#06403D]/10 text-[#06403D]',
        className
    )
}

export function activeNavClass(active: boolean, variant: TemplateVariant) {
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

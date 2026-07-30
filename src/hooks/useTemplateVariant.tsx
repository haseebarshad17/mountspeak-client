'use client'

import {
    createContext,
    useContext,
    type ReactNode,
} from 'react'
import {
    DEFAULT_VARIANT,
    resolveTemplateVariant,
    type TemplateVariant,
} from '@/lib/templates/resolve-variant'

const TemplateVariantContext = createContext<TemplateVariant>(DEFAULT_VARIANT)

export function TemplateVariantProvider({
    templateId,
    children,
}: {
    templateId?: string | null
    children: ReactNode
}) {
    const variant = resolveTemplateVariant(templateId)

    return (
        <TemplateVariantContext.Provider value={variant}>
            {children}
        </TemplateVariantContext.Provider>
    )
}

export function useTemplateVariant(): TemplateVariant {
    return useContext(TemplateVariantContext)
}

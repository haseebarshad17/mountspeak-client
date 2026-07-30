export type TemplateVariant = 'classic' | 'modern' | 'bold'

const VARIANT_BY_TEMPLATE_ID: Record<string, TemplateVariant> = {
    'jedw-cwe-cw': 'classic',
    'ab12-cd34-ef': 'modern',
    'gh56-ij78-kl': 'bold',
}

/** Variants with real UI. Others fall back to classic so agencies never get a blank page. */
const IMPLEMENTED_VARIANTS = new Set<TemplateVariant>(['classic'])

export const DEFAULT_TEMPLATE_ID = 'jedw-cwe-cw'
export const DEFAULT_VARIANT: TemplateVariant = 'classic'

export function resolveTemplateVariant(
    templateId?: string | null
): TemplateVariant {
    if (!templateId?.trim()) return DEFAULT_VARIANT
    const resolved =
        VARIANT_BY_TEMPLATE_ID[templateId.trim()] ?? DEFAULT_VARIANT
    return IMPLEMENTED_VARIANTS.has(resolved) ? resolved : DEFAULT_VARIANT
}

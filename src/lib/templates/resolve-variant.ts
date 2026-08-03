export type TemplateVariant = 'temp1' | 'temp2' | 'temp3'

/**
 * Dashboard SITE_TEMPLATES → UI
 *
 * | id            | key           | name    | variant | UI                                      |
 * |---------------|---------------|---------|---------|-----------------------------------------|
 * | jedw-cwe-cw   | mount-temp-1  | Classic | temp1   | Full-bleed hero slider + teal marketing |
 * | ab12-cd34-ef  | mount-temp-2  | Studio  | temp2   | Cream asymmetric / pill chrome          |
 * | gh56-ij78-kl  | mount-temp-3  | Modern  | temp3   | Full-width hero, thumbs, floating search|
 */
const VARIANT_BY_TEMPLATE_ID: Record<string, TemplateVariant> = {
    'jedw-cwe-cw': 'temp1',
    'mount-temp-1': 'temp1',
    temp1: 'temp1',
    'ab12-cd34-ef': 'temp2',
    'mount-temp-2': 'temp2',
    temp2: 'temp2',
    'gh56-ij78-kl': 'temp3',
    'mount-temp-3': 'temp3',
    temp3: 'temp3',
}

const IMPLEMENTED_VARIANTS = new Set<TemplateVariant>([
    'temp1',
    'temp2',
    'temp3',
])

/** Dashboard Classic / mount-temp-1 — full-bleed hero mockup */
export const DEFAULT_TEMPLATE_ID = 'jedw-cwe-cw'
export const DEFAULT_VARIANT: TemplateVariant = 'temp1'

export function resolveTemplateVariant(
    templateId?: string | null
): TemplateVariant {
    if (!templateId?.trim()) return DEFAULT_VARIANT
    const resolved =
        VARIANT_BY_TEMPLATE_ID[templateId.trim()] ?? DEFAULT_VARIANT
    return IMPLEMENTED_VARIANTS.has(resolved) ? resolved : DEFAULT_VARIANT
}

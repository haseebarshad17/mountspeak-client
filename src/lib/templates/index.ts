import { mountTemp1Styles } from '@/lib/templates/mount-temp-1'
import { mountTemp2Styles } from '@/lib/templates/mount-temp-2'
import { mountTemp3Styles } from '@/lib/templates/mount-temp-3'
import type { TemplateKey, TemplateStyles } from '@/lib/templates/types'

export type { TemplateKey, TemplateStyles } from '@/lib/templates/types'

/** Query param used by dashboard preview redirects. */
export const TEMPLATE_ID_QUERY_PARAM = 'templateId'

export const DEFAULT_TEMPLATE_KEY: TemplateKey = 'mount-temp-1'

/**
 * Frontend registry: agency template id → style module key.
 * Keep ids in sync with dashboard `SITE_TEMPLATES`.
 */
const TEMPLATE_KEY_BY_ID: Record<string, TemplateKey> = {
    'jedw-cwe-cw': 'mount-temp-1',
    'ab12-cd34-ef': 'mount-temp-2',
    'gh56-ij78-kl': 'mount-temp-3',
}

const STYLES_BY_KEY: Record<TemplateKey, TemplateStyles> = {
    'mount-temp-1': mountTemp1Styles,
    'mount-temp-2': mountTemp2Styles,
    'mount-temp-3': mountTemp3Styles,
}

export function resolveTemplateKey(templateId?: string | null): TemplateKey {
    if (!templateId?.trim()) return DEFAULT_TEMPLATE_KEY
    return TEMPLATE_KEY_BY_ID[templateId.trim()] ?? DEFAULT_TEMPLATE_KEY
}

/** Resolve section Tailwind styles for a template id (or default). */
export function getTemplateStyles(templateId?: string | null): TemplateStyles {
    return STYLES_BY_KEY[resolveTemplateKey(templateId)]
}

export function parseTemplateIdParam(
    value: string | string[] | undefined | null,
): string | null {
    if (typeof value === 'string') {
        const trimmed = value.trim()
        return trimmed || null
    }

    if (Array.isArray(value) && typeof value[0] === 'string') {
        const trimmed = value[0].trim()
        return trimmed || null
    }

    return null
}

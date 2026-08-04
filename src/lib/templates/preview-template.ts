import {
    DEFAULT_TEMPLATE_ID,
    resolveTemplateVariant,
    type TemplateVariant,
} from '@/lib/templates/resolve-variant'

/** Must stay in sync with dashboard `TEMPLATE_ID_QUERY_PARAM`. */
export const TEMPLATE_ID_QUERY_PARAM = 'templateId'

export const AGENCY_PREVIEW_TEMPLATE_COOKIE = 'agency-preview-template-id'
export const AGENCY_PREVIEW_TEMPLATE_HEADER = 'x-agency-preview-template-id'

const KNOWN_TEMPLATE_IDS = new Set([
    'jedw-cwe-cw',
    'mount-temp-1',
    'temp1',
    'ab12-cd34-ef',
    'mount-temp-2',
    'temp2',
    'gh56-ij78-kl',
    'mount-temp-3',
    'temp3',
])

/** Former Studio catalog id — maps to current mount-temp-2. */
const LEGACY_TEMPLATE_ID_ALIASES: Record<string, string> = {
    'st9k-m3-studio': 'ab12-cd34-ef',
}

export function normalizePreviewTemplateId(
    templateId: string | null | undefined
): string | null {
    if (!templateId?.trim()) return null
    const normalized = LEGACY_TEMPLATE_ID_ALIASES[templateId.trim()] ?? templateId.trim()
    if (!KNOWN_TEMPLATE_IDS.has(normalized)) return null
    return normalized
}

export function isPreviewTemplateId(templateId: string | null | undefined): boolean {
    return Boolean(normalizePreviewTemplateId(templateId))
}

export function resolvePreviewTemplateVariant(
    templateId: string | null | undefined
): TemplateVariant {
    return resolveTemplateVariant(normalizePreviewTemplateId(templateId) ?? DEFAULT_TEMPLATE_ID)
}

/**
 * Appends preview query params (`host`, `templateId`) onto an internal href
 * without clobbering existing values.
 */
export function withAgencyPreviewQuery(
    href: string,
    opts: {
        host?: string | null
        templateId?: string | null
    }
): string {
    if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#')
    ) {
        return href
    }

    const host = opts.host?.trim() || null
    const templateId = normalizePreviewTemplateId(opts.templateId)

    if (!host && !templateId) return href

    const [pathAndHash, existingQuery = ''] = href.split('?')
    const [pathname, hash = ''] = pathAndHash.split('#')
    const params = new URLSearchParams(existingQuery)

    if (host && !params.has('host')) {
        params.set('host', host)
    }
    if (templateId && !params.has(TEMPLATE_ID_QUERY_PARAM)) {
        params.set(TEMPLATE_ID_QUERY_PARAM, templateId)
    }

    const query = params.toString()
    const hashPart = hash ? `#${hash}` : ''
    return query ? `${pathname}?${query}${hashPart}` : `${pathname}${hashPart}`
}

/** Copies `host` / `templateId` from the current search onto a params object. */
export function copyAgencyPreviewParams(
    target: URLSearchParams,
    source: Pick<URLSearchParams, 'get'>
) {
    const host = source.get('host')?.trim()
    if (host && !target.has('host')) {
        target.set('host', host)
    }

    const templateId = normalizePreviewTemplateId(source.get(TEMPLATE_ID_QUERY_PARAM))
    if (templateId && !target.has(TEMPLATE_ID_QUERY_PARAM)) {
        target.set(TEMPLATE_ID_QUERY_PARAM, templateId)
    }
}

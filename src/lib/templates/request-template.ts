import { headers } from 'next/headers'
import {
    AGENCY_PREVIEW_TEMPLATE_HEADER,
    normalizePreviewTemplateId,
} from '@/lib/templates/preview-template'

/** Preview `templateId` from middleware header, if present. */
export async function getRequestPreviewTemplateId(): Promise<string | null> {
    const h = await headers()
    return normalizePreviewTemplateId(h.get(AGENCY_PREVIEW_TEMPLATE_HEADER))
}

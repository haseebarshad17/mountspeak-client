import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { prefixHref } from '@/lib/homepage/agency-preview'

export async function redirectWithAgencyPreview(path: string): Promise<never> {
    const headersList = await headers()
    const previewBase = headersList.get('x-agency-preview-base')
    redirect(prefixHref(path, previewBase))
}

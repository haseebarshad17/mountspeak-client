'use client'

import { LegalDocumentView, LegalPageShell } from '@/components/pages/legal/LegalDocumentView'
import { useIsAgencySite } from '@/hooks/useIsAgencySite'
import { useAgencyPrivacy } from '@/services/content_pages/content.queries'
import { selectHomepageAgencyId } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

export default function PrivacyPage() {
    const isAgencySite = useIsAgencySite()
    const agencyId = useAppSelector(selectHomepageAgencyId)
    const { data: document = null, isLoading } = useAgencyPrivacy(agencyId, isAgencySite === true)

    return (
        <LegalPageShell>
            <LegalDocumentView
                document={document}
                isLoading={isLoading || isAgencySite === null}
                emptyTitle='Privacy Policy unavailable'
                emptyDescription='Privacy Policy for this agency has not been published yet.'
            />
        </LegalPageShell>
    )
}

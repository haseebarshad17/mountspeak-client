'use client'

import { LegalDocumentView, LegalPageShell } from '@/components/pages/legal/LegalDocumentView'
import { useIsAgencySite } from '@/hooks/useIsAgencySite'
import { useAgencyTerms } from '@/services/content_pages/content.queries'
import { selectHomepageAgencyId } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

export default function TermsPage() {
    const isAgencySite = useIsAgencySite()
    const agencyId = useAppSelector(selectHomepageAgencyId)
    const { data: document = null, isLoading } = useAgencyTerms(agencyId, isAgencySite === true)

    return (
        <LegalPageShell>
            <LegalDocumentView
                document={document}
                isLoading={isLoading || isAgencySite === null}
                emptyTitle='Terms unavailable'
                emptyDescription='Terms of Service for this agency have not been published yet.'
            />
        </LegalPageShell>
    )
}

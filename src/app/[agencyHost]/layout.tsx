import { notFound } from 'next/navigation'

import { isAgencyHostPathSegment } from '@/lib/homepage/agency-preview'
import {
    readAgencyPreviewHostForRequest,
    setAgencyPreviewHostForRequest,
} from '@/lib/homepage/agency-preview-request'

type AgencyPreviewLayoutProps = {
    children: React.ReactNode
    params: { agencyHost: string }
}

export default function AgencyPreviewLayout({ children, params }: AgencyPreviewLayoutProps) {
    const agencyHost = params.agencyHost.toLowerCase()

    if (!isAgencyHostPathSegment(agencyHost)) {
        notFound()
    }

    if (readAgencyPreviewHostForRequest() !== agencyHost) {
        setAgencyPreviewHostForRequest(agencyHost)
    }

    return children
}

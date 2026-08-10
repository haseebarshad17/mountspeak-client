/** Inquiry types accepted by the `submit_consult_us` RPC. */
export const INQUIRY_TYPE_OPTIONS = [
    { value: 'GENERAL', label: 'General Inquiry' },
    { value: 'TOUR_PACKAGE', label: 'Tour & Package Inquiry' },
    { value: 'CUSTOM_ITINERARY', label: 'Custom Itinerary Request' },
    { value: 'GROUP_TRAVEL', label: 'Group Travel' },
    { value: 'CORPORATE', label: 'Corporate Travel' },
    { value: 'SUPPORT', label: 'Support' },
] as const

export type InquiryType = (typeof INQUIRY_TYPE_OPTIONS)[number]['value']

export type SubmitConsultUsPayload = {
    agency_id: string
    name: string
    email: string
    phone: string
    inquiry_type: InquiryType
    title: string
    description: string
}

/** Shape returned by the `submit_consult_us` RPC. */
export type ConsultUsRecord = {
    id: string
    name: string
    email: string
    phone: string
    title: string
    status: string
    message: string
    success: boolean
    agency_id: string | null
    description: string
    inquiry_type: InquiryType
}

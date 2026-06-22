export const CONSULTATION_INQUIRY_TYPES = [
    'GENERAL',
    'TOUR_PACKAGE',
    'CUSTOM_ITINERARY',
    'GROUP_TRAVEL',
    'CORPORATE',
    'SUPPORT',
] as const

export const CONSULTATION_TITLES = [
    'Trip Planning Consultation',
    'Package & Pricing Inquiry',
    'Custom Itinerary Request',
    'Group Travel Planning',
    'Corporate Travel Inquiry',
    'General Question',
    'Other',
] as const

export type ConsultationInquiryType = (typeof CONSULTATION_INQUIRY_TYPES)[number]
export type ConsultationTitle = (typeof CONSULTATION_TITLES)[number]

export type CreateConsultationRequestDTO = {
    name: string
    email: string
    phone: string
    title: string
    description: string
    inquiry_type?: ConsultationInquiryType | null
    agency_id?: string
}

export type SubmitConsultationRpcResponse = {
    success: boolean
    message: string
    id: string
    name: string
    email: string
    phone: string
    title: string
    description: string
    inquiry_type: string | null
}

export type ConsultationRequestRecord = CreateConsultationRequestDTO & {
    id: string
    created_at?: string
    updated_at?: string
}

export const CONSULTATION_INQUIRY_LABELS: Record<ConsultationInquiryType, string> = {
    GENERAL: 'General inquiry',
    TOUR_PACKAGE: 'Tour package',
    CUSTOM_ITINERARY: 'Custom itinerary',
    GROUP_TRAVEL: 'Group travel',
    CORPORATE: 'Corporate travel',
    SUPPORT: 'Support',
}

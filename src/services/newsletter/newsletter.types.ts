import type { SupabaseClient } from '@supabase/supabase-js'

export type NewsletterDTO = {
    email: string
    agency_id?: string
}

export type SubscribeEmailResponse = {
    success: boolean
    already_subscribed: boolean
    message: string
    id: string
    email: string
    status: string
    agency_id?: string | null
}

export type NewsletterServiceProps = {
    supabase: SupabaseClient
}

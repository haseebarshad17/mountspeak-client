export type MagicLinkDTO = {
    email: string
    emailRedirectTo: string
    agency_id?: string
    agency_site_url?: string
}

export type GoogleLoginDTO = {
    redirectTo: string
    agency_id?: string
}

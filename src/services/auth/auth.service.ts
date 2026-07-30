import type { SupabaseClient } from '@supabase/supabase-js'
import type { GoogleLoginDTO, MagicLinkDTO } from './auth.types'

type AuthServiceProps = { supabase: SupabaseClient }

async function ensureSiteMembership(supabase: SupabaseClient, agencyId: string) {
    const { error } = await supabase.rpc('ensure_agency_client_membership', {
        p_agency_id: agencyId,
    })
    if (error) throw error
}

async function assertSiteCustomerAccess(supabase: SupabaseClient, agencyId: string) {
    const { data, error } = await supabase.rpc('can_access_agency_customer_site', {
        p_agency_id: agencyId,
    })
    if (error) throw error
    if (!data) {
        await supabase.auth.signOut()
        throw new Error('You do not have access to this agency site.')
    }
}

export async function completeAgencySiteAuth(
    supabase: SupabaseClient,
    agencyId: string
) {
    await ensureSiteMembership(supabase, agencyId)
    await assertSiteCustomerAccess(supabase, agencyId)
}

export function authService({ supabase }: AuthServiceProps) {
    return {
        signInWithMagicLink: async (payload: MagicLinkDTO) => {
            const { error } = await supabase.auth.signInWithOtp({
                email: payload.email,
                options: {
                    shouldCreateUser: true,
                    emailRedirectTo: payload.emailRedirectTo,
                    data: {
                        ...(payload.agency_id ? { agency_id: payload.agency_id } : {}),
                        ...(payload.agency_site_url
                            ? { agency_site_url: payload.agency_site_url }
                            : {}),
                    },
                },
            })
            if (error) throw error
        },

        loginWithGoogle: async ({ redirectTo, agency_id }: GoogleLoginDTO) => {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo,
                    ...(agency_id ? { data: { agency_id } } : {}),
                },
            })
            if (error) throw error
            return data
        },

        logout: async () => {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
        },

        getUser: async () => {
            const { data, error } = await supabase.auth.getUser()
            if (error) throw error
            return data.user
        },

        completeAgencySiteAuth: async (agencyId: string) => {
            await completeAgencySiteAuth(supabase, agencyId)
        },
    }
}

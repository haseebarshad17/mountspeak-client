import type { SupabaseClient } from '@supabase/supabase-js'
import { resolveBrandingAssetUrl } from '@/lib/media/resolve-theme-asset'
import type { UpdateUserProfileInput, UserProfile } from './user-profile.types'

function mapProfile(
    userId: string,
    email: string,
    row: {
        full_name?: string | null
        phone?: string | null
        location?: string | null
        avatar_url?: string | null
        email?: string | null
    } | null
): UserProfile {
    return {
        id: userId,
        email: row?.email || email,
        fullName: row?.full_name?.trim() || '',
        phone: row?.phone?.trim() || '',
        location: row?.location?.trim() || '',
        avatarUrl: resolveBrandingAssetUrl(row?.avatar_url) || row?.avatar_url || null,
    }
}

export function userProfileService({ supabase }: { supabase: SupabaseClient }) {
    return {
        async getProfile(userId: string, email: string): Promise<UserProfile> {
            const { data, error } = await supabase
                .from('users')
                .select('full_name, phone, location, email, avatar_url')
                .eq('id', userId)
                .maybeSingle()

            if (error) throw error
            return mapProfile(userId, email, data)
        },

        async updateProfile(
            userId: string,
            email: string,
            input: UpdateUserProfileInput
        ): Promise<UserProfile> {
            const payload = {
                full_name: input.fullName.trim(),
                phone: input.phone.trim(),
                location: input.location.trim(),
            }

            const { data, error } = await supabase
                .from('users')
                .update(payload)
                .eq('id', userId)
                .select('full_name, phone, location, email, avatar_url')
                .single()

            if (error) throw error
            return mapProfile(userId, email, data)
        },
    }
}

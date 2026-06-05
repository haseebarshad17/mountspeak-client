import type { User } from '@supabase/supabase-js'

export function isEmailVerified(
    user: Pick<User, 'email_confirmed_at'> | null | undefined
): boolean {
    return Boolean(user?.email_confirmed_at)
}

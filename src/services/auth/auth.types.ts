// User Role Enum 
export type UserRoleEnum =
    | 'CLIENT'
    | 'super_admin'
    | 'agency_admin'
    | 'agency_member'
    | 'agency_client'


// Login DTO
export type LoginDTO = {
    email: string
    password: string
    /** Agency context for sign-in on an agency site. */
    agency_id?: string
}

// Forgot password DTO
export type ForgotPasswordDTO = {
    email: string
    redirectTo: string
}

// Resend verification email DTO
export type ResendVerificationDTO = {
    email: string
    emailRedirectTo: string
}

// Reset password DTO
export type ResetPasswordDTO = {
    password: string
}


// Google OAuth DTO
export type GoogleLoginDTO = {
    redirectTo: string
    agency_id?: string
}

// Signup DTO
export type SignupDTO = {
    email: string
    password: string

    full_name: string
    role: UserRoleEnum

    avatar_url?: string
    emailRedirectTo?: string
    /** Agency the user is signing up under (from agency site theme). */
    agency_id?: string
    /** Canonical agency site URL for auth email branding. */
    agency_site_url?: string
}


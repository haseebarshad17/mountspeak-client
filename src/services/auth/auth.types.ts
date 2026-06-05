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


// Signup DTO
export type SignupDTO = {
    email: string
    password: string

    full_name: string
    role: UserRoleEnum

    avatar_url?: string
    emailRedirectTo?: string
}


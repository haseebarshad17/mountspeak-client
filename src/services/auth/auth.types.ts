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


// Signup DTO
export type SignupDTO = {
    email: string
    password: string

    full_name: string
    role: UserRoleEnum

    avatar_url?: string
}


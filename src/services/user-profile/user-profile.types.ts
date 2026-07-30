export type UserProfile = {
    id: string
    email: string
    fullName: string
    phone: string
    location: string
    avatarUrl: string | null
}

export type UpdateUserProfileInput = {
    fullName: string
    phone: string
    location: string
}

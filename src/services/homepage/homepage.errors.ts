export type HomepageLoadErrorCode =
    | 'SITE_HOST_MISSING'
    | 'SITE_NOT_FOUND'
    | 'INVALID_THEME'
    | 'SUPABASE_ERROR'

export class HomepageLoadError extends Error {
    readonly code: HomepageLoadErrorCode
    readonly status: number

    constructor(message: string, code: HomepageLoadErrorCode, status: number) {
        super(message)
        this.name = 'HomepageLoadError'
        this.code = code
        this.status = status
    }
}

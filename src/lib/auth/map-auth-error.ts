import { isMessageCode, MessageCode, type MessageCodeValue } from '@/lib/messages/codes'

type AuthErrorContext = 'signup' | 'login' | 'google' | 'generic'

function extractErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    if (typeof error === 'object' && error && 'message' in error) {
        return String((error as { message: unknown }).message)
    }
    return ''
}

function extractErrorCode(error: unknown): string {
    if (typeof error === 'object' && error && 'code' in error) {
        return String((error as { code?: unknown }).code ?? '').toLowerCase()
    }
    return ''
}

export function isEmailAlreadyRegisteredError(error: unknown): boolean {
    const message = extractErrorMessage(error).toLowerCase()
    const code = extractErrorCode(error)

    return (
        code === 'user_already_exists' ||
        code === 'email_exists' ||
        message.includes('already registered') ||
        message.includes('already been registered') ||
        message.includes('user already registered') ||
        message.includes('email address has already been registered') ||
        message.includes('email already in use') ||
        message.includes('email already registered') ||
        (message.includes('already exists') && message.includes('email'))
    )
}

export function mapAuthErrorToMessageCode(
    error: unknown,
    context: AuthErrorContext = 'generic',
): MessageCodeValue {
    if (error instanceof Error && isMessageCode(error.message)) {
        return error.message
    }

    if (isEmailAlreadyRegisteredError(error)) {
        return MessageCode.AUTH_EMAIL_ALREADY_REGISTERED
    }

    switch (context) {
        case 'signup':
            return MessageCode.API_AUTH_SIGNUP_FAILED
        case 'login':
            return MessageCode.API_AUTH_LOGIN_FAILED
        case 'google':
            return MessageCode.API_AUTH_GOOGLE_FAILED
        default:
            return MessageCode.API_GENERIC
    }
}

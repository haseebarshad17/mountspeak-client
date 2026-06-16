import messages from '@/data/messages/messages.json'
import type { ZodIssue } from 'zod'

import { isMessageCode, MessageCode, type MessageCodeValue } from './codes'

const messageCatalog = messages as Record<string, string>

export function getMessage(
    code: MessageCodeValue | string,
    params?: Record<string, string | number>,
): string {
    const template = messageCatalog[code] ?? messageCatalog[MessageCode.API_GENERIC]

    if (!params) return template

    return Object.entries(params).reduce((result, [key, value]) => {
        return result.replaceAll(`{{${key}}}`, String(value))
    }, template)
}

export function mapZodIssuesToFieldErrors(issues: ZodIssue[]): Record<string, string> {
    const errors: Record<string, string> = {}

    for (const issue of issues) {
        const key = String(issue.path[0] ?? 'form')
        if (errors[key]) continue

        const code = issue.message
        errors[key] = isMessageCode(code) ? getMessage(code) : getMessage(MessageCode.API_GENERIC)
    }

    return errors
}
